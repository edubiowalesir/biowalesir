# BioWaleSir.com — Claude ke liye notes

## Kaise kaam karna hai
- Rahul ji se **Hinglish mein simple** baat karo.
- Har kaam **end-to-end** karo: edit → (local check) → commit → push → live site check karke batao.
- Bade/ulte na hone wale kadam (domain/DNS badalna, repo private/public, kuch delete karna) se **pehle "haan" lo**.
- Accounts (GitHub, Cloudflare, GoDaddy, Google Drive) ka kaam **app ke built-in browser** mein karo. Login Rahul ji khud karenge — password/OTP kabhi mat maango, khud mat daalo.

## Site kya hai
- NCERT Biology Class 9–12 ke liye free resource site: Notes, MCQs, Diagrams, PYQ, Practicals… sab files Google Drive par.
- **Plain HTML + CSS + JS**. Koi framework / build step nahi. Jo file repo mein hai wahi live serve hoti hai.
- Google Analytics tag `G-7EMFPJ5RKS` → `js/components.js` mein. Ise mat hatao/badlo.
- Design, content aur URLs mat todo — pages Google mein indexed hain.

## Hosting
- **Cloudflare Worker** `biowalesir` (account: Edu.biowalesir@gmail.com), static assets.
- Config: `wrangler.jsonc` (assets directory = repo root `.`, `html_handling: "none"`).
- `src/index.js` sirf tab chalta hai jab koi file match na ho: `/class11` → `class11.html`, `/folder/` → `index.html`, warna 404 page. Isse URLs bilkul GitHub Pages jaise rehte hain (`/class11` aur `/class11.html` dono 200, koi redirect nahi).
- `.assetsignore` — repo-only files (README, CLAUDE.md, wrangler.jsonc, src/, CNAME, .git…) serve nahi hoti. Nayi repo-only file banao to yahan jodo.
- **Push to `main` = auto-deploy** (Cloudflare Workers Builds, deploy command `npx wrangler deploy`). 1–2 minute.
- Auto-build na chale: Cloudflare dashboard → Workers & Pages → biowalesir → Deployments → "Retry build".
  `npx wrangler deploy` local se **sirf tab** chalao jab `npx wrangler whoami` mein **Edu.biowalesir** account dikhe — is Mac par wrangler normally **kvsecontent** account se login hai (wahan deploy mat karna).
- Test URL: https://biowalesir.edu-biowalesir.workers.dev
- Domain: `biowalesir.com` GoDaddy se registered, **DNS Cloudflare par** (nameservers marty/paris.ns.cloudflare.com).
  - `www.biowalesir.com` aur `biowalesir.com` = Worker custom domains.
  - Redirect Rule: `biowalesir.com/*` → `https://www.biowalesir.com/…` (301, query string ke saath). "Always Use HTTPS" ON.
  - Koi MX/TXT record nahi (email Gmail par hai).
- **Baaki kaam (27 Nov 2026 ke baad):** GitHub Pages band karna (Settings → Pages → Unpublish), phir repo private karna. Rahul ji ne iski haan de di hai — bas 48 ghante DNS propagation ka intezaar tha. Uske baad `CNAME` file bhi hata sakte hain.

## Repo aur commit
- GitHub repo: `edubiowalesir/biowalesir`, branch `main`.
- Is Mac par `gh`/git **kvsecontent** account se chalta hai; kvsecontent is repo ka collaborator (Write) hai. Isliye seedha `git push origin main` chalta hai.
- Commit author is folder mein local set hai: `BioWaleSir <edu.biowalesir@gmail.com>`.
- `.DS_Store` repo mein track hai par change ignore hai (`assume-unchanged`) — commit mat karna.
- Local preview: `python3 -m http.server 8787` (ya `.claude/launch.json` ka "biowalesir-local"). Clean URLs (`/class11`) test karne ho to `npx wrangler dev --port 8790`.

## Kaun si file kya karti hai
| File | Kaam |
|---|---|
| `index.html` | Homepage (hero, classes, about, contact form – Web3Forms, donate/UPI) |
| `class9.html` … `class12.html` | Class page: chapters list + sub-tabs (Key Notes, MCQ, PYQ…) |
| `chapters/classN/chM.html` | Chapter page: har resource ka ek button (resource-card) |
| `teacher.html` | Teacher section (lesson plans, PPTs, aids) |
| `pathopedia.html` | Alag akeli app (disease encyclopedia), apni CSS/JS ke saath |
| `css/style.css` | Poori site ki styling |
| `js/components.js` | Nav + footer HTML (har page mein inject), Google Analytics |
| `js/main.js` | Hamburger menu, tabs, animations |
| `js/file-viewer.js` | File viewer popup + `openResource()` |
| `wrangler.jsonc`, `src/index.js`, `.assetsignore` | Cloudflare hosting |

## Naya content / Drive link kaise jodna hai
1. File Google Drive par upload karo → Share → **"Anyone with the link – Viewer"**. (Ye na ho to popup mein "access denied" aayega.)
2. **Har file ka alag button** banao. Drive *folder* ko button mat banao.
3. Chapter page mein us resource ka `'#'` badal kar Drive link daalo — link waisa hi chalega jaisa Drive deta hai (`.../file/d/ID/view?usp=drive_link`):
   ```html
   <div class="resource-card rc-notes" onclick="openResource('https://drive.google.com/file/d/FILE_ID/view?usp=drive_link', 'Key Notes Ch3')">
   ```
4. Naya chapter page: kisi maujooda `chN.html` ko copy karo, title/number/topics badlo, links daalo, aur class page ki chapter list mein card jodo. Har page ke end mein ye scripts honi chahiye (relative path ke saath):
   ```html
   <script src="../../js/components.js"></script>
   <script src="../../js/main.js"></script>
   <script src="../../js/file-viewer.js"></script>
   ```
5. Commit → push → 1–2 min baad live page par button click karke check karo.

## File viewer kaise kaam karta hai (`js/file-viewer.js`)
- Har button `openResource(url, title)` call karta hai. `'#'` ho to "Content coming soon" alert.
- Drive/Google link ho to **site ke andar popup**:
  - `drive.google.com/file/d/ID/...` → `/file/d/ID/preview`
  - Docs / Slides / Sheets / Drawings `/d/ID/...` → `/preview`
  - Forms → `viewform?embedded=true`
  - Drive folder (purana link) → `embeddedfolderview?id=ID#grid`
- Popup mein: "Opening file…" loading, upar button ka naam (`.resource-name`) + chapter naam, "Open in Drive" (original link naye tab mein), Close (× / Esc / bahar click / phone ka Back button). Mobile (≤700px) par full screen.
- Jo link Drive/Docs ka nahi (YouTube, dusri website) → naye tab mein khulta hai.
- Console mein `accounts.google.com ... frame-ancestors` error Drive ke andar se aata hai — normal hai.
