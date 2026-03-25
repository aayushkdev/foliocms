function renderDashboard() {
  const metrics = computeMetrics();
  const totalContent = metrics.totalProjects + metrics.totalBlogs;
  const publishRate = totalContent ? Math.round((metrics.published / totalContent) * 100) : 0;
  const visitors = [420, 510, 470, 620, 730, 690, 760];
  const popularSections = [
    { label: "Projects", value: 48 },
    { label: "Blogs", value: 34 },
    { label: "About", value: 12 },
    { label: "Contact", value: 6 },
  ];

  const recentProjects = appState.projects.slice(0, 4);
  const recentBlogs = appState.blogs.slice(0, 4);

  return `
    <section class="admin-grid admin-grid--metrics admin-grid--metrics-wide">
      ${renderMetricCard("Total Projects", metrics.totalProjects)}
      ${renderMetricCard("Total Blogs", metrics.totalBlogs)}
      ${renderMetricCard("Published", metrics.published)}
      ${renderMetricCard("Draft", metrics.draft)}
      ${renderMetricCard("Publish Rate", `${publishRate}%`)}
    </section>

    <section class="admin-grid admin-grid--two">
      <article class="admin-card">
        <div class="admin-card-head">
          <h2>Visitor Trend</h2>
          <button class="admin-btn" type="button" data-nav="/analytics">View analytics</button>
        </div>
        <div class="admin-chart admin-chart--compact" aria-hidden="true">
          <div class="admin-chart-bars admin-chart-bars--line">
            ${renderBarSeries(visitors)}
          </div>
          <div class="admin-chart-axis">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </article>

      <article class="admin-card">
        <div class="admin-card-head">
          <h2>Popular Sections</h2>
          <button class="admin-btn" type="button" data-nav="/analytics">Details</button>
        </div>
        <ul class="admin-analytics-list">
          ${popularSections
            .map(
              (item) => `
            <li>
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <span>${item.value}% traffic share</span>
              </div>
              <div class="admin-progress" aria-hidden="true"><span style="width:${item.value}%"></span></div>
            </li>
          `
            )
            .join("")}
        </ul>
      </article>
    </section>

    <section class="admin-grid admin-grid--two">
      <article class="admin-card">
        <div class="admin-card-head">
          <h2>Recent Projects</h2>
          <button class="admin-btn" type="button" data-nav="/projects">View all</button>
        </div>
        ${renderMiniList("projects", recentProjects)}
      </article>

      <article class="admin-card">
        <div class="admin-card-head">
          <h2>Recent Blogs</h2>
          <button class="admin-btn" type="button" data-nav="/blogs">View all</button>
        </div>
        ${renderMiniList("blogs", recentBlogs)}
      </article>
    </section>
  `;
}

function renderBarSeries(values) {
  const max = Math.max(...values, 1);
  return values
    .map((value) => {
      const height = Math.max(12, Math.round((value / max) * 100));
      return `<span class="admin-bar" style="height:${height}%"></span>`;
    })
    .join("");
}
