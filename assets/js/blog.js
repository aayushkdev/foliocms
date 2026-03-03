document.addEventListener("DOMContentLoaded", loadBlogs);

async function loadBlogs() {
  const blogs = await fetchData("blogs.json");
  const container = document.getElementById("blogContainer");

  if (!container) return;

  container.innerHTML = "";

  blogs.forEach(blog => {
    container.innerHTML += `
      <div class="card">
        <h3>${blog.title}</h3>
        <p class="muted">${blog.date}</p>
        <p>${blog.summary}</p>
        <a href="#" class="link">Read More →</a>
      </div>
    `;
  });
}