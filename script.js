const root = document.documentElement;
root.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const themeButton = document.querySelector('.theme-toggle');
const typingParts = [...document.querySelectorAll('[data-typing]')];

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') root.dataset.theme = 'dark';

const revealItems = document.querySelectorAll('.reveal-on-scroll, .reveal-section, .slide-from-right, .slide-from-left');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -55px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

function updateThemeControl() {
  const isDark = root.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.querySelector('.theme-icon').textContent = isDark ? '☼' : '◐';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#121a17' : '#f4f6f2');
}

async function typeHeadline() {
  const caret = document.querySelector('.typing-caret');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    typingParts.forEach((part) => { part.textContent = part.dataset.typing; });
    caret.hidden = true;
    return;
  }

  for (const part of typingParts) {
    for (const character of part.dataset.typing) {
      part.textContent += character;
      await new Promise((resolve) => window.setTimeout(resolve, 55));
    }
  }
}

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (nextTheme === 'light') delete root.dataset.theme;
  else root.dataset.theme = nextTheme;
  localStorage.setItem('portfolio-theme', nextTheme);
  updateThemeControl();
});

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  siteNav.classList.toggle('is-open', !isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    siteNav.classList.remove('is-open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
updateThemeControl();
typeHeadline();
