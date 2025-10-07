#!/usr/bin/env node
/**
 * apply-patch.js
 * Applies a patch created with `git diff --binary ...` (like our make-patch script).
 *
 * Usage:
 *   node apply-patch.js <patchfile.patch> [--dry-run] [--reverse] [--reject] [--staged] [--no-3way]
 *
 * Flags:
 *   --dry-run   : Don't change anything; just check if it would apply cleanly.
 *   --reverse   : Apply the patch in reverse (i.e., undo it).
 *   --reject    : On conflicts, write *.rej files (instead of failing fast).
 *   --staged    : Apply to the index too (like `git apply --index`) so changes show up staged.
 *   --no-3way   : Disable 3-way fallback; by default we use `--3way` for resilience.
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function must(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (res.status !== 0) {
    const msg = (res.stderr || res.stdout || "").trim();
    throw new Error(`${cmd} ${args.join(" ")}\n${msg}`);
  }
  return (res.stdout || "").trim();
}

function parseArgs() {
  const argv = process.argv.slice(2);
  let file = null;
  const opts = { dryRun: false, reverse: false, reject: false, staged: false, threeWay: true };

  for (const a of argv) {
    if (!a.startsWith("--") && !file) file = a;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--reverse") opts.reverse = true;
    else if (a === "--reject") opts.reject = true;
    else if (a === "--staged") opts.staged = true;
    else if (a === "--no-3way") opts.threeWay = false;
    else {
      console.error(`Unrecognized argument: ${a}`);
      process.exit(1);
    }
  }
  if (!file) {
    console.error("Usage: node apply-patch.js <patchfile.patch> [--dry-run] [--reverse] [--reject] [--staged] [--no-3way]");
    process.exit(1);
  }
  return { file, opts };
}

try {
  // 1) Basic checks
  must("git", ["rev-parse", "--is-inside-work-tree"]);
  const { file, opts } = parseArgs();

  const patchPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(patchPath)) {
    console.error(`Patch not found: ${patchPath}`);
    process.exit(1);
  }

  // 2) Build `git apply` args (pass as array => no shell quoting issues)
  const args = ["apply", "--binary", "--whitespace=nowarn"];
  if (opts.threeWay) args.push("--3way");        // try 3-way merge using index as base
  if (opts.dryRun) args.push("--check");         // check only
  if (opts.reverse) args.push("--reverse");      // reverse apply
  if (opts.reject) args.push("--reject");        // write *.rej on failed hunks
  if (opts.staged) args.push("--index");         // update the index (stage changes)

  args.push(patchPath);

  // 3) Apply
  const res = spawnSync("git", args, { encoding: "utf8" });

  if (res.status !== 0) {
    // Helpful hints for common failure modes
    const stderr = (res.stderr || res.stdout || "").trim();
    console.error("Failed to apply patch.\n");
    console.error(stderr);

    // If 3-way was enabled and we still failed, suggest trying without it or with reverse
    if (opts.threeWay && !opts.dryRun) {
      console.error("\nTips:");
      console.error("  • If the patch was made from a different base, try: --no-3way");
      console.error("  • If you're undoing a previous apply, try: --reverse");
      console.error("  • To see where it fails without changing files, use: --dry-run");
      console.error("  • To keep partial results and .rej files, add: --reject");
    }
    process.exit(res.status || 1);
  }

  // 4) Success
  if (opts.dryRun) {
    console.log("✅ Dry run successful: patch would apply cleanly.");
  } else {
    console.log("✅ Patch applied successfully.");
    if (opts.staged) {
      console.log("   Changes are staged (used --staged).");
    } else {
      console.log("   Changes are in your working tree (not staged).");
    }
  }

} catch (err) {
  console.error("Unexpected error:\n" + err.message);
  process.exit(1);
}
