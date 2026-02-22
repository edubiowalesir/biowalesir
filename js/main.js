// ============================================
// BioWaleSir — Main JavaScript
// ============================================

// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ===== ABOUT TABS =====
  const aboutTabs = document.querySelectorAll('.about-tab');
  const aboutPanels = document.querySelectorAll('.about-panel');
  aboutTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      aboutTabs.forEach(t => t.classList.remove('active'));
      aboutPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // ===== SUB-TABS (Class pages) =====
  const subtabs = document.querySelectorAll('.subtab');
  const panels = document.querySelectorAll('.content-panel');
  subtabs.forEach(tab => {
    tab.addEventListener('click', function () {
      subtabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.panel);
      if (target) target.classList.add('active');
    });
  });

  // ===== SCROLL: Navbar shadow =====
  window.addEventListener('scroll', function () {
    const nav = document.querySelector('.navbar');
    if (nav) {
      if (window.scrollY > 10) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }
  });

  // ===== ANIMATE on scroll =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.5s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.class-card, .feature-card, .chapter-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ===== OPEN RESOURCE (Google Drive link) =====
function openResource(url, title) {
  if (!url || url === '#') {
    alert('📁 Content coming soon!\n\nThis resource will be uploaded shortly.');
    return;
  }
  window.open(url, '_blank');
}

// ===== CONTACT FORM =====
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
