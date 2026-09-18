#!/usr/bin/env node
// Non-blocking sanity check, run automatically before `dev`/`build` (see
// package.json's `predev`/`prebuild`): scans the content/data files for
// local `/public`-relative paths and reports any that don't exist on disk.
//
// It only WARNS (always exits 0) — it doesn't fail the build. Wiring up a
// data.ts entry before its asset file exists is a deliberate, normal part
// of this project's workflow (see TODO.md); this is just so that's a
// visible, tracked TODO instead of a silent 404 someone has to notice by
// hand. The actual guardrail against a *broken* asset reaching a real
// visitor is the runtime one (gallery tiles hide themselves on load
// failure — see src/components/gallery/reportAssetIssue.ts).
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Two of the entries here were stale and the list was quietly checking
// nothing: `About.tsx` was deleted when the toolkit moved into Background,
// and `HeroCard.tsx` has not existed under that name for some time. The
// loop `continue`s past a file that is missing, so both failures were
// silent — a checker that reports success while scanning two files that do
// not exist is worse than no checker, which is the bug below.
const filesToScan = [
  "src/components/gallery/data.ts",
  "src/content/profile.ts",
  // Company marks, and the reason this list grew: two of them
  // (hyticos.svg, fuego-earth.svg) were referenced and absent, 404ing on
  // every page load, and nothing here was looking at `/logos/` at all.
  // They degrade to a lettermark so nobody saw a broken box — which is
  // exactly the kind of failure a build-time check is for.
  "src/content/experience.ts",
  // Institution marks for the Education logo row and the map legend.
  "src/content/places.ts",
  // The CV download lives in Background's closing bar now, so a renamed
  // PDF would otherwise go unnoticed.
  "src/components/sections/Background.tsx",
];

const pathPattern = /["'](\/(?:gallery|papers|hero|logos)\/[^"'?#]+|\/profile\.png|\/cv\.pdf)["']/g;

const missing = [];
for (const file of filesToScan) {
  const abs = join(root, file);
  if (!existsSync(abs)) {
    // Loudly, rather than `continue`. A scan list that silently skips a
    // renamed file reports "all assets exist" while checking nothing.
    console.warn(`⚠ check-assets: scan target no longer exists — ${file}`);
    continue;
  }
  const text = readFileSync(abs, "utf8");
  for (const match of text.matchAll(pathPattern)) {
    const assetPath = match[1];
    if (!existsSync(join(root, "public", assetPath))) {
      missing.push({ file, assetPath });
    }
  }
}

if (missing.length === 0) {
  console.log("✓ check-assets: all referenced local assets exist.");
} else {
  console.warn(`\n⚠ check-assets: ${missing.length} referenced asset(s) missing from public/:\n`);
  for (const { file, assetPath } of missing) {
    console.warn(`  ${assetPath}  (referenced in ${file})`);
  }
  console.warn(
    "\nThese render as hidden gallery tiles, lettermarks or hidden images at " +
      "runtime rather than broken boxes — but every one of them is still a 404 " +
      "in the console on every page load. Add the file, or update the entry.\n",
  );
}
