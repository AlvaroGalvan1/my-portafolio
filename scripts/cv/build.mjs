// Prints scripts/cv/cv.html to public/cv.pdf: one US Letter page, in the
// site's own type. Edit the HTML, then run:
//
//   npx -y -p playwright node scripts/cv/build.mjs
//
// (Playwright is not a project dependency; `npx -p` fetches it for the run.
// First use may also need `npx playwright install chromium`.)
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(here, "cv.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const overflow = await page.evaluate(() => document.body.scrollHeight - document.body.clientHeight);
if (overflow > 0) console.warn(`Warning: content runs ${overflow}px past one page.`);

await page.pdf({
  path: path.join(here, "../../public/cv.pdf"),
  format: "Letter",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log("Wrote public/cv.pdf");
