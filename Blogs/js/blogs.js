 const blogs = [

  {
    title: "Future Of AI",
    file: "blogs-content/blog1.txt"
  },

  {
    title: "Success Mindset",
    file: "blogs-content/blog2.txt"
  },

  {
    title: "Digital Freedom",
    file: "blogs-content/blog3.txt"
  }

];

/* Elements */

const container =
document.getElementById("blogsContainer");

const popup =
document.getElementById("popup");

const blogContent =
document.getElementById("blogContent");

const closeBtn =
document.querySelector(".close-btn");

/* Create Blog Cards */

blogs.forEach(blog => {

  const card =
  document.createElement("div");

  card.classList.add("blog-card");

  card.innerHTML = `

    <h2>${blog.title}</h2>

    <p>
      Click to read full blog
    </p>

  `;

  /* Open Blog */

  card.addEventListener("click",
  async () => {

    const response =
    await fetch(blog.file);

    const text =
    await response.text();

    blogContent.textContent =
    text;

    popup.style.display = "flex";

  });

  container.appendChild(card);

});

/* Close Popup */

closeBtn.addEventListener("click",
() => {

  popup.style.display = "none";

});