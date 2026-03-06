document.addEventListener("DOMContentLoaded", init);

function init() {
  animateHero();
  setupSmoothScroll();
  setupScrollReveal();
  loadHomeBlogs();
}

function animateHero() {
  const heroElements = document.querySelectorAll('.hero .fade-in');
  
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${(index + 1) * 0.1}s`;
  });
}

function setupSmoothScroll() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function setupScrollReveal() {
  // Add scroll reveal animation for sections
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}


// ===============================
// Utility: Fetch Data
// ===============================

async function fetchData(filename) {
  try {
    const response = await fetch(`data/${filename}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${filename}:`, error);
    return [];
  }
}


// ===============================
// Load Latest Blogs for Homepage
// ===============================

async function loadHomeBlogs() {
  const grid = document.querySelector("#homeBlogGrid");
  if (!grid) return;

  try {
    const res = await fetch("/data/blogs.json");
    const blogs = await res.json();

    // Show only first 2 blogs on homepage
    const latestBlogs = blogs.slice(0, 2);

    latestBlogs.forEach((blog) => {
      const card = document.createElement("a");
      card.className = "blog-card";
      card.href = blog.link;

      card.innerHTML = `
        <div class="blog-image">
          <img src="${blog.image}" alt="${blog.title}">
        </div>

        <div class="blog-content">

          <span class="blog-date">
            ${blog.date}
          </span>

          <h2 class="blog-title">
            ${blog.title}
          </h2>

          <p class="blog-description">
            ${blog.description}
          </p>

          <span class="blog-readmore">
            Read more →
          </span>

        </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load blogs:", err);
  }
}