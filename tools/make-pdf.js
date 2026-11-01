// Generates assets/invitation.pdf from the website.
// Usage: node tools/make-pdf.js   (needs Playwright + Chromium, python3 + Pillow)
//
// The page is rendered to sharp images and the PDF is built from those, so it
// opens correctly in every viewer (WhatsApp, phone galleries, browsers, Adobe).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "invite-pdf-"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 432, height: 900 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(root, "index.html") + "?capture=pdf");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.pause(); } catch (_) {} }));

  // Split into pages at section boundaries
  const cuts = await page.evaluate(() => {
    const top = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().top + scrollY - 14);
    const end = Math.ceil(document.documentElement.scrollHeight);
    return [0, top(".card-dark"), top(".card:has(.venue)"), top(".family"), end];
  });
  const images = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const file = path.join(tmp, `p${i}.png`);
    await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: cuts[i], width: 432, height: cuts[i + 1] - cuts[i] } });
    images.push(file);
  }
  await browser.close();

  const out = path.join(root, "assets", "invitation.pdf");
  execFileSync("python3", ["-I", "-c", `
import sys
from PIL import Image
out, files = sys.argv[1], sys.argv[2:]
pages = [Image.open(f).convert("RGB") for f in files]
pages[0].save(out, "PDF", resolution=216, save_all=True, append_images=pages[1:], quality=90,
              title="श्री एकादशी महायज्ञ एवं वैदिक अनुष्ठान कार्यक्रम - सादर आमंत्रण", author="Nitish Kumar")
`, out, ...images]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("PDF written:", out, "pages at", cuts.join(", "));
})();
