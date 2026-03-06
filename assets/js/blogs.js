const grid = document.querySelector("#blogGrid");

async function loadBlogs() {
  try {

    const res = await fetch("/data/blogs.json");
    const blogs = await res.json();

    blogs.forEach((blog) => {

      const card = document.createElement("a");
      card.className = "blog-card";
      card.href = blog.link;

      card.innerHTML = `
        <div class="blog-image">
          <img src="${blog.image}" alt="${blog.title}">
        </div>

        <div class="blog-content">

          <span class="blog-date">
            ${blog.date}
          </span>

          <h2 class="blog-title">
            ${blog.title}
          </h2>

          <p class="blog-description">
            ${blog.description}
          </p>

          <span class="blog-readmore">
            Read more →
          </span>

        </div>
      `;

      grid.appendChild(card);

    });

  } catch (err) {
    console.error("Failed to load blogs:", err);
  }
}

loadBlogs();