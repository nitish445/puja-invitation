# 🪔 Puja Invitation — एकादशी उद्यापन एवं अखण्ड हरिकीर्तन

A one-page digital invitation with background music. It's plain HTML/CSS/JS, so it needs no build step.

- **Dates:** 19–21 November 2026
- **Venue:** ग्राम मुर्हीं, हमारी जन्मभूमि
- **Contact:** +91 95727 74629, +91 98010 36864

## Features
- Opening screen. Tapping it starts the song, because browsers block autoplay.
- Live countdown, day-by-day programme and falling marigold petals
- Buttons for RSVP on WhatsApp, Call, Share and Add to Google Calendar
- Personal greeting for a guest: add `?guest=Name` to the link, e.g. `index.html?guest=Sharma%20Parivar`
- Music on/off button
- **Virtual आरती**: a lit aarti plate circles Lord Vishnu in the traditional order (feet ×4, navel ×2, face ×1, whole body ×3) with conch and bell sounds
- **पुष्पांजलि**: shower flowers on Lord Vishnu with the button or by tapping his picture
- **जप माला**: tap to chant on a 108-bead mala, with completed rounds counted
- **दीप जलाएँ**: light 11 diyas one by one to complete a deepmala
- **आरती के बोल**: full "ॐ जय जगदीश हरे" lyrics (Roman letters in English mode); while open, the aarti keeps circling until stopped
- **एकादशी महात्म्य**: the significance of Ekadashi, Akhand Harikirtan and Udyapan
- **हिंदी / English** switch (remembered per visitor; `?lang=en` opens in English)
- **Download section** with the invitation as a **PDF** (`assets/invitation.pdf`), a **video with music** (`assets/invitation.mp4`) and a **WhatsApp status image** (`assets/whatsapp-status.jpg`)

## Files
- `index.html` — content (all text is here)
- `style.css` — design
- `app.js` — music, countdown, petals and links
- `assets/song.mp3` — background song
- `assets/vishnu.webp` — artwork
- `assets/invitation.pdf`, `assets/invitation.mp4` — downloadable invitation
- `tools/` — scripts that generate the PDF and video

## Regenerating the PDF and video
If you change the text, rebuild the downloads (needs Node + Playwright, ffmpeg and python3 with numpy and Pillow):

```bash
node tools/make-pdf.js
node tools/make-video.js
node tools/make-status.js
```

## Publish free with GitHub Pages
Repo **Settings → Pages → Deploy from a branch** → pick the branch and `/ (root)`.

---
Designed & created by **Nitish Kumar** || Software Engineer
