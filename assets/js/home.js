document.addEventListener("DOMContentLoaded", () => {
  loadExperience();
  loadProjects();
});

let allProjects = [];
let showingAll = false;

async function loadExperience() {
  const data = await fetchData("experience.json");
  const container = document.getElementById("experienceContainer");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(exp => {
    container.innerHTML += `
      <div class="card">
        <h3>${exp.role}</h3>
        <p class="muted">${exp.company} • ${exp.period}</p>
        <p class="muted">${exp.location}</p>
        <ul>
          ${exp.description.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  });
}

async function loadProjects() {
  allProjects = await fetchData("projects.json");
  renderProjects(3);

  const viewMoreBtn = document.getElementById("viewMoreBtn");
  viewMoreBtn.addEventListener("click", () => {
    showingAll = true;
    renderProjects(allProjects.length);
    viewMoreBtn.style.display = "none";
  });
}

function renderProjects(count) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  allProjects.slice(0, count).forEach(project => {
    container.innerHTML += `
      <div class="card project-card">
        <h3>${project.title}</h3>
        <p class="muted">${project.category}</p>
        <p>${project.description}</p>
        <div class="project-links">
          <a href="${project.githubLink}" target="_blank" class="link">GitHub</a>
          ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="link">Demo</a>` : ""}
        </div>
      </div>
    `;
  });
}