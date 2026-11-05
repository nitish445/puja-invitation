// Generates assets/invitation.mp4 (1080x1920, with music) from the website.
// Usage: node tools/make-video.js   (needs Playwright + Chromium, ffmpeg, python3 + numpy)
//
// Every frame is rendered deterministically: all CSS animations are paused and
// moved to the exact time of the frame, so the video is perfectly smooth.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const FPS = 24;
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "invitation.mp4");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "invite-video-"));
const FRAMES = path.join(TMP, "frames");
fs.mkdirSync(FRAMES);

// Story of the video (seconds)
const DOORS_OPEN = 3.0;
const SCROLL_PLAN = [
  // [startTime, endTime, target section selector]
  [0, 0, null],
  [7.0, 8.6, ".hero + .card"],
  [13.0, 14.6, ".mahatmya"],
  [19.0, 20.6, ".mahatmya .mh:nth-child(3)"],
  [25.0, 26.4, ".card-dark"],
  [29.0, 30.5, ".timeline"],
  [35.5, 37.0, ".card:has(.venue)"],
  [41.0, 42.5, ".family"],
  [46.5, 48.1, ".family .fam-group:nth-of-type(4)"],
  [52.5, 54.1, "END"],
];
const DURATION = 57.0;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5 });
  await page.goto("file://" + path.join(ROOT, "index.html") + "?capture=video");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);

  // Work out where each section is
  const targets = await page.evaluate((plan) => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.classList.remove("locked");
    const max = document.documentElement.scrollHeight - innerHeight;
    return plan.map(([, , sel]) => {
      if (!sel) return 0;
      if (sel === "END") return max;
      const el = document.querySelector(sel);
      const y = el.getBoundingClientRect().top + scrollY - (sel === ".timeline" ? 90 : 24);
      return Math.max(0, Math.min(max, y));
    });
  }, SCROLL_PLAN);

  // Install the frame controller in the page
  await page.evaluate(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const seen = new Map();
    const petals = [];
    const colors = ["#ff7a1a", "#ffb000", "#ffd23f", "#e63b2e", "#ff9f1c", "#f25c54"];
    const box = document.getElementById("petals");
    box.innerHTML = "";

    // finish the scroll-reveal transitions so content is simply visible
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    document.getAnimations().forEach((a) => { if (a instanceof CSSTransition) a.finish(); });

    window.__spawnPetals = (n, T) => {
      for (let i = 0; i < n; i++) {
        const p = document.createElement("span");
        p.className = "petal";
        const size = 12 + rnd() * 12;
        const dur = 6 + rnd() * 6;
        p.style.left = rnd() * 100 + "vw";
        p.style.width = size + "px";
        p.style.height = size * 1.3 + "px";
        p.style.background = colors[(rnd() * colors.length) | 0];
        p.style.animationDuration = dur + "s";
        p.style.animationDelay = rnd() * (n > 10 ? 2 : 1) + "s";
        p.style.setProperty("--drift", rnd() * 160 - 80 + "px");
        p.style.setProperty("--spin", rnd() * 720 - 360 + "deg");
        box.appendChild(p);
        petals.push({ p, end: T + dur + 3 });
      }
    };
    window.__frame = (T, y) => {
      for (const o of petals) if (o.p.isConnected && T > o.end) o.p.remove();
      window.scrollTo(0, y);
      for (const a of document.getAnimations()) {
        if (!seen.has(a)) seen.set(a, { t0: T, c0: a.currentTime || 0 });
        const s = seen.get(a);
        try { a.pause(); a.currentTime = s.c0 + (T - s.t0) * 1000; } catch (_) {}
      }
    };
  });

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function scrollAt(T) {
    let y = 0;
    for (let i = 1; i < SCROLL_PLAN.length; i++) {
      const [s, e] = SCROLL_PLAN[i];
      if (T >= e) y = targets[i];
      else if (T > s) { y = targets[i - 1] + (targets[i] - targets[i - 1]) * ease((T - s) / (e - s)); break; }
      else break;
    }
    return Math.round(y);
  }

  const total = Math.round(DURATION * FPS);
  let opened = false, gateHidden = false, nextPetal = DOORS_OPEN + 1.5;
  for (let f = 0; f < total; f++) {
    const T = f / FPS;
    if (!opened && T >= DOORS_OPEN) {
      opened = true;
      await page.evaluate((T) => {
        document.getElementById("gate").classList.add("open");
        document.querySelectorAll(".bell").forEach((b) => b.classList.add("ring"));
        window.__spawnPetals(30, T);
      }, T);
    }
    if (opened && !gateHidden && T >= DOORS_OPEN + 2.3) {
      gateHidden = true;
      await page.evaluate(() => { document.getElementById("gate").style.display = "none"; });
    }
    if (opened && T >= nextPetal) {
      nextPetal += 1.6;
      await page.evaluate((T) => window.__spawnPetals(2, T), T);
    }
    await page.evaluate(([T, y]) => window.__frame(T, y), [T, scrollAt(T)]);
    await page.screenshot({ path: path.join(FRAMES, `f${String(f).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
    if (f % 48 === 0) console.log(`frame ${f}/${total}`);
  }
  await browser.close();

  // Temple bell sound for the door opening
  const bellWav = path.join(TMP, "bell.wav");
  execFileSync("python3", ["-I", "-c", `
import numpy as np, wave, sys
sr=44100; t=np.arange(int(sr*4.5))/sr
def bell(base):
    s=np.zeros_like(t)
    for r,a,d in [(0.5,0.5,4),(1,1,3.2),(1.19,0.5,2.6),(1.56,0.35,2),(2,0.4,1.8),(2.74,0.22,1.2),(3.76,0.14,0.8),(5.4,0.08,0.5)]:
        s+=a*np.sin(2*np.pi*base*r*t)*np.exp(-t*6.9/d)
    return s
out=np.zeros(int(sr*5)); b1=bell(620); b2=bell(740)*0.8
out[:len(b1)]+=b1; o=int(sr*0.45); out[o:o+len(b2)]+=b2[:len(out)-o]
out=out/np.abs(out).max()*0.8
w=wave.open(sys.argv[1],'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
`, bellWav]);

  const ms = Math.round(DOORS_OPEN * 1000);
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y",
    "-framerate", String(FPS), "-i", path.join(FRAMES, "f%04d.jpg"),
    "-stream_loop", "-1", "-i", path.join(ROOT, "assets", "song.mp3"),
    "-i", bellWav,
    "-filter_complex",
    `[1:a]atrim=0:${DURATION},asetpts=PTS-STARTPTS,volume=0.85,afade=t=in:d=1,afade=t=out:st=${DURATION - 2.5}:d=2.5[m];` +
    `[2:a]adelay=${ms}|${ms},volume=0.9[b];[m][b]amix=inputs=2:normalize=0:duration=first[a]`,
    "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest",
    OUT,
  ]);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log("Video written:", OUT);
})();
