(() => {
  // Puja starts 19 Nov 2026 (IST)
  const START = new Date("2026-11-19T00:00:00+05:30");
  const PHONE = "919572774629";
  const TITLE = "श्री एकादशी महायज्ञ एवं वैदिक अनुष्ठान कार्यक्रम";

  const $ = (id) => document.getElementById(id);
  const gate = $("gate");
  const invite = $("invite");
  const song = $("song");
  const musicBtn = $("musicBtn");

  // ----- Optional guest name: ?guest=Sharma%20Parivar -----
  const guest = new URLSearchParams(location.search).get("guest");
  if (guest) {
    const line = $("guestLine");
    line.textContent = `आदरणीय ${guest.trim()} — आपकी प्रतीक्षा रहेगी 🙏`;
    line.hidden = false;
  }

  // ----- Music -----
  song.volume = 0.8;
  const setMusicUi = () => musicBtn.classList.toggle("paused", song.paused);
  const playSong = () => song.play().then(setMusicUi).catch(setMusicUi);
  musicBtn.addEventListener("click", () => {
    if (song.paused) playSong();
    else { song.pause(); setMusicUi(); }
  });
  song.addEventListener("pause", setMusicUi);
  song.addEventListener("play", setMusicUi);

  // ----- Open invitation -----
  $("openBtn").addEventListener("click", () => {
    playSong();
    invite.hidden = false;
    musicBtn.hidden = false;
    gate.classList.add("leaving");
    setTimeout(() => gate.remove(), 900);
    burstPetals(25);
    setInterval(() => burstPetals(3), 1400);
    observeReveals();
  });

  // ----- Petals -----
  const petalBox = $("petals");
  const colors = ["#ff7a1a", "#ffb000", "#ffd23f", "#e63b2e", "#ff9f1c"];
  function burstPetals(n) {
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

  // ----- Reveal on scroll -----
  function observeReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
  }

  // ----- Countdown -----
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = START - Date.now();
    if (diff <= 0) {
      $("countdown").hidden = true;
      $("cdDone").hidden = false;
      return;
    }
    const s = Math.floor(diff / 1000);
    $("cdD").textContent = Math.floor(s / 86400);
    $("cdH").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cdM").textContent = pad(Math.floor((s % 3600) / 60));
    $("cdS").textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

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
