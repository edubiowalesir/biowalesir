// BioWaleSir.com Worker
// Static files are served directly by Cloudflare. This code only runs when a
// request does NOT match a file, and copies GitHub Pages behaviour:
//   /            -> /index.html
//   /class11     -> /class11.html   (clean URLs used in nav + Google index)
//   /folder/     -> /folder/index.html
// Anything else gets a simple 404 page.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    let candidate = null;
    if (path.endsWith('/')) candidate = path + 'index.html';
    else if (!/\.[a-z0-9]+$/i.test(path)) candidate = path + '.html';

    if (candidate) {
      const res = await env.ASSETS.fetch(new Request(new URL(candidate + url.search, url), request));
      if (res.ok || res.status === 304) return res;
    }

    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  },
};

const NOT_FOUND_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found — BioWaleSir</title>
<link rel="icon" href="/logo.png"><link rel="stylesheet" href="/css/style.css"></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
<div><div style="font-size:56px">🌿</div><h1 style="font-family:'Playfair Display',serif;margin:12px 0">Page not found</h1>
<p style="color:#777;margin-bottom:24px">This page does not exist or has moved.</p>
<a href="/" class="btn-primary">Go to BioWaleSir Home →</a></div></body></html>`;
