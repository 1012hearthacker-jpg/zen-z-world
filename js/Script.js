const menuBtn = document.querySelector(".menu-btn");

const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

  navLinks.classList.toggle("active");

});
/* =========================
   LOADER
========================= */

const loader =
document.querySelector(".loader");

window.addEventListener("load", () => {

  setTimeout(() => {

    loader.classList.add("hide");

  }, 1500);

}); 
/* =========================
   PREMIUM CURSOR
========================= */

const dot =
document.querySelector(".cursor-dot");

const outline =
document.querySelector(".cursor-outline");

document.addEventListener("mousemove",
(e)=>{

  const x = e.clientX;

  const y = e.clientY;

  /* Dot */

  dot.style.left =
  x + "px";

  dot.style.top =
  y + "px";

  /* Outline */

  outline.style.left =
  x + "px";

  outline.style.top =
  y + "px";

});
/* =========================
   CURSOR TOGGLE
========================= */

const toggleBtn =
document.querySelector("#cursor-toggle");

let cursorEnabled = true;

toggleBtn.addEventListener("click",()=>{

  cursorEnabled = !cursorEnabled;

  if(cursorEnabled){

    dot.style.display = "block";

    outline.style.display = "block";

    toggleBtn.innerText =
    "Cursor OFF";

  }

  else{

    dot.style.display = "none";

    outline.style.display = "none";

    toggleBtn.innerText =
    "Cursor ON";
  }

});
/* =========================
   DARK LIGHT MODE
========================= */

const themeBtn =
document.querySelector("#theme-toggle");

themeBtn.addEventListener("click",()=>{

  document.body.classList.toggle(
  "light-mode");

  /* Button Text */

  if(document.body.classList.contains(
  "light-mode")){

    themeBtn.innerText =
    "Dark Mode";
  }

  else{

    themeBtn.innerText =
    "Light Mode";
  }

});