function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 0);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

const links = document.querySelectorAll(".pages a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
