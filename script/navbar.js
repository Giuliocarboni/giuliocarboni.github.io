function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 0);
}

const links = [...document.querySelectorAll(".pages a")];
const sections = [...document.querySelectorAll("section[id]")];
const homeLink = links[0];

let clickLock = false;
let unlockTimer;

function activate(activeLink) {
  links.forEach((link) => {
    const isActive = link === activeLink;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function linkFor(section) {
  return links.find((link) => link.hash === `#${section.id}`);
}

function updateActive() {
  if (window.scrollY < 10) {
    activate(homeLink);
    return;
  }

  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  if (atBottom && sections.length) {
    const link = linkFor(sections[sections.length - 1]);
    if (link) activate(link);
    return;
  }

  const middle = window.innerHeight / 2;
  const current = sections
    .filter((s) => s.getBoundingClientRect().top <= middle)
    .pop();
  const link = current && linkFor(current);
  if (link) activate(link);
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    activate(link);
    clickLock = true;
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => (clickLock = false), 1000);
  });
});

function onScroll() {
  updateNavbar();

  if (clickLock) {
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => (clickLock = false), 150);
    return;
  }

  updateActive();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateActive);
onScroll();
