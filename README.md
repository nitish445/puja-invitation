# 🪔 Puja Invitation — श्री एकादशी महायज्ञ एवं वैदिक अनुष्ठान कार्यक्रम

A one-page digital invitation with background music. It's plain HTML/CSS/JS, so it needs no build step.

- **Dates:** 19–21 November 2026
- **Venue:** ग्राम मुर्हीं, हमारी जन्मभूमि
- **Contact:** +91 95727 74629

## Features
- Opening screen. Tapping it starts the song, because browsers block autoplay.
- Live countdown, day-by-day programme and falling marigold petals
- Buttons for RSVP on WhatsApp, Call, Share and Add to Google Calendar
- Personal greeting for a guest: add `?guest=Name` to the link, e.g. `index.html?guest=Sharma%20Parivar`
- Music on/off button
- **Download section** with the invitation as a **PDF** (`assets/invitation.pdf`) and a **video with music** (`assets/invitation.mp4`)

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
```

## Publish free with GitHub Pages
Repo **Settings → Pages → Deploy from a branch** → pick the branch and `/ (root)`.

---
Designed & created by **Nitish Kumar** || Software Engineer
