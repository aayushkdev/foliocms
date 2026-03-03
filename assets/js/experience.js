document.addEventListener("DOMContentLoaded", loadExperience);

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