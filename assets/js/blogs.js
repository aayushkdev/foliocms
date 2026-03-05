const grid = document.querySelector("#blogGrid");

const blogs = [
  {
    title: "Building My Portfolio from Scratch",
    description: "How I designed and developed my personal portfolio using vanilla HTML, CSS, and JavaScript.",
    date: "Jan 12 2026",
    link: "#"
  },
  {
    title: "Understanding CSS Variables",
    description: "A quick guide on how CSS variables work and how they simplify theming systems.",
    date: "Feb 02 2026",
    link: "#"
  },
  {
    title: "JavaScript Project Architecture",
    description: "How I structure front-end projects to keep them scalable and maintainable.",
    date: "Feb 18 2026",
    link: "#"
  },
  {
    title: "Designing Dark Mode Interfaces",
    description: "Things to consider when designing dark UI themes for better accessibility.",
    date: "Mar 01 2026",
    link: "#"
  },
  {
    title: "My Favorite Developer Tools",
    description: "A collection of tools that improved my productivity as a developer.",
    date: "Mar 05 2026",
    link: "#"
  }
];

function renderBlogs() {

  blogs.forEach(blog => {

    const card = `
    <article class="blog-card">

      <h3>
        <a href="${blog.link}">
          ${blog.title}
        </a>
      </h3>

      <p>
        ${blog.description}
      </p>

      <span class="blog-date">
        ${blog.date}
      </span>

    </article>
    `;

    grid.innerHTML += card;

  });

}

renderBlogs();