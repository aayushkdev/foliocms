// ===============================
// Featured Projects Section
// ===============================

document.addEventListener("DOMContentLoaded", initFeaturedProjects);

async function initFeaturedProjects() {
  try {
    const projects = await fetchData("projects.json");

    if (!Array.isArray(projects)) {
      console.error("projects.json is not returning an array");
      return;
    }

    // Take the first 3 projects for featured section
    const featuredProjects = projects.slice(0, 3);
    renderFeaturedProjects(featuredProjects);
  } catch (error) {
    console.error("Error loading featured projects:", error);
  }
}

function renderFeaturedProjects(projects) {
  const container = document.querySelector(".featured-projects");
  if (!container) return;

  container.innerHTML = "";

  if (projects.length === 0) {
    return;
  }

  projects.forEach((project, index) => {
    const listItem = document.createElement("li");
    listItem.className = "featured-project";

    const hasDemo = project.demoLink && project.demoLink.trim() !== '';
    const hasGithub = project.githubLink && project.githubLink.trim() !== '';
    const primaryLink = hasDemo ? project.demoLink : project.githubLink;

    // Determine image - use image field if available, otherwise construct from title
    const imageName = project.image || `${project.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    const imagePath = `assets/images/${imageName}`;

    listItem.innerHTML = `
      <div class="featured-content">
        <div>
          <p class="featured-overline">Featured Project</p>
          
          <h3 class="featured-title">
            <a href="${primaryLink}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a>
          </h3>
          
          <div class="featured-description">
            <p>${escapeHtml(project.description)}</p>
          </div>
          
          ${project.tech && project.tech.length > 0 ? `
            <ul class="featured-tech-list">
              ${project.tech.map(tech => `<li>${escapeHtml(tech)}</li>`).join('')}
            </ul>
          ` : ''}
          
          <div class="featured-links">
            ${hasGithub ? `
              <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Link">
                <img src="assets/images/github.svg" alt="GitHub">
              </a>
            ` : ''}
            ${hasDemo ? `
              <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" aria-label="External Link" class="external">
                <img src="assets/images/external.svg" alt="External Link">
              </a>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div class="featured-image">
        <a href="${primaryLink}" target="_blank" rel="noopener noreferrer">
          <img class="featured-img" src="${imagePath}" alt="${escapeHtml(project.title)}">
        </a>
      </div>
    `;

    container.appendChild(listItem);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Utility: Fetch Data
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
