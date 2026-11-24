// ============================================
// BioWaleSir — File Viewer (popup dialog)
// Google Drive / Docs / Slides / Sheets / Forms files open
// inside the site in a big popup. Other links open in a new tab.
// Usage stays the same everywhere:  openResource(url, title)
// ============================================
(function () {
  'use strict';

  // ---- 1. Turn a share link into an embeddable link (or null) ----
  function toEmbedUrl(url) {
    var u;
    try { u = new URL(url, location.href); } catch (e) { return null; }
    var host = u.hostname.replace(/^www\./, '');
    var path = u.pathname;
    var m;

    if (host === 'drive.google.com') {
      // https://drive.google.com/file/d/ID/view  ->  /file/d/ID/preview
      m = path.match(/\/file\/d\/([\w-]+)/);
      if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
      // https://drive.google.com/open?id=ID  or  /uc?id=ID
      var id = u.searchParams.get('id');
      if (id && /^\/(open|uc)$/.test(path)) return 'https://drive.google.com/file/d/' + id + '/preview';
      // Folder -> Drive's embeddable folder view
      m = path.match(/\/folders\/([\w-]+)/);
      if (m) return 'https://drive.google.com/embeddedfolderview?id=' + m[1] + '#grid';
      return null;
    }

    if (host === 'docs.google.com') {
      // Forms: /forms/d/e/ID/viewform  or  /forms/d/ID/viewform
      m = path.match(/^\/forms\/d\/(e\/)?([\w-]+)/);
      if (m) return 'https://docs.google.com/forms/d/' + (m[1] || '') + m[2] + '/viewform?embedded=true';
      // Docs / Slides / Sheets / Drawings -> /preview
      m = path.match(/^\/(document|presentation|spreadsheets|drawings)\/d\/([\w-]+)/);
      if (m) return 'https://docs.google.com/' + m[1] + '/d/' + m[2] + '/preview';
      return null;
    }

    return null;
  }

  // ---- 2. Build the dialog once ----
  var css = '' +
    '.fv-overlay{position:fixed;inset:0;z-index:10000;background:rgba(6,20,10,.82);display:flex;padding:16px;opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s}' +
    '.fv-overlay.open{opacity:1;visibility:visible}' +
    // Desktop: fills the whole screen (16px gap), floating title bar + file card
    '.fv-dialog{width:100%;height:100%;display:flex;flex-direction:column;gap:12px;transform:translateY(12px) scale(.985);transition:transform .2s ease}' +
    '.fv-overlay.open .fv-dialog{transform:none}' +
    '.fv-head{display:flex;align-items:center;gap:12px;padding:10px 10px 10px 18px;background:var(--green-900,#0a1f0f);color:#fff;flex-shrink:0;border-radius:16px;border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 30px rgba(0,0,0,.3)}' +
    '.fv-titles{flex:1;min-width:0}' +
    '.fv-title{font-family:"DM Sans",system-ui,sans-serif;font-weight:700;font-size:15.5px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.fv-sub{font-size:12px;color:rgba(255,255,255,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.fv-btn{display:inline-flex;align-items:center;gap:6px;border:0;cursor:pointer;font:600 13px "DM Sans",system-ui,sans-serif;border-radius:8px;padding:8px 14px;text-decoration:none;white-space:nowrap;flex-shrink:0}' +
    '.fv-open{background:var(--green-400,#3da467);color:#fff}' +
    '.fv-open:hover{background:var(--green-500,#2e7d4f)}' +
    '.fv-close{background:rgba(255,255,255,.12);color:#fff;width:38px;height:38px;padding:0;justify-content:center;font-size:22px;line-height:1}' +
    '.fv-close:hover{background:rgba(255,255,255,.24)}' +
    '.fv-btn:focus-visible{outline:2px solid var(--gold-light,#e8c97a);outline-offset:2px}' +
    '.fv-body{position:relative;flex:1;background:#f1f3f4;border-radius:16px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.4)}' +
    '.fv-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#f1f3f4}' +
    '.fv-loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--text-mid,#444);font:500 14px "DM Sans",system-ui,sans-serif;background:#f1f3f4;transition:opacity .25s}' +
    '.fv-loading.hide{opacity:0;pointer-events:none}' +
    '.fv-spin{width:36px;height:36px;border-radius:50%;border:3px solid var(--green-100,#c8f0d8);border-top-color:var(--green-500,#2e7d4f);animation:fvspin .8s linear infinite}' +
    '@keyframes fvspin{to{transform:rotate(360deg)}}' +
    'body.fv-lock{overflow:hidden}' +
    '@media (max-width:700px){' +
      // Phone: edge-to-edge full screen (unchanged look)
      '.fv-overlay{padding:0}' +
      '.fv-dialog{gap:0;background:#fff}' +
      '.fv-head{padding:8px 8px 8px 14px;gap:8px;border-radius:0;border:0;box-shadow:none}' +
      '.fv-body{border-radius:0;box-shadow:none}' +
      '.fv-open .fv-long{display:none}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.fv-overlay,.fv-dialog{transition:none}.fv-spin{animation-duration:2s}}';

  var overlay, frame, loading, titleEl, subEl, openLink, closeBtn, lastFocus, pushedState = false;

  function build() {
    if (overlay) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'fv-overlay';
    overlay.innerHTML =
      '<div class="fv-dialog" role="dialog" aria-modal="true" aria-labelledby="fvTitle">' +
        '<div class="fv-head">' +
          '<div class="fv-titles"><div class="fv-title" id="fvTitle"></div><div class="fv-sub"></div></div>' +
          '<a class="fv-btn fv-open" target="_blank" rel="noopener noreferrer">↗ <span>Open<span class="fv-long"> in Drive</span></span></a>' +
          '<button type="button" class="fv-btn fv-close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="fv-body">' +
          '<div class="fv-loading"><div class="fv-spin"></div><div>Opening file…</div></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    titleEl = overlay.querySelector('.fv-title');
    subEl = overlay.querySelector('.fv-sub');
    openLink = overlay.querySelector('.fv-open');
    closeBtn = overlay.querySelector('.fv-close');
    loading = overlay.querySelector('.fv-loading');

    closeBtn.addEventListener('click', function () { close(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') { // keep focus inside the dialog
        var f = [openLink, closeBtn];
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    // Phone "back" button closes the popup instead of leaving the page
    window.addEventListener('popstate', function () {
      if (pushedState) { pushedState = false; close(true); }
    });
  }

  function open(embedUrl, originalUrl, title, sub) {
    build();
    lastFocus = document.activeElement;
    titleEl.textContent = title || 'File';
    subEl.textContent = sub || '';
    subEl.style.display = sub ? '' : 'none';
    openLink.href = originalUrl;
    var isDrive = /drive\.google\.com/.test(originalUrl);
    openLink.querySelector('.fv-long').textContent = isDrive ? ' in Drive' : ' in new tab';

    if (frame) frame.remove();
    loading.classList.remove('hide');
    frame = document.createElement('iframe');
    frame.className = 'fv-frame';
    frame.title = title || 'File preview';
    frame.allow = 'autoplay; fullscreen';
    frame.setAttribute('allowfullscreen', '');
    frame.addEventListener('load', function () { loading.classList.add('hide'); });
    frame.src = embedUrl;
    overlay.querySelector('.fv-body').appendChild(frame);

    overlay.classList.add('open');
    document.body.classList.add('fv-lock');
    try { history.pushState({ fv: 1 }, ''); pushedState = true; } catch (e) {}
    closeBtn.focus();
  }

  function close(fromPopstate) {
    if (!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.classList.remove('fv-lock');
    setTimeout(function () { if (frame && !overlay.classList.contains('open')) { frame.remove(); frame = null; } }, 220);
    if (!fromPopstate && pushedState) { pushedState = false; history.back(); }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---- 3. Nice title: use the button's visible name + chapter name ----
  function niceTitles(fallback) {
    var ev = window.event;
    var card = ev && ev.currentTarget && ev.currentTarget.nodeType === 1 ? ev.currentTarget : null;
    var nameEl = card && card.querySelector('.resource-name');
    var title = nameEl ? nameEl.textContent.trim() : (fallback || 'File');
    var h1 = document.querySelector('.chapter-hero h1, .class-hero h1, h1');
    var sub = h1 ? h1.textContent.trim() : '';
    return { title: title, sub: sub };
  }

  // ---- 4. Public function used by every button on the site ----
  window.openResource = function (url, title) {
    if (!url || url === '#') {
      alert('📁 Content coming soon!\n\nThis resource will be uploaded shortly.');
      return;
    }
    var t = niceTitles(title);
    var embed = toEmbedUrl(url);
    if (embed) open(embed, url, t.title, t.sub);
    else window.open(url, '_blank', 'noopener');
  };
})();
