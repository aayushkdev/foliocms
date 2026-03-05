// ===============================
// Projects Section
// ===============================

document.addEventListener("DOMContentLoaded", initProjects);

async function initProjects() {
  try {
    const projects = await fetchData("projects.json");

    if (!Array.isArray(projects)) {
      console.error("projects.json is not returning an array");
      return;
    }

    renderProjects(projects);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function renderProjects(projects) {
  const container = document.querySelector(".projects-grid");
  if (!container) return;

  container.innerHTML = "";

  if (projects.length === 0) {
    container.innerHTML = "<p>No projects found.</p>";
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    const hasDemo = project.demoLink && project.demoLink.trim() !== '';
    const hasGithub = project.githubLink && project.githubLink.trim() !== '';
    const primaryLink = hasDemo ? project.demoLink : project.githubLink;

    // Make the card clickable
    if (primaryLink) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking on a link
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          return;
        }
        window.open(primaryLink, '_blank', 'noopener noreferrer');
      });
    }

    const techListHTML = project.tech && project.tech.length > 0 
      ? `<ul class="project-tech-list">
          ${project.tech.map(tech => `<li>${escapeHtml(tech)}</li>`).join('')}
         </ul>`
      : '';

    card.innerHTML = `
      <div class="project-inner">
        <header>
          <div class="project-card-top">
            <div class="project-folder">
              <img src="assets/images/folder.svg" alt="Folder">
            </div>
            <div class="project-links">
              ${hasGithub ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Link">
                <img src="assets/images/github.svg" alt="GitHub">
              </a>` : ''}
              ${hasDemo ? `<a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" aria-label="External Link" class="external">
                <img src="assets/images/external.svg" alt="External Link">
              </a>` : ''}
            </div>
          </div>
          <h3 class="project-title">
            ${primaryLink ? `<a href="${primaryLink}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a>` : escapeHtml(project.title)}
          </h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
        </header>
        <footer>
          ${techListHTML}
        </footer>
      </div>
    `;

    container.appendChild(card);
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