document.addEventListener("DOMContentLoaded", () => {
  highlightCurrentPage();

  // Only run scroll highlighting on index page
  if (window.location.pathname.endsWith("index.html") || 
      window.location.pathname === "/" || 
      window.location.pathname === "") {
    highlightOnScroll();
  }
});

function highlightCurrentPage() {
  const links = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");

    // Highlight page links
    if (href === currentPath) {
      link.classList.add("active");
    }

    // Default home highlight if on index
    if ((currentPath === "" || currentPath === "index.html") && href === "#top") {
      link.classList.add("active");
    }
  });
}

function highlightOnScroll() {
  const sectionLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    sectionLinks.forEach(link => {
      const target = link.getAttribute("href").substring(1);

      if (target === currentSection) {
        sectionLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });
}