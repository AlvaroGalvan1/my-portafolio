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

const filesToScan = [
  "src/components/gallery/data.ts",
  "src/content/profile.ts",
  "src/components/sections/About.tsx",
];

const pathPattern = /["'](\/(?:gallery|papers|hero)\/[^"'?#]+|\/profile\.png|\/cv\.pdf)["']/g;

const missing = [];
for (const file of filesToScan) {
  const abs = join(root, file);
  if (!existsSync(abs)) continue;
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
    "\nThese render as hidden gallery tiles / hidden images at runtime, not broken " +
      "boxes — but they're worth fixing. Add the file, or update the entry.\n",
  );
}
