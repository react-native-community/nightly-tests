import dotenv from "dotenv";
import firebase from "firebase-admin";
import fs from "node:fs/promises";
import path from "node:path";

const DAYS_TO_SHOW = 7;
const ENCODING = "utf8";

dotenv.config({
  encoding: ENCODING,
  quiet: true,
});

const credential = JSON.parse(
  Buffer.from(process.env.FIREBASE_APP_SERVICE_KEY, "base64").toString(
    ENCODING,
  ),
);

async function main() {
  firebase.initializeApp({
    credential: firebase.credential.cert(credential),
    databaseURL: `https://${process.env.FIREBASE_APP_PROJECTNAME}.firebaseio.com`,
  });

  const rootDb = firebase.database().ref("/");
  const snapshot = await rootDb.once("value");
  const data = snapshot.val() ?? {};

  const tableDataMap = new Map();
  const trimmedData = Object.entries(data["nightly-results"]).slice(
    -DAYS_TO_SHOW,
  );

  for (const [date, entries] of trimmedData) {
    for (const { library, platform, status } of entries) {
      if (!tableDataMap.has(library)) {
        tableDataMap.set(library, { library, results: {} });
      }
      const rec = tableDataMap.get(library);
      if (!rec.results[date]) {
        rec.results[date] = {};
      }
      rec.results[date][platform.toLowerCase()] = status;
    }
  }

  const sortedData = Array.from(tableDataMap.values()).sort((a, b) =>
    a.library.localeCompare(b.library),
  );

  const outPath = path.resolve("public/data.json");
  await fs.writeFile(outPath, JSON.stringify(sortedData, null, 2), ENCODING);

  console.log(`✅ Data export completed: ${outPath}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error exporting data:", error);
  process.exit(1);
});
