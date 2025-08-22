import dotenv from "dotenv";
import firebase from "firebase-admin";
import fs from "node:fs/promises";
import path from "node:path";

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

  for (const [date, entries] of Object.entries(data["nightly-results"])) {
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

  const outPath = path.resolve("public/data.json");
  await fs.writeFile(
    outPath,
    JSON.stringify(
      Array.from(tableDataMap.values()).sort((a, b) =>
        a.library.localeCompare(b.library),
      ),
      null,
      2,
    ),
    ENCODING,
  );

  console.log(`✅ Data export completed: ${outPath}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error exporting data:", error);
  process.exit(1);
});
