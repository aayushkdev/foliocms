// ===============================
// Experience / Jobs Section
// ===============================

document.addEventListener("DOMContentLoaded", loadExperience);

let activeTabIndex = 0;

async function loadExperience() {
  try {
    const data = await fetchData("experience.json");
    
    if (!Array.isArray(data) || data.length === 0) {
      console.error("No experience data found");
      return;
    }

    renderTabs(data);
    renderTabPanels(data);
    setActiveTab(0);
  } catch (error) {
    console.error("Error loading experience:", error);
  }
}

function renderTabs(data) {
  const tabList = document.querySelector(".tab-list");
  if (!tabList) return;

  tabList.innerHTML = "";

  // Create highlight element
  const highlight = document.createElement("div");
  highlight.className = "tab-highlight";
  tabList.appendChild(highlight);

  // Create tab buttons
  data.forEach((exp, index) => {
    const button = document.createElement("button");
    button.textContent = exp.company;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", `panel-${index}`);
    button.setAttribute("id", `tab-${index}`);
    
    button.addEventListener("click", () => setActiveTab(index));
    
    tabList.appendChild(button);
  });
}

function renderTabPanels(data) {
  const tabPanels = document.querySelector(".tab-panels");
  if (!tabPanels) return;

  tabPanels.innerHTML = "";

  data.forEach((exp, index) => {
    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.setAttribute("id", `panel-${index}`);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${index}`);

    const descriptionItems = exp.description
      .map(item => `<li>${escapeHtml(item)}</li>`)
      .join("");

    panel.innerHTML = `
      <h3>
        <span>${escapeHtml(exp.role)}</span>
        <span class="company">
          @ ${escapeHtml(exp.company)}
        </span>
      </h3>
      <p class="job-range">${escapeHtml(exp.period)}</p>
      <ul>
        ${descriptionItems}
      </ul>
    `;

    tabPanels.appendChild(panel);
  });
}

function setActiveTab(index) {
  const tabList = document.querySelector(".tab-list");
  const tabPanels = document.querySelector(".tab-panels");
  
  if (!tabList || !tabPanels) return;

  // Update buttons
  const buttons = tabList.querySelectorAll("button:not(.tab-highlight)");
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    }
  });

  // Update panels
  const panels = tabPanels.querySelectorAll(".tab-panel");
  panels.forEach((panel, i) => {
    if (i === index) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  // Update highlight position
  const highlight = tabList.querySelector(".tab-highlight");
  if (highlight) {
    highlight.style.transform = `translateY(${index * 42}px)`;
  }

  activeTabIndex = index;
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