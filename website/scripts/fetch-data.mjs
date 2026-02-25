import dotenv from 'dotenv';
import firebase from 'firebase-admin';
import fs from 'node:fs/promises';
import path from 'node:path';

const DAYS_TO_SHOW = 7;
const ENCODING = 'utf8';

dotenv.config({
  encoding: ENCODING,
  quiet: true,
});

const credential = JSON.parse(
  Buffer.from(process.env.FIREBASE_APP_SERVICE_KEY, 'base64').toString(ENCODING)
);

const definitions = await fs.readFile('../libraries.json', ENCODING);
const definitionsJSON = JSON.parse(definitions);

async function fetchDirectoryData(libraries) {
  const packageNames = libraries.map(lib => getCleanPackageName(lib));
  try {
    const response = await fetch(
      `https://reactnative.directory/api/library?name=${packageNames.join(',')}`
    );

    if (!response.ok) {
      throw new Error(
        `❌ HTTP ${response.status} - Cannot fetch directory data for ${packageNames.join(', ')}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function getCleanPackageName(packageName) {
  return packageName.includes('@') && !packageName.startsWith('@')
    ? packageName.split('@')[0]
    : packageName;
}

async function main() {
  firebase.initializeApp({
    credential: firebase.credential.cert(credential),
    databaseURL: `https://${process.env.FIREBASE_APP_PROJECTNAME}.firebaseio.com`,
  });

  const rootDb = firebase.database().ref('/');
  const snapshot = await rootDb.once('value');
  const data = snapshot.val() ?? {};

  const tableDataMap = new Map();
  const trimmedData = Object.entries(data['nightly-results']).slice(
    -DAYS_TO_SHOW
  );

  for (const [date, entries] of trimmedData) {
    for (const { library, platform, status, runUrl } of entries) {
      if (definitionsJSON[library]) {
        if (!tableDataMap.has(library)) {
          const installCommand = definitionsJSON[library].installCommand
            .replace('--dev', '')
            .trim();
          const notes = definitionsJSON[library].notes;

          const directoryData = await fetchDirectoryData(
            installCommand.includes(' ')
              ? installCommand.split(' ')
              : [installCommand]
          );

          if (Object.keys(directoryData).length > 0) {
            const repositoryURLs = Object.fromEntries(
              Object.values(directoryData).map(lib => [
                lib.npmPkg,
                lib.githubUrl,
              ])
            );

            tableDataMap.set(library, {
              library,
              installCommand,
              repositoryURLs,
              notes,
              results: {},
            });
          } else {
            tableDataMap.set(library, {
              library,
              installCommand,
              notes,
              results: {},
            });
          }
        }
        const rec = tableDataMap.get(library);
        if (!rec.results[date]) {
          rec.results[date] = {};
        }
        rec.results[date][platform.toLowerCase()] = status;
        if (status === 'failure') {
          rec.results[date].runUrl = runUrl;
        }
      }
    }
  }

  const sortedData = Array.from(tableDataMap.values()).sort((a, b) =>
    a.installCommand.localeCompare(b.installCommand)
  );

  const outPath = path.resolve('public/data.json');
  await fs.writeFile(outPath, JSON.stringify(sortedData, null, 2), ENCODING);

  console.log(`✅ Data export completed: ${outPath}`);
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Error exporting data:', error);
  process.exit(1);
});
