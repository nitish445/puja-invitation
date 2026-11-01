(() => {
  // Puja starts 19 Nov 2026 (IST)
  const START = new Date("2026-11-19T00:00:00+05:30");
  const PHONE = "919572774629";
  const TITLE = "श्री एकादशी महायज्ञ एवं वैदिक अनुष्ठान कार्यक्रम";

  const $ = (id) => document.getElementById(id);
  const gate = $("gate");
  const song = $("song");
  const musicBtn = $("musicBtn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("locked");

  // ----- Optional guest name: ?guest=Sharma%20Parivar -----
  const guest = (new URLSearchParams(location.search).get("guest") || "").trim();
  if (guest) {
    $("guestLine").textContent = `आदरणीय ${guest} — आपकी प्रतीक्षा रहेगी 🙏`;
    $("guestLine").hidden = false;
    $("gateGuest").textContent = `आदरणीय ${guest}`;
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
  const toran = $("toran");
  function buildToran() {
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
  buildToran();
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildToran, 150); });

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
    setTimeout(() => gate.remove(), 2000);
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
  if (!reduceMotion) {
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
  tick();
  timer = setInterval(tick, 1000);

  // ----- Links -----
  const details =
    "19 नवंबर – वेदी निर्माण\n" +
    "20 नवंबर – वेदी आवाहन एवं पूजन, कथा एवं धार्मिक अनुष्ठान\n" +
    "21 नवंबर – वेदी पूजन, गोदान, हवन एवं पूर्णाहुति, भंडारा एवं प्रसाद वितरण\n" +
    "संपर्क: +91 95727 74629";
  $("calBtn").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(TITLE) +
    "&dates=20261119/20261122" +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent("ग्राम मुर्हीं");

  $("waBtn").href =
    `https://wa.me/${PHONE}?text=` +
    encodeURIComponent(`जय श्री हरि 🙏\n${TITLE} के निमंत्रण के लिए धन्यवाद। हम अवश्य उपस्थित होंगे।`);

  $("shareBtn").addEventListener("click", async () => {
    const url = location.href.split("?")[0];
    const text = `🪔 सादर आमंत्रण 🪔\n${TITLE}\n19–21 नवंबर 2026 · ग्राम मुर्हीं`;
    if (navigator.share) {
      try { await navigator.share({ title: TITLE, text, url }); } catch (_) { /* cancelled */ }
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank");
    }
  });
})();
