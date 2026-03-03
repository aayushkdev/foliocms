document.addEventListener("DOMContentLoaded", initProjects);

let allProjects = [];

async function initProjects() {
  try {
    allProjects = await fetchData("projects.json");

    if (!Array.isArray(allProjects)) {
      console.error("projects.json is not returning an array");
      return;
    }

    renderCategoryFilters(allProjects);
    renderProjects(allProjects);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function renderCategoryFilters(projects) {
  const container = document.getElementById("categoryFilters");
  if (!container) return;

  const categories = ["All", ...new Set(projects.map(p => p.category))];
  container.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.className = "filter-btn";

    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      if (category === "All") {
        renderProjects(allProjects);
      } else {
        const filtered = allProjects.filter(p => p.category === category);
        renderProjects(filtered);
      }
    });

    container.appendChild(btn);
  });

  // Make "All" active by default
  container.firstChild.classList.add("active");
}

function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  if (projects.length === 0) {
    container.innerHTML = "<p>No projects found.</p>";
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${project.title}</h3>
      <p class="muted">${project.category}</p>
      <p>${project.description}</p>
      <div class="project-links">
        <a href="${project.githubLink}" target="_blank" class="link">GitHub</a>
        ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="link">Demo</a>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}``