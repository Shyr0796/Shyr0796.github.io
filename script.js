const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setMenu = (open) => {
  navToggle?.setAttribute("aria-expanded", String(open));
  navLinks?.classList.toggle("open", open);
  document.body.classList.toggle("nav-open", open);
};

navToggle?.addEventListener("click", () => {
  setMenu(navToggle.getAttribute("aria-expanded") !== "true");
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 16);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;

    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.2, 0.5] }
);

trackedSections.forEach((section) => sectionObserver.observe(section));

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
