// Generates assets/invitation.pdf from the website.
// Usage: node tools/make-pdf.js   (needs Playwright + Chromium)
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.goto("file://" + path.join(root, "index.html") + "?capture=pdf");
  await page.emulateMedia({ media: "screen", reducedMotion: "no-preference" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
  // freeze every animation in a pleasant state
  await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.pause(); } catch (_) {} }));
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await page.pdf({
    path: path.join(root, "assets", "invitation.pdf"),
    width: "430px",
    height: height + 2 + "px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: "1",
  });
  console.log("PDF written, page height", height);
  await browser.close();
})();
