// nav-components.js — Shared HTML Components
// Include this before main.js in every page

const NAV_HTML = `
<nav class="navbar">
  <a href="index.html" class="nav-logo">
  <span class="leaf">🌿</span>
  BioWaleSir
</a>
  <ul class="nav-links" id="navLinks">
    <li><a href="/biowalesir/index.html">Home</a></li>
<li class="nav-class"><a href="/biowalesir/class9.html">Class 9</a></li>
<li class="nav-class"><a href="/biowalesir/class10.html">Class 10</a></li>
<li class="nav-class"><a href="/biowalesir/class11.html">Class 11</a></li>
<li class="nav-class"><a href="/biowalesir/class12.html">Class 12</a></li>
    <li class="nav-more">
      <button class="nav-more-btn">More</button>
      <div class="nav-dropdown">
       <a href="/biowalesir/teacher.html">👩‍🏫 Teacher Section</a>
<a href="/biowalesir/index.html#about">ℹ️ About Us</a>
<a href="/biowalesir/index.html#contact">📬 Contact</a>
<a href="/biowalesir/index.html#donate">💛 Donate</a>      
</div>
    </li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-nav" id="mobileNav">
 <a href="/biowalesir/index.html">🏠 Home</a>
  <div class="mobile-divider"></div>
  <a href="/biowalesir/class9.html">📗 Class 9</a>
<a href="/biowalesir/class10.html">📘 Class 10</a>
<a href="/biowalesir/class11.html">📙 Class 11</a>
<a href="/biowalesir/class12.html">📕 Class 12</a>
  <div class="mobile-divider"></div>
  <a href="/biowalesir/teacher.html">👩‍🏫 Teacher Section</a>
<a href="/biowalesir/index.html#about">ℹ️ About Us</a>
<a href="/biowalesir/index.html#contact">📬 Contact</a>
<a href="/biowalesir/index.html#donate">💛 Donate</a>
</div>
`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="logo">🌿 BioWaleSir</div>
      <p>One Stop Solution for Biology — NCERT based content for Class 9–12 students and teachers across India.</p>
    </div>
    <div class="footer-col">
      <h4>Classes</h4>
      <ul>
        <li><a href="/biowalesir/class9.html">Class 9 Biology</a></li>
<li><a href="/biowalesir/class10.html">Class 10 Biology</a></li>
<li><a href="/biowalesir/class11.html">Class 11 Biology</a></li>
<li><a href="/biowalesir/class12.html">Class 12 Biology</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Resources</h4>
      <ul>
        <li><a href="#">Key Notes</a></li>
        <li><a href="#">PYQ Papers</a></li>
        <li><a href="#">Diagrams</a></li>
        <li><a href="#">Mind Maps</a></li>
        <li><a href="/biowalesir/teacher.html">For Teachers</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Info</h4>
      <ul>
        <li><a href="index.html#about">About Us</a></li>
        <li><a href="index.html#contact">Contact</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 BioWaleSir.com — All rights reserved</span>
    <span>Made with 🌿 for Biology Students & Teachers</span>
  </div>
</footer>
`;

// Inject into page
document.addEventListener('DOMContentLoaded', function () {
  const navContainer = document.getElementById('nav-container');
  const footerContainer = document.getElementById('footer-container');
  if (navContainer) navContainer.innerHTML = NAV_HTML;
  if (footerContainer) footerContainer.innerHTML = FOOTER_HTML;
});
