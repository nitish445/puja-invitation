(() => {
  // Puja starts 19 Nov 2026 (IST)
  const START = new Date("2026-11-19T00:00:00+05:30");
  const PHONE = "919572774629";
  const TITLE = "एकादशी उद्यापन एवं अखण्ड हरिकीर्तन";

  const $ = (id) => document.getElementById(id);
  const gate = $("gate");
  const song = $("song");
  const musicBtn = $("musicBtn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ?capture=pdf | ?capture=video is used only when generating the PDF / video
  const capture = new URLSearchParams(location.search).get("capture");
  if (capture) document.body.classList.add("capture", "capture-" + capture);

  else document.body.classList.add("locked");

  // ----- Language (हिंदी / English) -----
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage blocked */ } },
  };
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = urlLang === "en" || urlLang === "hi" ? urlLang : capture ? "hi" : store.get("lang") === "en" ? "en" : "hi";
  const T = (hi, en) => (lang === "en" ? en : hi);
  function setLabel(el, hi, en) {
    el.dataset.hi = hi;
    el.dataset.en = en;
    el.innerHTML = T(hi, en);
  }

  // ----- Optional guest name: ?guest=Sharma%20Parivar -----
  const guest = (new URLSearchParams(location.search).get("guest") || "").trim();
  function renderGuest() {
    if (!guest) return;
    $("guestLine").textContent = T(`आदरणीय ${guest} — आपकी प्रतीक्षा रहेगी 🙏`, `Dear ${guest} — we look forward to welcoming you 🙏`);
    const gg = $("gateGuest"); // gone once the landing page has closed
    if (gg) gg.textContent = T(`आदरणीय ${guest}`, `Dear ${guest}`);
  }
  if (guest) {
    renderGuest();
    $("guestLine").hidden = false;
    $("gateGuest").hidden = false;
  }

  // ----- Mandalas (drawn in SVG) -----
  function petal(r1, r2, w) {
    const m = (r1 + r2) / 2;
    return `M0,${-r1} C${w},${-m - (r1 - r2) * 0.2} ${w},${-m + (r1 - r2) * 0.2} 0,${-r2} C${-w},${-m + (r1 - r2) * 0.2} ${-w},${-m - (r1 - r2) * 0.2} 0,${-r1}Z`;
  }
  function ring(n, d, extra = "") {
    let s = "";
    for (let i = 0; i < n; i++) s += `<path d="${d}" transform="rotate(${(360 / n) * i})" ${extra}/>`;
    return s;
  }
  function dots(n, r, size) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      s += `<circle cx="${(Math.sin(a) * r).toFixed(2)}" cy="${(-Math.cos(a) * r).toFixed(2)}" r="${size}"/>`;
    }
    return s;
  }
  document.querySelectorAll("svg[data-mandala]").forEach((svg) => {
    const kind = svg.dataset.mandala;
    const outer = kind === "small" ? 12 : 24;
    svg.innerHTML = `
      <g fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.1">
        <circle r="98" fill="none"/>
        ${ring(outer, petal(97, 62, kind === "small" ? 16 : 9))}
        <circle r="62" fill="none"/>
        ${ring(16, petal(60, 30, 11))}
        <circle r="30" fill="none"/>
        ${ring(8, petal(29, 8, 6))}
      </g>
      <g fill="currentColor">${dots(outer * 2, 80, 1.6)}${dots(32, 45, 1.3)}<circle r="4"/></g>`;
  });

  // ----- Toran: marigold garland with mango leaves -----
  function buildToran(toran) {
    const W = toran.clientWidth;
    const segs = Math.max(4, Math.round(W / 72));
    const sw = W / segs;
    let html = '<div class="rope"></div>';
    for (let s = 0; s < segs; s++) {
      const x0 = s * sw;
      // drooping swag of flowers
      for (let k = 0; k <= 8; k++) {
        const x = x0 + (sw * k) / 8;
        const y = 12 + 24 * Math.sin((Math.PI * k) / 8);
        html += `<span class="fl${k % 2 ? " y" : ""}" style="left:${x}px;top:${y}px"></span>`;
      }
      // mango leaf under the swag
      html += `<span class="lf" style="left:${x0 + sw / 2}px;top:${44}px"></span>`;
      // hanging strand at the joint
      if (s > 0) {
        const len = s % 2 ? 5 : 3;
        let strand = "";
        for (let j = 0; j < len; j++) strand += `<span class="fl${j % 2 ? "" : " y"}" style="left:0;top:${22 + j * 15}px"></span>`;
        strand += `<span class="bead" style="left:0;top:${22 + len * 15}px"></span>`;
        html += `<div class="strand" style="left:${x0}px;animation-delay:${-s * 0.7}s">${strand}</div>`;
      }
    }
    toran.innerHTML = html;
  }
  const torans = [$("toran"), $("gateToran")];
  const buildAll = () => torans.forEach((t) => t && t.isConnected && buildToran(t));
  buildAll();
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildAll, 150); });

  // glowing lanterns floating up on the landing page
  if (!reduceMotion && $("lanterns")) {
    for (let i = 0; i < 14; i++) {
      const l = document.createElement("span");
      l.className = "lantern";
      const dur = 11 + Math.random() * 10;
      const near = Math.random() < 0.35;
      l.style.left = 4 + Math.random() * 92 + "%";
      l.style.animationDuration = (near ? dur * 0.8 : dur) + "s";
      l.style.animationDelay = -Math.random() * dur + "s";
      l.style.setProperty("--s", near ? 1.2 + Math.random() * 0.4 : 0.5 + Math.random() * 0.4);
      l.style.setProperty("--o", near ? 0.95 : 0.55);
      l.style.setProperty("--sway", Math.random() * 60 - 30 + "px");
      if (!near) l.style.filter = "blur(1px)";
      $("lanterns").appendChild(l);
    }
  }

  // golden sparkles drifting over the landing page
  if (!reduceMotion && $("gateSparks")) {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const dur = 6 + Math.random() * 6;
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = -Math.random() * dur + "s";
      s.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      $("gateSparks").appendChild(s);
    }
  }

  // ----- Temple bell sound (synthesised) -----
  let actx;
  function bell(base = 660, vol = 0.35) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime;
      const out = actx.createGain();
      out.gain.value = vol;
      out.connect(actx.destination);
      [[0.5, 0.5, 4], [1, 1, 3.2], [1.19, 0.5, 2.6], [1.56, 0.35, 2], [2, 0.4, 1.8], [2.74, 0.22, 1.2], [3.76, 0.14, 0.8], [5.4, 0.08, 0.5]]
        .forEach(([ratio, amp, decay]) => {
          const o = actx.createOscillator();
          const g = actx.createGain();
          o.type = "sine";
          o.frequency.value = base * ratio * (1 + (Math.random() - 0.5) * 0.004);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(amp, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          o.connect(g).connect(out);
          o.start(t);
          o.stop(t + decay + 0.1);
        });
    } catch (_) { /* audio not available */ }
  }
  document.querySelectorAll(".bell").forEach((b, i) => {
    b.addEventListener("click", () => {
      bell(i ? 740 : 620);
      b.classList.remove("ring");
      void b.offsetWidth;
      b.classList.add("ring");
      burstPetals(8);
    });
    b.addEventListener("animationend", (e) => { if (e.animationName === "ring") b.classList.remove("ring"); });
  });

  // ----- Music -----
  song.volume = 0.8;
  const setMusicUi = () => musicBtn.classList.toggle("paused", song.paused);
  const playSong = () => song.play().then(setMusicUi).catch(setMusicUi);
  musicBtn.addEventListener("click", () => {
    if (song.paused) playSong();
    else song.pause();
  });
  song.addEventListener("pause", setMusicUi);
  song.addEventListener("play", setMusicUi);

  // ----- Open the temple doors -----
  $("openBtn").addEventListener("click", () => {
    bell(620, 0.4);
    setTimeout(() => bell(740, 0.3), 450);
    playSong();
    gate.classList.add("open");
    musicBtn.hidden = false;
    setTimeout(() => {
      document.body.classList.remove("locked");
      observeReveals();
      burstPetals(30);
    }, 700);
    setTimeout(() => gate.remove(), 1900);
    if (!reduceMotion) setInterval(() => burstPetals(2), 1600);
  });

  // ----- Petals -----
  const petalBox = $("petals");
  const colors = ["#ff7a1a", "#ffb000", "#ffd23f", "#e63b2e", "#ff9f1c", "#f25c54"];
  function burstPetals(n) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const size = 10 + Math.random() * 10;
      const dur = 6 + Math.random() * 6;
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = size + "px";
      p.style.height = size * 1.3 + "px";
      p.style.background = colors[(Math.random() * colors.length) | 0];
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = Math.random() * (n > 10 ? 2 : 1) + "s";
      p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
      petalBox.appendChild(p);
      setTimeout(() => p.remove(), (dur + 3) * 1000);
    }
  }

  // ----- Golden sparkles floating up -----
  if (!reduceMotion && capture !== "pdf") {
    const sp = $("sparkles");
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const dur = 9 + Math.random() * 10;
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = -Math.random() * dur + "s";
      s.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      const k = 0.6 + Math.random() * 0.8;
      s.style.transform = `scale(${k})`;
      sp.appendChild(s);
    }
  }

  // ----- Reveal on scroll -----
  function observeReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  // ----- Conch (shankh) sound, synthesised -----
  function shankh(dur = 2.6, vol = 0.32) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime;
      const out = actx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(vol, t + 0.45);
      out.gain.setValueAtTime(vol, t + dur - 0.6);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const lp = actx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 1700; lp.Q.value = 2.5;
      const peak = actx.createBiquadFilter();
      peak.type = "peaking"; peak.frequency.value = 900; peak.gain.value = 9; peak.Q.value = 2;
      lp.connect(peak).connect(out).connect(actx.destination);
      const vib = actx.createOscillator();
      const vibAmt = actx.createGain();
      vib.frequency.value = 5.2; vibAmt.gain.value = 2.2;
      vib.connect(vibAmt);
      [[1, "sawtooth", 0.55], [2, "sawtooth", 0.18], [3, "triangle", 0.12]].forEach(([mul, type, amp]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(205 * mul, t);
        o.frequency.exponentialRampToValueAtTime(233 * mul, t + 0.5);
        vibAmt.connect(o.frequency);
        g.gain.value = amp;
        o.connect(g).connect(lp);
        o.start(t); o.stop(t + dur + 0.05);
      });
      // breath noise
      const len = Math.floor(actx.sampleRate * dur);
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const n = actx.createBufferSource();
      const bp = actx.createBiquadFilter();
      const ng = actx.createGain();
      n.buffer = buf; bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 1.2; ng.gain.value = 0.05;
      n.connect(bp).connect(ng).connect(out);
      n.start(t);
      vib.start(t); vib.stop(t + dur + 0.05);
    } catch (_) { /* audio not available */ }
  }

  // ----- Virtual Aarti -----
  const wrap = document.querySelector(".art-wrap");
  const thali = $("thali");
  const offerings = $("offerings");
  const aartiBtn = $("aartiBtn");
  const toast = $("toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }
  function ringBells() {
    document.querySelectorAll(".bell").forEach((b) => {
      b.classList.remove("ring"); void b.offsetWidth; b.classList.add("ring");
    });
  }
  // Traditional order: 4 circles at the feet, 2 at the navel, 1 at the face, then 3 around the whole body.
  // Values are fractions of the picture's width/height.
  const AARTI_PATH = [
    { cx: 0.5, cy: 0.84, rx: 0.13, ry: 0.06, turns: 4, dur: 3.2 },
    { cx: 0.5, cy: 0.52, rx: 0.12, ry: 0.06, turns: 2, dur: 1.8 },
    { cx: 0.5, cy: 0.25, rx: 0.11, ry: 0.06, turns: 1, dur: 1.1 },
    { cx: 0.5, cy: 0.5, rx: 0.36, ry: 0.36, turns: 3, dur: 4.8 },
  ];
  const MOVE = 0.45; // seconds to glide between stages
  const aartiTotal = AARTI_PATH.reduce((s, p) => s + p.dur + MOVE, 0);
  const ptOn = (p, frac) => {
    const a = frac * p.turns * Math.PI * 2; // clockwise from the bottom
    return [p.cx - Math.sin(a) * p.rx, p.cy + Math.cos(a) * p.ry];
  };
  function aartiPos(t) {
    let prev = [0.5, 1.05];
    for (const p of AARTI_PATH) {
      const start = ptOn(p, 0);
      if (t < MOVE) {
        const k = t / MOVE, e = k * k * (3 - 2 * k);
        return [prev[0] + (start[0] - prev[0]) * e, prev[1] + (start[1] - prev[1]) * e];
      }
      t -= MOVE;
      if (t < p.dur) return ptOn(p, t / p.dur);
      t -= p.dur;
      prev = ptOn(p, 1);
    }
    return prev;
  }
  let aartiRunning = false;
  let aartiLoop = false;   // lyrics open: keep circling until stopped
  let aartiStop = false;
  const lyricsBtn = $("lyricsBtn");
  const lyrics = $("aartiLyrics");
  const AARTI_HI = "🪔 आरती करें", AARTI_EN = "🪔 Perform Aarti";
  lyricsBtn.addEventListener("click", () => {
    const open = lyrics.hidden;
    lyrics.hidden = !open;
    lyricsBtn.setAttribute("aria-expanded", String(open));
    aartiLoop = open;
    if (open) {
      lyrics.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      if (!aartiRunning) aartiBtn.click();
    }
  });
  aartiBtn.addEventListener("click", () => {
    if (aartiRunning) {
      // running in sing-along mode: this button stops it
      if (aartiLoop) { aartiStop = true; aartiBtn.disabled = true; }
      return;
    }
    aartiRunning = true;
    aartiStop = false;
    if (aartiLoop) setLabel(aartiBtn, "⏹ आरती रोकें", "⏹ Stop Aarti");
    else aartiBtn.disabled = true;
    const prevVol = song.volume;
    song.volume = Math.min(prevVol, 0.3);
    shankh();
    thali.classList.add("on");
    let t0 = performance.now();
    let lastSpark = 0, lastBell = 0, bellNo = 0;
    function step(now) {
      const t = (now - t0) / 1000;
      const r = wrap.getBoundingClientRect();
      const [fx, fy] = aartiPos(Math.min(t, aartiTotal));
      const x = fx * r.width, y = fy * r.height;
      thali.style.transform = `translate(${x - 55}px, ${y - 55}px)`;
      if (now - lastSpark > 35) {
        lastSpark = now;
        const s = document.createElement("i");
        s.className = "aarti-spark";
        s.style.left = x + (Math.random() * 12 - 6) + "px";
        s.style.top = y - 22 + (Math.random() * 10 - 5) + "px";
        offerings.appendChild(s);
        setTimeout(() => s.remove(), 1650);
      }
      if (t > 1.2 && t - lastBell > (aartiLoop ? 1.1 : 0.55) && t < aartiTotal) {
        lastBell = t;
        bell(bellNo++ % 2 ? 1180 : 990, 0.16);
        if (bellNo % 3 === 0) ringBells();
      }
      if (t < aartiTotal + 0.3) requestAnimationFrame(step);
      else if (aartiLoop && !aartiStop) {
        // another round of the aarti
        t0 = now; lastBell = 0;
        requestAnimationFrame(step);
      } else {
        thali.classList.remove("on");
        shankh(2, 0.25);
        burstPetals(20);
        showToast(T("🙏 आरती सम्पन्न — जय श्री हरि!", "🙏 Aarti complete — Jai Shri Hari!"));
        setTimeout(() => {
          song.volume = prevVol;
          aartiRunning = false;
          aartiBtn.disabled = false;
          setLabel(aartiBtn, AARTI_HI, AARTI_EN);
        }, 1200);
      }
    }
    requestAnimationFrame(step);
  });

  // ----- Pushpanjali (flower offering) -----
  const FLOWERS = ["marigold", "marigold y", "rose", "marigold", "rose", "emoji"];
  const EMOJI = ["🌸", "🌺", "🌼", "🪷"];
  let lastPushpToast = 0;
  function pushpanjali(n = 22) {
    const r = wrap.getBoundingClientRect();
    if (offerings.childElementCount > 160) return;
    bell(1320, 0.12);
    for (let i = 0; i < n; i++) {
      const f = document.createElement("span");
      const kind = FLOWERS[(Math.random() * FLOWERS.length) | 0];
      f.className = "offer " + kind;
      if (kind === "emoji") f.textContent = EMOJI[(Math.random() * EMOJI.length) | 0];
      const x0 = r.width * (0.25 + Math.random() * 0.5);
      const x1 = x0 + (Math.random() * 80 - 40);
      // land around the lap and feet
      const y1 = r.height * (0.62 + Math.random() * 0.3);
      f.style.setProperty("--x0", x0 + "px");
      f.style.setProperty("--x1", x1 + "px");
      f.style.setProperty("--y1", y1 + "px");
      f.style.setProperty("--rot", Math.random() * 540 - 270 + "deg");
      f.style.setProperty("--dur", 1.3 + Math.random() * 0.9 + "s");
      f.style.setProperty("--stay", 2.6 + Math.random() * 1.2 + "s");
      f.style.animationDelay = Math.random() * 0.6 + "s, " + (2.6 + Math.random() * 1.2) + "s";
      offerings.appendChild(f);
      setTimeout(() => f.remove(), 5200);
    }
    if (Date.now() - lastPushpToast > 4000) {
      lastPushpToast = Date.now();
      showToast(T("🌸 पुष्पांजलि अर्पित — जय श्री हरि 🙏", "🌸 Flowers offered — Jai Shri Hari 🙏"));
    }
  }
  $("pushpBtn").addEventListener("click", () => pushpanjali(26));
  $("deity").addEventListener("click", () => pushpanjali(12));

  // ----- Countdown -----
  const pad = (n) => String(n).padStart(2, "0");
  let timer;
  function tick() {
    const diff = START - Date.now();
    if (diff <= 0) {
      $("countdown").hidden = true;
      $("cdDone").hidden = false;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    $("cdD").textContent = Math.floor(s / 86400);
    $("cdH").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cdM").textContent = pad(Math.floor((s % 3600) / 60));
    $("cdS").textContent = pad(s % 60);
  }
  if (capture) {
    // A saved file can't count down, so show the three dates instead
    const cd = $("countdown");
    cd.classList.add("static");
    cd.innerHTML = "<div><span>19</span><small>गुरुवार</small></div><div><span>20</span><small>शुक्रवार</small></div><div><span>21</span><small>शनिवार</small></div>";
    cd.closest(".card").querySelector("h2").textContent = "पावन तिथियाँ";
    cd.parentElement.querySelector(".cd-sub").textContent = "नवंबर 2026";
    if (capture === "pdf") {
      gate.remove();
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    }
  } else {
    tick();
    timer = setInterval(tick, 1000);
  }

  // ----- Links -----
  const details =
    "19 नवंबर – वेदी निर्माण एवं अखण्ड हरिकीर्तन\n" +
    "20 नवंबर – वेदी आवाहन पूजन एवं एकादशी महात्मकथा\n" +
    "21 नवंबर – वेदी पूजन, हवन पूर्णाहुति एवं हरिनाम अमृत भोज (1 बजे से)\n" +
    "संपर्क: +91 95727 74629, +91 98010 36864";
  $("calBtn").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(TITLE) +
    "&dates=20261119/20261122" +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent("ग्राम मुर्हीं");

  const TITLE_EN = "Ekadashi Udyapan & Akhand Harikirtan";
  function setReplyLink() {
    $("waBtn").href =
      `https://wa.me/${PHONE}?text=` +
      encodeURIComponent(T(
        `जय श्री हरि 🙏\n${TITLE} के निमंत्रण के लिए धन्यवाद। हम अवश्य उपस्थित होंगे।`,
        `Jai Shri Hari 🙏\nThank you for the invitation to the ${TITLE_EN}. We will surely be there.`
      ));
  }

  $("shareBtn").addEventListener("click", async () => {
    const url = location.href.split("?")[0];
    const text = T(
      `🪔 सादर आमंत्रण 🪔\n${TITLE}\n19–21 नवंबर 2026 · ग्राम मुर्हीं`,
      `🪔 You are invited 🪔\n${TITLE_EN}\n19–21 November 2026 · Village Murhi`
    );
    if (navigator.share) {
      try { await navigator.share({ title: TITLE, text, url }); } catch (_) { /* cancelled */ }
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank");
    }
  });

  // ----- Jap mala (108 beads) -----
  const BEADS = 108;
  const malaRing = $("malaRing");
  const malaBtn = $("mala");
  if (malaRing && malaBtn) {
    const NS = "http://www.w3.org/2000/svg";
    const beads = [];
    for (let i = 0; i < BEADS; i++) {
      const a = (i / BEADS) * Math.PI * 2;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", (Math.sin(a) * 92).toFixed(2));
      c.setAttribute("cy", (-Math.cos(a) * 92).toFixed(2));
      c.setAttribute("r", "2.55");
      c.setAttribute("stroke", "#7a4a02");
      c.setAttribute("stroke-width", ".5");
      malaRing.appendChild(c);
      beads.push(c);
    }
    let total = parseInt(store.get("japTotal") || "0", 10) || 0;
    let doneFlash = false;
    const countEl = $("malaCount"), roundsEl = $("malaRounds"), totalEl = $("malaTotal"), mantraEl = $("malaMantra");
    function paint() {
      const n = doneFlash ? BEADS : total % BEADS;
      beads.forEach((b, i) => {
        b.setAttribute("fill", i < n ? "url(#beadDone)" : "url(#beadGold)");
        b.classList.toggle("cur", i === total % BEADS);
        b.setAttribute("r", i === total % BEADS ? "3.6" : "2.55");
      });
      // turn the mala so the next bead sits under the pointer
      malaRing.style.transform = `rotate(${-(total * 360) / BEADS}deg)`;
      countEl.textContent = doneFlash ? BEADS : total % BEADS;
      roundsEl.textContent = Math.floor(total / BEADS);
      totalEl.textContent = total;
    }
    function chant() {
      total++;
      store.set("japTotal", String(total));
      const om = document.createElement("span");
      om.className = "om-float";
      om.textContent = "ॐ";
      om.style.setProperty("--dx", Math.random() * 60 - 30 + "px");
      malaBtn.appendChild(om);
      setTimeout(() => om.remove(), 1250);
      mantraEl.classList.remove("pop"); void mantraEl.offsetWidth; mantraEl.classList.add("pop");
      setTimeout(() => mantraEl.classList.remove("pop"), 160);
      if (total % BEADS === 0) {
        doneFlash = true;
        malaBtn.classList.remove("done"); void malaBtn.offsetWidth; malaBtn.classList.add("done");
        bell(620, 0.35);
        setTimeout(() => bell(740, 0.28), 380);
        ringBells();
        burstPetals(18);
        showToast(T(`🙏 एक माला पूर्ण — जय श्री हरि! (${total / BEADS})`, `🙏 One mala complete — Jai Shri Hari! (${total / BEADS})`));
        setTimeout(() => { doneFlash = false; paint(); }, 1100);
      } else {
        bell(1760, 0.045); // soft bead click
      }
      paint();
    }
    malaBtn.addEventListener("click", chant);
    $("malaReset").addEventListener("click", () => {
      total = 0;
      store.set("japTotal", "0");
      paint();
    });
    paint();
  }

  // ----- Deep jalayen (11 diyas) -----
  const dps = [...document.querySelectorAll("#deepmala .dp")];
  const diyaBtn = $("diyaBtn");
  if (dps.length && diyaBtn) {
    const DIYAS = dps.length;
    let lit = Math.min(DIYAS, parseInt(store.get("diyaLit") || "0", 10) || 0);
    let diyaTotal = parseInt(store.get("diyaTotal") || "0", 10) || 0;
    function paintDiyas() {
      dps.forEach((d, i) => d.classList.toggle("lit", i < lit));
      $("deepmala").classList.toggle("full", lit >= DIYAS);
      $("dpCount").textContent = lit;
      $("dpTotal").textContent = diyaTotal;
      if (lit >= DIYAS) setLabel(diyaBtn, "🔁 नई दीपमाला सजाएँ", "🔁 Light a New Deepmala");
      else setLabel(diyaBtn, "🪔 दीप जलाएँ", "🪔 Light a Diya");
    }
    function lightDiya() {
      if (lit >= DIYAS) { // start a fresh deepmala
        lit = 0;
        store.set("diyaLit", "0");
        paintDiyas();
        return;
      }
      lit++;
      diyaTotal++;
      store.set("diyaLit", String(lit));
      store.set("diyaTotal", String(diyaTotal));
      paintDiyas();
      if (lit >= DIYAS) {
        bell(620, 0.3);
        setTimeout(() => bell(740, 0.25), 380);
        ringBells();
        burstPetals(22);
        showToast(T("✨ दीपमाला पूर्ण — जय श्री हरि! 🙏", "✨ Deepmala complete — Jai Shri Hari! 🙏"));
      } else {
        bell(1320, 0.1);
        showToast(T("🪔 आपने दीप प्रज्वलित किया 🙏", "🪔 You lit a diya 🙏"));
      }
    }
    diyaBtn.addEventListener("click", lightDiya);
    dps.forEach((d) => d.addEventListener("click", () => { if (!d.classList.contains("lit")) lightDiya(); }));
    paintDiyas();
  }

  // ----- Apply language -----
  function applyLang() {
    document.documentElement.lang = lang;
    document.body.classList.toggle("en", lang === "en");
    document.querySelectorAll("[data-en]").forEach((el) => {
      if (el.dataset.hi === undefined) el.dataset.hi = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.hi;
    });
    document.querySelectorAll("[data-en-label]").forEach((el) => {
      if (el.dataset.hiLabel === undefined) el.dataset.hiLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enLabel : el.dataset.hiLabel);
    });
    document.title = T(
      "सादर आमंत्रण · एकादशी उद्यापन एवं अखण्ड हरिकीर्तन",
      "You Are Invited · Ekadashi Udyapan & Akhand Harikirtan"
    );
    document.querySelectorAll("#langSwitch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    renderGuest();
    setReplyLink();
  }
  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.addEventListener("click", () => {
      if (lang === b.dataset.lang) return;
      lang = b.dataset.lang;
      store.set("lang", lang);
      applyLang();
    })
  );
  applyLang();

  // tuck the language switch away while scrolling down, bring it back on scroll up
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    $("langSwitch").classList.toggle("tucked", y > 140 && y > lastY);
    lastY = y;
  }, { passive: true });
})();
