// Generates assets/whatsapp-status.jpg (1080x1920) from the landing page.
// Usage: node tools/make-status.js   (needs Playwright + Chromium, python3 + Pillow)
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "invite-status-"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5 });
  await page.goto("file://" + path.join(root, "index.html") + "?capture=status");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.pause(); } catch (_) {} }));
  const png = path.join(tmp, "status.png");
  await page.screenshot({ path: png });
  await browser.close();
  const out = path.join(root, "assets", "whatsapp-status.jpg");
  execFileSync("python3", ["-I", "-c", "import sys\nfrom PIL import Image\nImage.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=90, optimize=True)", png, out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("Status image written:", out);
})();
