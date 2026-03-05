const grid = document.querySelector(".all-projects-grid");
const filterContainer = document.querySelector(".projects-filter");

let projects = [];
let activeFilter = "all";

async function loadProjects() {
  const res = await fetch("/data/projects.json");
  projects = await res.json();

  renderFilters();
  renderProjects();
}

function renderFilters() {
  const categories = [...new Set(projects.map(p => p.category))];

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = cat;
    btn.textContent = cat;

    btn.onclick = () => {
      activeFilter = cat;
      setActiveButton(btn);
      renderProjects();
    };

    filterContainer.appendChild(btn);
  });

  document.querySelector('[data-filter="all"]').onclick = () => {
    activeFilter = "all";
    setActiveButton(document.querySelector('[data-filter="all"]'));
    renderProjects();
  };
}

function setActiveButton(btn) {
  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function renderProjects() {

  grid.innerHTML = "";

  const filtered = activeFilter === "all"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  filtered.forEach(project => {

    const tech = project.tech
      .map(t => `<li>${t}</li>`)
      .join("");

    const card = `
    <li class="project-card">
      <div class="project-inner">

        <header>

          <div class="project-card-top">

            <div class="project-folder">
              <img src="/assets/images/folder.svg">
            </div>

            <div class="project-links">

              ${project.githubLink ? `
              <a href="${project.githubLink}" target="_blank">
                <img src="/assets/images/github.svg">
              </a>` : ""}

              ${project.demoLink ? `
              <a href="${project.demoLink}" target="_blank">
                <img src="/assets/images/external.svg">
              </a>` : ""}

            </div>

          </div>

          <h3 class="project-title">
            ${project.demoLink || project.githubLink ? `
            <a href="${project.demoLink || project.githubLink}" target="_blank" rel="noopener noreferrer">
              ${project.title}
            </a>` : project.title}
          </h3>

          <p class="project-category">${project.category}</p>

          <p class="project-description">
            ${project.description}
          </p>

        </header>

        <footer>
          <ul class="project-tech-list">
            ${tech}
          </ul>
        </footer>

      </div>
    </li>
    `;

    grid.innerHTML += card;
  });
}

loadProjects();