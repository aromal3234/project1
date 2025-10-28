```markdown
Aesthetic Webpage for Your Girlfriend

What this is

- A simple, responsive single-page site with a highlight video and a photo gallery where each photo has a quote below it.
- All media are placeholders in the `assets/` folder. Replace them with your own photos and video.

Files created

- `index.html` — main page (links to `styles.css` and `script.js`).
- `styles.css` — aesthetic styles (glassmorphism, pastel gradient, responsive grid).
- `script.js` — lightbox behavior for images and video pause logic. Also performs client-side HEIC -> JPEG conversion when needed.
- `assets/` — folder for your photos and video (placeholders included as filenames referenced in the HTML).

HEIC / HEIF support

- This project now includes client-side support for HEIC/HEIF images using the `heic2any` library.
- If you place `.heic` or `.heif` files in `assets/` and reference them from the gallery, the page will attempt to fetch and convert them to JPEG in the browser so they display in browsers that don't support HEIC natively.
- Conversion happens in the user's browser; no server-side component is required. Large HEIC files may take noticeable CPU and memory to convert.

How to use

1. Copy your files into the `assets/` folder. Suggested names used in the markup:
   - `assets/highlight.mp4` — highlight video (mp4 recommended).
   - `assets/video-poster.jpg` — poster image for the video.
   - `assets/photo1.jpg`, `assets/photo2.jpg`, `assets/photo3.jpg`, `assets/photo4.jpg` — gallery photos.

2. You can also use `assets/photoX.heic` or `.heif`; the script will attempt to convert them automatically.

3. Edit `index.html` captions and `data-quote` attributes if you want different quotes under each photo. Each `figure.card` has a `data-quote` attribute used by the lightbox.

4. For best results run a tiny static server (some browsers block fetches when opening `file://`):

```bash
# from inside the folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes & caveats

- Client-side conversion requires the `heic2any` library (included via CDN in `index.html`). If your user has no network access to the CDN or the library fails to load, HEIC images will not be converted.
- Converting large HEIC images in-browser can be CPU-heavy on some devices (mobile phones, low-end laptops). Consider pre-converting large batches server-side if you plan to use many HEIC images.
- Safari on macOS/iOS may support HEIC natively; the script only converts when it detects `.heic`/`.heif` assets.

Next steps (optional)

- Add an image upload form so you can drop photos straight into the page and convert them on the client before preview/submit.
- Add server-side conversion tooling if you want to avoid client CPU usage and support older browsers consistently.

Enjoy — drop your photos and highlight video into `assets/` and the page will show your memories beautifully.
```
Aesthetic Webpage for Your Girlfriend

What this is

- A simple, responsive single-page site with a highlight video and a photo gallery where each photo has a quote below it.
- All media are placeholders in the `assets/` folder. Replace them with your own photos and video.

Files created

- `index.html` — main page (link to `styles.css` and `script.js`).
- `styles.css` — aesthetic styles (glassmorphism, pastel gradient, responsive grid).
- `script.js` — lightbox behavior for images and video pause logic.
- `assets/` — folder for your photos and video (placeholders included as filenames referenced in the HTML).

How to use

1. Copy your files into the `assets/` folder. Suggested names used in the markup:
   - `assets/highlight.mp4` — highlight video (mp4 recommended).
   - `assets/video-poster.jpg` — poster image for the video.
   - `assets/photo1.jpg`, `assets/photo2.jpg`, `assets/photo3.jpg`, `assets/photo4.jpg` — gallery photos.

2. Edit `index.html` captions and `data-quote` attributes if you want different quotes under each photo. Each `figure.card` has a `data-quote` attribute used by the lightbox.

3. Open `index.html` directly in a browser, or run a tiny static server for best results (for example):

```bash
# from inside the folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Recommended media sizes & tips

- Video: H.264-encoded MP4, 1080p is fine; keep bitrate reasonable for web playback. Poster image ~1280×720.
- Photos: JPEGs or WebP, at least 1200px on the long edge for good quality; smaller (e.g. 800–1200px) for faster load.
- If you want autoplay for the video, edit the `video` tag in `index.html` and add `autoplay muted playsinline` (note: many browsers block autoplay with sound).

Next steps (optional)

- Add more gallery images by copying the `<figure class="card">` blocks.
- Replace fonts or tweak colors in `styles.css`.
- Add transitions, or use a real lightbox library if you want captions with different layouts.

If you'd like, I can:
- Add an image upload form so you can drop photos straight into the page.
- Add social/share buttons or an animated intro.

Enjoy — drop your photos and highlight video into `assets/` and the page will show your memories beautifully.