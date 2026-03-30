# FolioCMS

This is a personal portfolio website with a simple admin page to manage projects and blogs.

## Project Title

**Aayush Kumar Portfolio (FolioCMS)**

## Features Implemented

- Main homepage with About, Experience, Projects, Blogs, and Contact sections.
- Projects page that shows all projects.
- Blogs page that shows all blog posts.
- Separate pages for each blog post.
- Admin page (`/admin.html`) with:
  - Login
  - Dashboard
  - Manage Projects and Blogs
  - Add, edit, and preview content
  - Theme options

## How to Run the Project

This is a simple website, so you can run it with a local server.

### Option 1: Python

```bash
python3 -m http.server 5500
```

Then open:

- `http://localhost:5500/`
- `http://localhost:5500/admin.html`

### Option 2: VS Code Live Server

Open the project folder and start **Live Server** from `index.html`.

## Admin Login (Local Demo)

- Username: `admin`
- Password: `admin123`

## Page Links

- Home: `https://folio.aayushk.dev/`
- Projects: `https://folio.aayushk.dev/projects.html`
- Blogs: `https://folio.aayushk.dev/blogs.html`
- Admin: `https://folio.aayushk.dev/admin.html`
- Admin Dashboard: `https://folio.aayushk.dev/admin.html#/dashboard`

## Notes

- Project and blog data is stored in the `data/` folder.
- Changes from the admin page are temporary for now unless connected to a backend.
