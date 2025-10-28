// Simple lightbox for photos and client-side HEIC conversion for unsupported browsers
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const highlightVideo = document.getElementById('highlightVideo');

  // Use native looping to avoid per-frame JS seeking which can cause choppy playback.
  if (highlightVideo) {
    try { highlightVideo.loop = true; } catch (e) {}
    try { highlightVideo.preload = 'auto'; } catch (e) {}
    try { highlightVideo.playbackRate = 1; } catch (e) {}
    // start playback (muted autoplay should work in most browsers)
    highlightVideo.play().catch(() => {});
    // pause when page hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        try { highlightVideo.pause(); } catch (e) {}
      } else {
        highlightVideo.play().catch(() => {});
      }
    });
    // overlay controls for autoplay/unmute handling
    const overlay = document.getElementById('videoOverlay');
    const playBtn = document.getElementById('videoPlayBtn');
    const unmuteBtn = document.getElementById('videoUnmuteBtn');

    function showOverlay() {
      if (!overlay) return;
      overlay.classList.remove('hidden');
    }
    function hideOverlay() {
      if (!overlay) return;
      overlay.classList.add('hidden');
      overlay.classList.remove('show-unmute');
    }

    // If initial autoplay failed, try muted autoplay as a fallback and show unmute control.
    setTimeout(() => {
      if (!highlightVideo) return;
      if (highlightVideo.paused) {
        // attempt muted playback as fallback
        try { highlightVideo.muted = true; } catch (e) {}
        highlightVideo.play().then(() => {
          // playing muted; show unmute button so user can enable audio
          if (overlay) overlay.classList.add('show-unmute');
        }).catch(() => {
          // still not playing; show big play overlay for user gesture
          showOverlay();
        });
      } else {
        // playing already
        hideOverlay();
        if (highlightVideo.muted && overlay) overlay.classList.add('show-unmute');
      }
    }, 250);

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        try { highlightVideo.muted = false; } catch (e) {}
        highlightVideo.play().then(() => {
          hideOverlay();
        }).catch(() => {
          // if unmuted play fails, try muted play and show unmute button
          try { highlightVideo.muted = true; } catch (e) {}
          highlightVideo.play().catch(() => {});
          if (overlay) overlay.classList.add('show-unmute');
        });
      });
    }

    if (unmuteBtn) {
      unmuteBtn.addEventListener('click', () => {
        try { highlightVideo.muted = false; } catch (e) {}
        highlightVideo.play().then(() => {
          if (overlay) overlay.classList.remove('show-unmute');
        }).catch(() => {
          // ignore
        });
      });
    }
  }

  // If an <img> points to a .heic/.heif asset, fetch and convert it to JPEG using heic2any
  const isFileProtocol = location.protocol === 'file:';

  // show a small unobtrusive notice when the page is opened via file:// to help debugging
  if (isFileProtocol) {
    // create a top notice only once
    const note = document.createElement('div');
    note.style.cssText = 'position:fixed;left:8px;right:8px;top:8px;padding:8px 12px;background:#fff3cd;border:1px solid #ffeeba;color:#856404;border-radius:6px;z-index:9999;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.08)';
    note.textContent = 'Note: you opened this page via file:// — browser fetch() calls may fail. Run a local static server for HEIC conversion: `python3 -m http.server 8000`.';
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(note));
    // remove the notice after 10s
    setTimeout(() => note.remove(), 10000);
  }

  async function processImageForHeic(img) {
    if (!img) return;
    const src = img.getAttribute('src') || '';
    const isHeicExt = /\.heic$/i.test(src) || /\.heif$/i.test(src);
    if (!isHeicExt) return;
    try {
      // If served via file://, fetch will almost always fail (CORS / browser restrictions).
      // Abort conversion early and let the page rely on native support (e.g. Safari), or
      // instruct the user to run a static server. This avoids noisy "Failed to fetch" errors.
      if (isFileProtocol) {
        console.warn('Skipping HEIC conversion because page was opened with file://. Run a static server to enable conversion.');
        return;
      }

      const res = await fetch(src);
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
      const blob = await res.blob();
      const isHeicType = /(heic|heif)/i.test(blob.type) || isHeicExt;
      if (!isHeicType) return;
      if (typeof heic2any !== 'function') {
        console.warn('heic2any is not available; include the library to enable HEIC conversion.');
        return;
      }
      const convertedBlob = await heic2any({ blob, toType: 'image/jpeg', quality: 0.9 });
      const newUrl = URL.createObjectURL(convertedBlob);
      img.dataset.heicObjectUrl = newUrl;
      img.dataset.heicOriginal = src;
      img.src = newUrl;
    } catch (err) {
      // More helpful logging and hint for the common causes (file://, CORS, CDN missing)
      console.error('Error converting HEIC image:', src, err);
      if (isFileProtocol) {
        console.info('Hint: Serving the site with a static server (e.g. `python3 -m http.server 8000`) will allow fetch() to work and enable conversion.');
      } else if (err instanceof TypeError) {
        console.info('Possible CORS or network error when fetching the HEIC file. Ensure the file is served from the same origin or that CORS allows the request.');
      }
    }
  }

  // File-drop/upload UI removed per user request; only remote/fetch-based HEIC conversion remains.

  function openLightbox(imgSrc, caption) {
    if (lbImage.src && lbImage.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(lbImage.src); } catch (e) {}
    }
    lbImage.src = imgSrc;
    lbImage.alt = caption || '';
    lbCaption.textContent = caption || '';
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden','false');
    // pause background video while lightbox is open to avoid competing playback
    if (highlightVideo) {
      try { highlightVideo.pause(); } catch (e) {}
    }
  }

  function closeLightbox() {
    if (lbImage.src && lbImage.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(lbImage.src); } catch (e) {}
    }
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    // resume background looping video when closing the lightbox
    if (highlightVideo) {
      highlightVideo.play().catch(() => {});
    }
  }

  cards.forEach(card => {
    const img = card.querySelector('img');
    const quote = card.dataset.quote || card.querySelector('.quote')?.textContent || '';
    card.style.cursor = 'zoom-in';
    // Try conversion if needed, then wire up the click handler to always use the current img.src
    processImageForHeic(img).finally(() => {
      card.addEventListener('click', () => {
        openLightbox(img.src, quote);
      });
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
