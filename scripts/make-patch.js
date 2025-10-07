#!/usr/bin/env node
/**
 * make-patch.js
 * Generates a patch of staged + unstaged changes, including NEW files,
 * excluding this script and any extra --exclude patterns.
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function ts() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return `patch-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.patch`;
}

function must(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (res.status !== 0) {
    const msg = (res.stderr || res.stdout || "").trim();
    throw new Error(`${cmd} ${args.join(" ")}\n${msg}`);
  }
  return res.stdout.trim();
}

// Parse args
const argv = process.argv.slice(2);
let outName = null;
const excludes = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--exclude") {
    excludes.push(argv[++i] ?? "");
  } else if (a.startsWith("--exclude=")) {
    excludes.push(a.slice("--exclude=".length));
  } else if (!outName) {
    outName = a;
  } else {
    console.error(`Unrecognized argument: ${a}`);
    process.exit(1);
  }
}

try {
  // Ensure we’re in a repo and get root
  must("git", ["rev-parse", "--is-inside-work-tree"]);
  const toplevel = must("git", ["rev-parse", "--show-toplevel"]);

  // Make untracked files appear in diff without staging content
  spawnSync("git", ["add", "-N", "."], { stdio: "ignore" });

  // Build pathspecs
  const relSelf = path
    .relative(toplevel, path.resolve(process.argv[1]))
    .split(path.sep)
    .join("/");

  const pathspecs = [
    ".",                        // start at repo root
    `:(exclude)${relSelf}`,     // exclude this script
    ...excludes.map(p => `:(exclude)${p.replace(/\\/g, "/")}`),
  ];

  // Run: git diff --binary HEAD -- <pathspecs...>
  const args = ["diff", "--binary", "HEAD", "--", ...pathspecs];
  const diff = must("git", args, { maxBuffer: 1024 * 1024 * 100 }); // 100MB buffer

  if (!diff) {
    console.log("No changes found (after exclusions). Nothing to write.");
    process.exit(0);
  }

  const filename = (outName && outName.trim()) || ts();
  const outPath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(outPath, diff, "utf8");

  console.log(`Patch written: ${outPath}`);
  console.log(`Apply with: git apply ${JSON.stringify(filename)}`);
  console.log("Excluded:", [relSelf, ...excludes].join(", "));
} catch (err) {
  console.error("Unexpected error:\n" + err.message);
  process.exit(1);
}
