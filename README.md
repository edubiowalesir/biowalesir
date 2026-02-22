# 🌿 BioWaleSir — One Stop Solution for Biology

**Live Website:** [biowalesir.com](https://biowalesir.com)

Complete Biology resource for NCERT Class 9–12 — Notes, MCQs, Diagrams, PYQs, Practicals and more for students and teachers across India.

---

## 📁 Folder Structure

```
biowalesir/
├── index.html          ← Homepage
├── class9.html         ← Class 9 page
├── class10.html        ← Class 10 page
├── class11.html        ← Class 11 page
├── class12.html        ← Class 12 page
├── teacher.html        ← Teacher section
│
├── css/
│   └── style.css       ← All styles (edit here)
│
├── js/
│   ├── components.js   ← Shared nav & footer
│   └── main.js         ← All interactivity
│
└── chapters/
    ├── class9/         ← Chapter pages for class 9
    ├── class10/        ← Chapter pages for class 10
    ├── class11/
    │   ├── ch1.html    ← Chapter 1 (template)
    │   └── ch2.html ... (duplicate ch1.html for each)
    └── class12/
```

---

## 🚀 How to Set Up GitHub Pages + Custom Domain

### Step 1 — Upload to GitHub
1. Create a GitHub account (free) at github.com
2. Create a new repository named `biowalesir`
3. Upload all files using GitHub Desktop (drag & drop)

### Step 2 — Enable GitHub Pages
1. Go to your repo → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / root
4. Save → Your site will be live at `yourusername.github.io/biowalesir`

### Step 3 — Connect biowalesir.com domain
1. In GitHub Pages settings → Add custom domain → type `biowalesir.com`
2. Go to your domain registrar (wherever you bought biowalesir.com)
3. Add these DNS records:
   ```
   Type A — @ — 185.199.108.153
   Type A — @ — 185.199.109.153
   Type A — @ — 185.199.110.153
   Type A — @ — 185.199.111.153
   Type CNAME — www — yourusername.github.io
   ```
4. Wait 10–30 minutes → your site is live at biowalesir.com 🎉

---

## ✏️ How to Add/Edit Content (Easy Way)

### Using VS Code + GitHub Desktop (Recommended)
1. Install **VS Code** → code.visualstudio.com
2. Install **GitHub Desktop** → desktop.github.com
3. Clone your repo in GitHub Desktop
4. Open the folder in VS Code
5. Edit files → Save
6. In GitHub Desktop → Commit → Push
7. Live in ~1 minute!

---

## 🔗 How to Add Google Drive PDFs

1. Upload your PDF to Google Drive
2. Right-click → Share → Anyone with the link → Copy link
3. **Convert the link:**
   - Original: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Embed: `https://drive.google.com/file/d/FILE_ID/preview`
4. In the chapter HTML, replace `#` with your embed link:
   ```html
   onclick="openResource('https://drive.google.com/file/d/YOUR_ID/preview', 'Key Notes')"
   ```

---

## 📋 Adding a New Chapter Page

1. Copy `chapters/class11/ch1.html`
2. Rename it (e.g. `ch2.html`)
3. Change the chapter title, number, and topic names
4. Update the Google Drive links for each resource
5. Save and push to GitHub

---

## 🌿 Built With

- Pure HTML + CSS + JavaScript (no frameworks needed)
- Google Fonts (Playfair Display + Lora + DM Sans)
- Google Drive for PDF hosting
- GitHub Pages for free hosting

---

*Made with ❤️ for Biology students and teachers across India*
