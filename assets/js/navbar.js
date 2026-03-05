document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
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

function initMobileMenu() {
  const menuButton = document.querySelector('.menu-button');
  const sidebar = document.querySelector('.sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  if (!menuButton || !sidebar) return;

  // Toggle menu
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.classList.contains('menu-open');
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking links
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menuButton.classList.contains('menu-open') &&
        !sidebar.contains(e.target) &&
        !menuButton.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuButton.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // Close menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuButton.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  function openMenu() {
    menuButton.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    sidebar.classList.add('menu-open');
    document.body.classList.add('blur');
  }

  function closeMenu() {
    menuButton.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('menu-open');
    document.body.classList.remove('blur');
  }
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