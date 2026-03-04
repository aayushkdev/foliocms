// ===============================
// Navbar Functionality
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  highlightOnScroll();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  let scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
}

function highlightOnScroll() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 150; // Offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const targetId = href.substring(1);

      if (targetId === currentSection) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}