const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_TYPES = ["projects", "blogs"];
const THEME_PRESETS = {
  dark: {
    label: "Dark",
    mode: "dark",
    vars: null,
  },
  light: {
    label: "Light",
    mode: "light",
    vars: null,
  },
  dracula: {
    label: "Dracula",
    mode: "dark",
    vars: {
      "--bg": "#282a36",
      "--bg-light": "#343746",
      "--bg-lightest": "#44475a",
      "--text": "#f8f8f2",
      "--text-light": "#e2e2dd",
      "--muted": "#b5b8c9",
      "--accent": "#bd93f9",
      "--border": "#4d5167",
    },
  },
  nord: {
    label: "Nord",
    mode: "dark",
    vars: {
      "--bg": "#2e3440",
      "--bg-light": "#3b4252",
      "--bg-lightest": "#434c5e",
      "--text": "#e5e9f0",
      "--text-light": "#d8dee9",
      "--muted": "#a3b0c6",
      "--accent": "#88c0d0",
      "--border": "#4c566a",
    },
  },
  catppuccin: {
    label: "Catppuccin",
    mode: "dark",
    vars: {
      "--bg": "#1e1e2e",
      "--bg-light": "#313244",
      "--bg-lightest": "#45475a",
      "--text": "#cdd6f4",
      "--text-light": "#bac2de",
      "--muted": "#a6adc8",
      "--accent": "#f5c2e7",
      "--border": "#585b70",
    },
  },
  everforest: {
    label: "Everforest",
    mode: "dark",
    vars: {
      "--bg": "#2d353b",
      "--bg-light": "#343f44",
      "--bg-lightest": "#3f4b50",
      "--text": "#d3c6aa",
      "--text-light": "#c9bfa9",
      "--muted": "#a7b39f",
      "--accent": "#a7c080",
      "--border": "#4f5b58",
    },
  },
  tokyonight: {
    label: "Tokyo Night",
    mode: "dark",
    vars: {
      "--bg": "#1a1b26",
      "--bg-light": "#24283b",
      "--bg-lightest": "#2f354f",
      "--text": "#c0caf5",
      "--text-light": "#a9b1d6",
      "--muted": "#7f86b3",
      "--accent": "#7aa2f7",
      "--border": "#3b4261",
    },
  },
  gruvbox: {
    label: "Gruvbox",
    mode: "dark",
    vars: {
      "--bg": "#282828",
      "--bg-light": "#32302f",
      "--bg-lightest": "#3c3836",
      "--text": "#ebdbb2",
      "--text-light": "#d5c4a1",
      "--muted": "#bdae93",
      "--accent": "#fabd2f",
      "--border": "#504945",
    },
  },
};

const appState = {
  isAuthenticated: false,
  projects: [],
  blogs: [],
  nextProjectId: 1,
  nextBlogId: 1,
  flashMessage: "",
  loginError: "",
  formError: "",
  activeTheme: "dark",
  customTheme: {
    background: "#0f172a",
    surface: "#1e293b",
    surfaceAlt: "#334155",
    text: "#e2e8f0",
    textLight: "#cbd5e1",
    muted: "#94a3b8",
    accent: "#38bdf8",
    border: "#334155",
  },
};

const root = document.querySelector("#adminApp");

document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();
  bindEvents();
  ensureValidHash();
  renderApp();
});

function bindEvents() {
  window.addEventListener("hashchange", () => {
    ensureValidHash();
    renderApp();
  });

  root.addEventListener("click", handleClickEvents);
  root.addEventListener("submit", handleSubmitEvents);
}

async function initializeData() {
  appState.projects = await loadProjects();
  appState.blogs = await loadBlogs();

  appState.nextProjectId = getNextId(appState.projects);
  appState.nextBlogId = getNextId(appState.blogs);

  applyTheme("dark");
}

async function loadProjects() {
  try {
    const response = await fetch("/data/projects.json");
    if (!response.ok) throw new Error("Failed to fetch projects.json");
    const data = await response.json();

    return data.map((project, index) => ({
      id: Number.isFinite(project.id) ? project.id : index + 1,
      title: project.title || `Project ${index + 1}`,
      category: project.category || "General",
      status: "published",
      date: formatDate(project.date),
      excerpt: project.description || "",
      content: project.description || "",
      tech: Array.isArray(project.tech) ? project.tech : [],
      image: project.image || "",
      githubLink: project.githubLink || "",
      demoLink: project.demoLink || "",
    }));
  } catch (error) {
    return [
      {
        id: 1,
        title: "Internal Dashboard",
        category: "Web & Applications",
        status: "published",
        date: "2026-03-01",
        excerpt: "MVP dashboard prototype with task and activity views.",
        content:
          "MVP dashboard prototype with task and activity views. Focused on simple navigation and clean data blocks.",
      },
      {
        id: 2,
        title: "Build Pipeline Helper",
        category: "Developer Tools",
        status: "draft",
        date: "2026-03-05",
        excerpt: "CLI helper to simplify repetitive release steps.",
        content:
          "CLI helper to simplify repetitive release steps, including changelog checks and package validation.",
      },
    ];
  }
}

async function loadBlogs() {
  try {
    const response = await fetch("/data/blogs.json");
    if (!response.ok) throw new Error("Failed to fetch blogs.json");
    const data = await response.json();

    return data.map((blog, index) => ({
      id: index + 1,
      title: blog.title || `Blog ${index + 1}`,
      category: blog.category || "Engineering",
      status: "published",
      date: formatDate(blog.date),
      excerpt: blog.description || "",
      content: blog.description || "",
      image: blog.image || "",
      link: blog.link || "",
    }));
  } catch (error) {
    return [
      {
        id: 1,
        title: "Shipping an MVP Quickly",
        category: "Engineering",
        status: "published",
        date: "2026-03-02",
        excerpt: "A simple approach to planning and shipping MVP work.",
        content:
          "A simple approach to planning and shipping MVP work: define constraints, ship thin slices, and iterate.",
      },
      {
        id: 2,
        title: "Notes on Theming Systems",
        category: "Frontend",
        status: "draft",
        date: "2026-03-07",
        excerpt: "How token-based themes keep styles easy to maintain.",
        content:
          "How token-based themes keep styles easy to maintain with consistent spacing, colors, and typography choices.",
      },
    ];
  }
}

function handleClickEvents(event) {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    navigate(navButton.dataset.nav);
    return;
  }

  const logoutButton = event.target.closest("[data-action='logout']");
  if (logoutButton) {
    appState.isAuthenticated = false;
    appState.flashMessage = "";
    appState.loginError = "";
    appState.formError = "";
    navigate("/login");
    return;
  }

  const statusButton = event.target.closest("[data-action='toggle-status']");
  if (statusButton) {
    const type = statusButton.dataset.type;
    const id = Number(statusButton.dataset.id);
    toggleStatus(type, id);
    return;
  }

  const themeButton = event.target.closest("[data-action='set-theme']");
  if (themeButton) {
    const theme = (themeButton.dataset.theme || "").toLowerCase();
    applyTheme(theme);
    return;
  }

  const customThemeApplyButton = event.target.closest("[data-action='apply-custom-theme']");
  if (customThemeApplyButton) {
    const form = root.querySelector("#adminCustomThemeForm");
    if (form) applyCustomTheme(form);
    return;
  }
}

function handleSubmitEvents(event) {
  const form = event.target;

  if (form.id === "adminLoginForm") {
    event.preventDefault();
    handleLoginSubmit(form);
    return;
  }

  if (form.id === "adminEditorForm") {
    event.preventDefault();
    handleEditorSubmit(form);
    return;
  }

  if (form.id === "adminCustomThemeForm") {
    event.preventDefault();
    applyCustomTheme(form);
  }
}

function handleLoginSubmit(form) {
  const username = form.username.value.trim();
  const password = form.password.value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    appState.isAuthenticated = true;
    appState.loginError = "";
    appState.flashMessage = "Logged in successfully.";
    navigate("/dashboard");
    return;
  }

  appState.loginError = "Invalid credentials. Use admin / admin123.";
  renderApp();
}

function handleEditorSubmit(form) {
  const route = parseRoute();
  const type = route.params.type;
  const collection = getCollection(type);
  if (!collection) return;

  const formData = new FormData(form);
  const payload = {
    title: (formData.get("title") || "").toString().trim(),
    excerpt: (formData.get("excerpt") || "").toString().trim(),
    category: (formData.get("category") || "").toString().trim(),
    content: (formData.get("content") || "").toString().trim(),
    status: normalizeStatus((formData.get("status") || "draft").toString()),
  };

  if (!payload.title || !payload.category || !payload.content) {
    appState.formError = "Title, category, and content are required.";
    renderApp();
    return;
  }

  appState.formError = "";

  if (route.name === "new") {
    const id = type === "projects" ? appState.nextProjectId++ : appState.nextBlogId++;
    collection.unshift({
      id,
      title: payload.title,
      category: payload.category,
      excerpt: payload.excerpt,
      content: payload.content,
      status: payload.status,
      date: formatDate(),
    });
    appState.flashMessage = `${toLabel(type)} item created in memory.`;
    navigate(`/${type}`);
    return;
  }

  const id = Number(route.params.id);
  const target = collection.find((item) => item.id === id);
  if (!target) {
    appState.formError = "Item not found.";
    renderApp();
    return;
  }

  target.title = payload.title;
  target.excerpt = payload.excerpt;
  target.category = payload.category;
  target.content = payload.content;
  target.status = payload.status;

  appState.flashMessage = `${toLabel(type)} item updated in memory.`;
  navigate(`/${type}`);
}

function toggleStatus(type, id) {
  const collection = getCollection(type);
  if (!collection) return;

  const target = collection.find((item) => item.id === id);
  if (!target) return;

  target.status = target.status === "published" ? "draft" : "published";
  appState.flashMessage = `${escapeHtml(target.title)} is now ${target.status}.`;
  renderApp();
}

function navigate(path) {
  window.location.hash = `#${path}`;
}

function ensureValidHash() {
  const route = parseRoute();

  if (!route.valid) {
    navigate(appState.isAuthenticated ? "/dashboard" : "/login");
    return;
  }

  if (!appState.isAuthenticated && route.name !== "login") {
    navigate("/login");
    return;
  }

  if (appState.isAuthenticated && route.name === "login") {
    navigate("/dashboard");
    return;
  }

  if (["edit", "preview"].includes(route.name)) {
    const collection = getCollection(route.params.type);
    const id = Number(route.params.id);
    const exists = collection?.some((item) => item.id === id);
    if (!exists) navigate(`/${route.params.type}`);
  }
}

function parseRoute() {
  const hash = window.location.hash || "#/login";
  const path = hash.replace(/^#\/?/, "");
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { name: "login", params: {}, valid: true };
  }

  const [rootSegment, second, third] = segments;

  if (rootSegment === "login" && segments.length === 1) {
    return { name: "login", params: {}, valid: true };
  }

  if (["dashboard", "projects", "blogs", "analytics", "themes"].includes(rootSegment) && segments.length === 1) {
    return { name: rootSegment, params: {}, valid: true };
  }

  if (rootSegment === "new" && segments.length === 2 && ADMIN_TYPES.includes(second)) {
    return { name: "new", params: { type: second }, valid: true };
  }

  if (rootSegment === "edit" && segments.length === 3 && ADMIN_TYPES.includes(second) && isNumeric(third)) {
    return { name: "edit", params: { type: second, id: third }, valid: true };
  }

  if (rootSegment === "preview" && segments.length === 3 && ADMIN_TYPES.includes(second) && isNumeric(third)) {
    return { name: "preview", params: { type: second, id: third }, valid: true };
  }

  return { name: "unknown", params: {}, valid: false };
}

function renderApp() {
  const route = parseRoute();

  if (route.name === "login") {
    root.innerHTML = renderLoginView();
    return;
  }

  root.innerHTML = renderShell(route, renderContent(route));
}

function renderShell(route, content) {
  const currentTheme = document.documentElement.dataset.theme || "dark";

  return `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="logo">
          <a href="/" aria-label="home">
            <div class="hex-container">
              <svg id="hex" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
                <title>Hexagon</title>
                <g transform="translate(-8,-2)">
                  <g transform="translate(11,5)">
                    <polygon stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="39 0 0 22 0 67 39 90 78 68 78 23" fill="currentColor" />
                  </g>
                </g>
              </svg>
            </div>

            <div class="logo-container">
              <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
                <title>Logo</title>
                <g transform="translate(-8,-2)">
                  <g transform="translate(11,5)">
                    <polygon stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="39 0 0 22 0 67 39 90 78 68 78 23" fill="none" />
                    <path d="M49.5 61 L44.2 61 L41.8 53 L34.2 53 L31.8 61 L26.5 61 L35 30.3 L41 30.3 L49.5 61 Z M40.6 48.5 L38 38.2 L35.4 48.5 L40.6 48.5 Z" fill="currentColor" />
                  </g>
                </g>
              </svg>
            </div>
          </a>
        </div>
        <nav class="admin-nav" aria-label="Admin navigation">
          ${renderNavLink("Dashboard", "/dashboard", route)}
          ${renderNavLink("Projects", "/projects", route)}
          ${renderNavLink("Blogs", "/blogs", route)}
          ${renderNavLink("Analytics", "/analytics", route)}
          ${renderNavLink("Themes", "/themes", route)}
        </nav>
        <button class="admin-link admin-link--danger" type="button" data-action="logout">Logout</button>
      </aside>

      <section class="admin-main">
        <header class="admin-main-header">
          <h1>${escapeHtml(getRouteTitle(route))}</h1>
          <p>Theme: <strong>${escapeHtml(currentTheme)}</strong></p>
        </header>

        ${appState.flashMessage ? `<div class="admin-notice">${escapeHtml(appState.flashMessage)}</div>` : ""}
        ${content}
      </section>
    </div>
  `;
}

function renderContent(route) {
  switch (route.name) {
    case "dashboard":
      return renderDashboard();
    case "projects":
      return renderListView("projects", appState.projects);
    case "blogs":
      return renderListView("blogs", appState.blogs);
    case "new":
      return renderEditorView(route.params.type, null);
    case "edit": {
      const item = getCollection(route.params.type)?.find((entry) => entry.id === Number(route.params.id));
      return renderEditorView(route.params.type, item || null);
    }
    case "preview": {
      const item = getCollection(route.params.type)?.find((entry) => entry.id === Number(route.params.id));
      return renderPreviewView(route.params.type, item || null);
    }
    case "analytics":
      return renderAnalyticsView();
    case "themes":
      return renderThemesView();
    default:
      return `<div class="admin-card">Page not found.</div>`;
  }
}

function renderLoginView() {
  return `
    <section class="admin-login-wrap">
      <header class="admin-login-topbar">
        <div class="logo">
          <a href="/" aria-label="home">
            <div class="hex-container">
              <svg id="hex" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
                <title>Hexagon</title>
                <g transform="translate(-8,-2)">
                  <g transform="translate(11,5)">
                    <polygon stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="39 0 0 22 0 67 39 90 78 68 78 23" fill="currentColor" />
                  </g>
                </g>
              </svg>
            </div>

            <div class="logo-container">
              <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
                <title>Logo</title>
                <g transform="translate(-8,-2)">
                  <g transform="translate(11,5)">
                    <polygon stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="39 0 0 22 0 67 39 90 78 68 78 23" fill="none" />
                    <path d="M49.5 61 L44.2 61 L41.8 53 L34.2 53 L31.8 61 L26.5 61 L35 30.3 L41 30.3 L49.5 61 Z M40.6 48.5 L38 38.2 L35.4 48.5 L40.6 48.5 Z" fill="currentColor" />
                  </g>
                </g>
              </svg>
            </div>
          </a>
        </div>
      </header>

      <div class="admin-login-layout">
        <div class="admin-login-card">
          <h1>Sign in</h1>
          <p>Enter your admin credentials to continue.</p>
          ${appState.loginError ? `<div class="admin-error">${appState.loginError}</div>` : ""}
          <form id="adminLoginForm" class="admin-form" autocomplete="off">
            <label>
              Username
              <input name="username" type="text" required>
            </label>
            <label>
              Password
              <input name="password" type="password" required>
            </label>
            <button type="submit" class="admin-btn admin-btn--primary">Sign In</button>
          </form>
          <p class="admin-login-hint">Username: <strong>admin</strong> · Password: <strong>admin123</strong></p>
        </div>
      </div>
    </section>
  `;
}

function renderListView(type, collection) {
  return `
    <section class="admin-card">
      <div class="admin-card-head">
        <h2>${escapeHtml(toLabel(type))}</h2>
        <button class="admin-btn admin-btn--primary" type="button" data-nav="/new/${type}">Add ${escapeHtml(type === "projects" ? "Project" : "Blog")}</button>
      </div>

      ${collection.length === 0 ? `<p class="admin-empty">No items yet.</p>` : `
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${collection
                .map(
                  (item) => {
                    const safeStatus = normalizeStatus(item.status);

                    return `
                <tr>
                  <td>${escapeHtml(item.title)}</td>
                  <td>${escapeHtml(item.category)}</td>
                  <td><span class="admin-badge admin-badge--${safeStatus}">${escapeHtml(safeStatus)}</span></td>
                  <td>${escapeHtml(item.date)}</td>
                  <td>
                    <div class="admin-actions">
                      <button class="admin-btn" type="button" data-nav="/edit/${type}/${item.id}">Edit</button>
                      <button class="admin-btn" type="button" data-nav="/preview/${type}/${item.id}">Preview</button>
                      <button class="admin-btn" type="button" data-action="toggle-status" data-type="${type}" data-id="${item.id}">
                        ${safeStatus === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
                  }
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `}
    </section>
  `;
}

function renderEditorView(type, item) {
  const isEdit = Boolean(item);
  const source = item || {
    title: "",
    excerpt: "",
    category: "",
    content: "",
    status: "draft",
  };

  const categories = getCategoryOptions(type, source.category);

  return `
    <section class="admin-card">
      <div class="admin-card-head">
        <h2>${isEdit ? "Edit" : "New"} ${escapeHtml(type === "projects" ? "Project" : "Blog")}</h2>
        <button class="admin-btn" type="button" data-nav="/${type}">Back</button>
      </div>

      ${appState.formError ? `<div class="admin-error">${appState.formError}</div>` : ""}

      <form id="adminEditorForm" class="admin-form admin-form--editor">
        <label>
          Title *
          <input type="text" name="title" value="${escapeHtmlAttr(source.title)}" required>
        </label>

        <label>
          ${type === "projects" ? "Summary" : "Excerpt"}
          <input type="text" name="excerpt" value="${escapeHtmlAttr(source.excerpt)}">
        </label>

        <label>
          Category *
          <select name="category" required>
            <option value="">Select category</option>
            ${categories
              .map(
                (category) =>
                  `<option value="${escapeHtmlAttr(category)}" ${source.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`
              )
              .join("")}
          </select>
        </label>

        <label>
          Status
          <select name="status">
            <option value="draft" ${source.status === "draft" ? "selected" : ""}>draft</option>
            <option value="published" ${source.status === "published" ? "selected" : ""}>published</option>
          </select>
        </label>

        <label>
          Content *
          <textarea name="content" rows="12" required>${escapeHtml(source.content)}</textarea>
        </label>

        <div class="admin-actions">
          <button type="submit" class="admin-btn admin-btn--primary">Save</button>
          ${isEdit ? `<button type="button" class="admin-btn" data-nav="/preview/${type}/${item.id}">Preview</button>` : ""}
        </div>
      </form>
    </section>
  `;
}

function renderPreviewView(type, item) {
  if (!item) {
    return `
      <section class="admin-card">
        <p>Item not found.</p>
        <button class="admin-btn" type="button" data-nav="/${type}">Back</button>
      </section>
    `;
  }

  const safeStatus = normalizeStatus(item.status);
  const previewDate = item.date || formatDate();

  if (type === "blogs") {
    const previewDescription = item.excerpt || item.content;
    const readTime = estimateReadTime(previewDescription);
    const blogHtmlPath = normalizePreviewPath(item.link);

    if (blogHtmlPath) {
      return `
        <article class="admin-card admin-preview admin-preview-site">
          <div class="admin-card-head">
            <h2>Blog Preview</h2>
            <button class="admin-btn" type="button" data-nav="/blogs">Back</button>
          </div>

          <div class="admin-preview-frame">
            <iframe
              class="admin-preview-embed"
              src="${escapeHtmlAttr(blogHtmlPath)}"
              title="${escapeHtmlAttr(item.title || "Blog preview")}" 
              loading="lazy"
            ></iframe>
          </div>
        </article>
      `;
    }

    const hero = item.image
      ? `<div class="blog-hero"><img src="${escapeHtmlAttr(item.image)}" alt="${escapeHtmlAttr(item.title)}"></div>`
      : `<div class="blog-hero admin-preview-hero-placeholder"></div>`;

    return `
      <article class="admin-card admin-preview admin-preview-site">
        <div class="admin-card-head">
          <h2>Blog Preview</h2>
          <button class="admin-btn" type="button" data-nav="/blogs">Back</button>
        </div>

        <section class="blog-container">
          <h1 class="blog-title">${escapeHtml(item.title)}</h1>
          <div class="blog-meta">${escapeHtml(previewDate)} · ${escapeHtml(readTime)}</div>
          ${hero}
          <div class="blog-content">${renderPreviewRichContent(previewDescription)}</div>
          <a href="#/blogs" class="blog-back" data-nav="/blogs">← Back to blog</a>
        </section>
      </article>
    `;
  }

  const techList = Array.isArray(item.tech) ? item.tech : [];
  const primaryLink = item.demoLink || item.githubLink || "#";
  const hasExternalLink = item.demoLink || item.githubLink;
  const description = item.excerpt || item.content;

  return `
    <article class="admin-card admin-preview admin-preview-site">
      <div class="admin-card-head">
        <h2>Project Preview</h2>
        <button class="admin-btn" type="button" data-nav="/${type}">Back</button>
      </div>

      <ul class="projects-grid admin-preview-project-grid">
        <li class="project-card">
          <div class="project-inner">
            <header>
              <div class="project-card-top">
                <div class="project-folder">
                  <img src="/assets/images/folder.svg" alt="Folder icon">
                </div>

                <div class="project-links">
                  ${item.githubLink ? `
                    <a href="${escapeHtmlAttr(item.githubLink)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Link">
                      <img src="/assets/images/github.svg" alt="GitHub">
                    </a>
                  ` : ""}
                  ${item.demoLink ? `
                    <a href="${escapeHtmlAttr(item.demoLink)}" target="_blank" rel="noopener noreferrer" aria-label="External Link">
                      <img src="/assets/images/external.svg" alt="External Link">
                    </a>
                  ` : ""}
                </div>
              </div>

              <h3 class="project-title">
                ${hasExternalLink
                  ? `<a href="${escapeHtmlAttr(primaryLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>`
                  : escapeHtml(item.title)}
              </h3>

              <p class="project-category">${escapeHtml(item.category)}</p>
              <p class="project-description">${escapeHtml(description)}</p>
            </header>

            <footer>
              ${techList.length
                ? `<ul class="project-tech-list">${techList.map((tech) => `<li>${escapeHtml(tech)}</li>`).join("")}</ul>`
                : ""}
            </footer>
          </div>
        </li>
      </ul>
    </article>
  `;
}

function renderPreviewRichContent(content) {
  const normalized = (content || "").toString().trim();
  if (!normalized) return "<p>No content available.</p>";

  const lines = normalized.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let paragraphBuffer = [];
  let listBuffer = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    blocks.push(`<p>${escapeHtml(paragraphBuffer.join(" "))}</p>`);
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push(`<ul>${listBuffer.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`);
    listBuffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${escapeHtml(headingMatch[1])}</h2>`);
      return;
    }

    const sentenceHeading =
      !/[.!?]$/.test(trimmed) &&
      trimmed.length > 8 &&
      trimmed.length < 80 &&
      !trimmed.includes(":") &&
      /^[A-Z0-9]/.test(trimmed);
    if (sentenceHeading) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${escapeHtml(trimmed)}</h2>`);
      return;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(listMatch[1]);
      return;
    }

    if (listBuffer.length) flushList();
    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks.join("");
}

function estimateReadTime(content) {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function normalizePreviewPath(link) {
  const raw = String(link || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  return `/${raw.replace(/^\.?\//, "")}`;
}

function applyTheme(themeKey) {
  const key = String(themeKey || "").toLowerCase();
  const preset = THEME_PRESETS[key];
  if (!preset) return;

  clearInlineThemeVars();
  document.documentElement.dataset.theme = preset.mode;

  if (preset.vars) {
    Object.entries(preset.vars).forEach(([token, value]) => {
      document.documentElement.style.setProperty(token, value);
    });
  }

  appState.activeTheme = key;
  appState.flashMessage = `Theme changed to ${preset.label}.`;
  renderApp();
}

function applyCustomTheme(form) {
  if (!form) return;

  const custom = {
    background: sanitizeColor(form.background?.value, appState.customTheme.background),
    surface: sanitizeColor(form.surface?.value, appState.customTheme.surface),
    surfaceAlt: sanitizeColor(form.surfaceAlt?.value, appState.customTheme.surfaceAlt),
    text: sanitizeColor(form.text?.value, appState.customTheme.text),
    textLight: sanitizeColor(form.textLight?.value, appState.customTheme.textLight),
    muted: sanitizeColor(form.muted?.value, appState.customTheme.muted),
    accent: sanitizeColor(form.accent?.value, appState.customTheme.accent),
    border: sanitizeColor(form.border?.value, appState.customTheme.border),
  };

  appState.customTheme = custom;

  clearInlineThemeVars();
  document.documentElement.dataset.theme = "dark";
  document.documentElement.style.setProperty("--bg", custom.background);
  document.documentElement.style.setProperty("--bg-light", custom.surface);
  document.documentElement.style.setProperty("--bg-lightest", custom.surfaceAlt);
  document.documentElement.style.setProperty("--text", custom.text);
  document.documentElement.style.setProperty("--text-light", custom.textLight);
  document.documentElement.style.setProperty("--muted", custom.muted);
  document.documentElement.style.setProperty("--accent", custom.accent);
  document.documentElement.style.setProperty("--border", custom.border);

  appState.activeTheme = "custom";
  appState.flashMessage = "Theme changed to custom.";
  renderApp();
}

function clearInlineThemeVars() {
  const tokens = ["--bg", "--bg-light", "--bg-lightest", "--text", "--text-light", "--muted", "--accent", "--border"];
  tokens.forEach((token) => {
    document.documentElement.style.removeProperty(token);
  });
}

function sanitizeColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : fallback;
}

function renderAnalyticsView() {
  const metrics = computeMetrics();
  const total = metrics.totalProjects + metrics.totalBlogs;
  const publishRate = total ? Math.round((metrics.published / total) * 100) : 0;
  const visitors = [1800, 2140, 1980, 2450, 2890, 2720, 3010];
  const sources = [
    { label: "Organic Search", value: 46 },
    { label: "Direct", value: 28 },
    { label: "Social", value: 16 },
    { label: "Referrals", value: 10 },
  ];
  const sections = [
    { label: "Projects", value: 42 },
    { label: "Blogs", value: 33 },
    { label: "Home", value: 17 },
    { label: "Contact", value: 8 },
  ];

  return `
    <section class="admin-grid admin-grid--metrics">
      ${renderMetricCard("Total Content", total)}
      ${renderMetricCard("Weekly Visitors", "16.9K")}
      ${renderMetricCard("Avg. Session", "2m 48s")}
      ${renderMetricCard("Publish Rate", `${publishRate}%`)}
      ${renderMetricCard("Bounce Rate", "36%")}
    </section>

    <section class="admin-grid admin-grid--two">
      <article class="admin-card">
        <div class="admin-card-head">
          <h2>Visitors (Last 7 days)</h2>
          <span class="admin-muted">+12.4% vs previous week</span>
        </div>
        <div class="admin-chart" aria-hidden="true">
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
          <h2>Traffic Sources</h2>
          <span class="admin-muted">Channel distribution</span>
        </div>
        <ul class="admin-analytics-list">
          ${sources
            .map(
              (item) => `
            <li>
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <span>${item.value}%</span>
              </div>
              <div class="admin-progress" aria-hidden="true"><span style="width:${item.value}%"></span></div>
            </li>
          `
            )
            .join("")}
        </ul>
      </article>
    </section>

    <section class="admin-card">
      <h2>Popular Sections</h2>
      <ul class="admin-analytics-list">
        ${sections
          .map(
            (item) => `
          <li>
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <span>${item.value}% of pageviews</span>
            </div>
            <div class="admin-progress" aria-hidden="true"><span style="width:${item.value}%"></span></div>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderThemesView() {
  const currentTheme = appState.activeTheme || "dark";
  const custom = appState.customTheme;
  const themeKeys = ["dark", "light", "dracula", "nord", "catppuccin", "everforest", "tokyonight", "gruvbox"];

  return `
    <section class="admin-card">
      <h2>Theme Presets</h2>
      <p class="admin-muted">Apply a style preset or build a custom palette for the admin panel.</p>

      <div class="admin-actions admin-theme-grid">
        ${themeKeys
          .map((key) => {
            const theme = THEME_PRESETS[key];
            const activeClass = currentTheme === key ? "admin-btn--primary" : "";
            return `
              <button
                class="admin-btn ${activeClass}"
                type="button"
                data-action="set-theme"
                data-theme="${key}"
              >${escapeHtml(theme.label)}</button>
            `;
          })
          .join("")}
      </div>
    </section>

    <section class="admin-card">
      <div class="admin-card-head">
        <h2>Custom Theme</h2>
        <button class="admin-btn" type="button" data-action="apply-custom-theme">Apply</button>
      </div>

      <form id="adminCustomThemeForm" class="admin-form admin-form--custom-theme">
        <label>Background<input type="color" name="background" value="${escapeHtmlAttr(custom.background)}"></label>
        <label>Surface<input type="color" name="surface" value="${escapeHtmlAttr(custom.surface)}"></label>
        <label>Surface Alt<input type="color" name="surfaceAlt" value="${escapeHtmlAttr(custom.surfaceAlt)}"></label>
        <label>Text<input type="color" name="text" value="${escapeHtmlAttr(custom.text)}"></label>
        <label>Text Light<input type="color" name="textLight" value="${escapeHtmlAttr(custom.textLight)}"></label>
        <label>Muted<input type="color" name="muted" value="${escapeHtmlAttr(custom.muted)}"></label>
        <label>Accent<input type="color" name="accent" value="${escapeHtmlAttr(custom.accent)}"></label>
        <label>Border<input type="color" name="border" value="${escapeHtmlAttr(custom.border)}"></label>
        <div class="admin-actions">
          <button type="submit" class="admin-btn admin-btn--primary">Apply Custom Theme</button>
        </div>
      </form>
    </section>
  `;
}

function renderNavLink(label, path, route) {
  const active = isRouteActive(path, route);
  return `
    <button class="admin-link ${active ? "active" : ""}" type="button" data-nav="${path}">
      ${escapeHtml(label)}
    </button>
  `;
}

function renderMetricCard(label, value) {
  return `
    <article class="admin-card admin-metric">
      <p>${escapeHtml(label)}</p>
      <strong>${escapeHtml(String(value))}</strong>
    </article>
  `;
}

function renderMiniList(type, items) {
  if (!items.length) return `<p class="admin-empty">No items available.</p>`;

  return `
    <ul class="admin-mini-list">
      ${items
        .map(
          (item) => `
        <li>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.category)} · ${escapeHtml(item.status)}</p>
          </div>
          <button class="admin-btn" type="button" data-nav="/preview/${type}/${item.id}">Preview</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

function computeMetrics() {
  const projectDrafts = appState.projects.filter((item) => item.status === "draft").length;
  const blogDrafts = appState.blogs.filter((item) => item.status === "draft").length;

  const totalProjects = appState.projects.length;
  const totalBlogs = appState.blogs.length;
  const draft = projectDrafts + blogDrafts;

  return {
    totalProjects,
    totalBlogs,
    published: totalProjects + totalBlogs - draft,
    draft,
    projectDrafts,
    blogDrafts,
  };
}

function getCollection(type) {
  if (type === "projects") return appState.projects;
  if (type === "blogs") return appState.blogs;
  return null;
}

function getCategoryOptions(type, selected) {
  const defaults =
    type === "projects"
      ? ["Developer Tools", "Web & Applications", "Systems & Infrastructure", "Creative & Interactive"]
      : ["Engineering", "Frontend", "Backend", "DevOps", "General"];

  const fromData = getCollection(type)?.map((item) => item.category) || [];
  const merged = [...new Set([...defaults, ...fromData].filter(Boolean))];

  if (selected && !merged.includes(selected)) merged.push(selected);
  return merged;
}

function getRouteTitle(route) {
  if (route.name === "new") return `New ${route.params.type === "projects" ? "Project" : "Blog"}`;
  if (route.name === "edit") return `Edit ${route.params.type === "projects" ? "Project" : "Blog"}`;
  if (route.name === "preview") return `Preview ${route.params.type === "projects" ? "Project" : "Blog"}`;

  return {
    dashboard: "Dashboard",
    projects: "Projects",
    blogs: "Blogs",
    analytics: "Analytics",
    themes: "Themes",
  }[route.name] || "Admin";
}

function isRouteActive(path, route) {
  const target = path.replace(/^\//, "");
  return (
    route.name === target ||
    (route.name === "new" && route.params.type === target) ||
    (route.name === "edit" && route.params.type === target) ||
    (route.name === "preview" && route.params.type === target)
  );
}

function formatDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value;
}

function toLabel(type) {
  return type === "projects" ? "Projects" : "Blogs";
}

function getNextId(list) {
  if (!Array.isArray(list) || list.length === 0) return 1;
  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1;
}

function isNumeric(value) {
  return /^\d+$/.test(value || "");
}

function normalizeStatus(status) {
  return status === "published" || status === "draft" ? status : "draft";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
