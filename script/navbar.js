function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 0);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();
