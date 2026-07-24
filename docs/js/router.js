import { renderLegalPage } from './modules/legal.js';
import { renderHistoryPage } from './modules/history.js';
import { renderNewsPage } from './modules/news.js';

function renderHomeRoute() {
  setHomeShellVisibility(true);

  if (typeof window.renderHomePage === 'function') {
    window.renderHomePage();
    return;
  }

  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '';
  }
}

const routes = {
  '/': { title: 'Matiri Boys\' Senior School', targetId: 'top' },
  '/about': { title: 'About | Matiri Boys\' Senior School', targetId: 'about-us' },
  '/mission': { title: 'Mission & Vision | Matiri Boys\' Senior School', targetId: 'about-us' },
  '/facilities': { title: 'Facilities | Matiri Boys\' Senior School', targetId: 'about-us' },
  '/academics': { title: 'Academics | Matiri Boys\' Senior School', targetId: 'features' },
  '/admissions': { title: 'Admissions | Matiri Boys\' Senior School', targetId: 'top' },
  '/news': { title: 'Latest News and Updates | Matiri Boys\' Senior School', targetId: 'news-page' },
  '/contact': { title: 'Contact | Matiri Boys\' Senior School', targetId: 'contact' },
  '/history': { title: 'History | Matiri Boys\' Senior School', targetId: 'legal-page' },
  '/terms': { title: 'Terms of Service | Matiri Boys\' Senior School', targetId: 'legal-page' },
  '/privacy': { title: 'Privacy Policy | Matiri Boys\' Senior School', targetId: 'legal-page' }
};

function normalizePath(path = window.location.hash) {
  let cleanPath = path || '#/';
  if (cleanPath.startsWith('#')) {
    cleanPath = cleanPath.slice(1);
  }

  cleanPath = cleanPath.split('?')[0].split('#')[0] || '/';

  if (!cleanPath || cleanPath === '/' || cleanPath === '/index.html') {
    return '/';
  }

  if (cleanPath.endsWith('/')) {
    return cleanPath.slice(0, -1) || '/';
  }

  return cleanPath.replace(/\/index\.html$/, '/');
}

function getRoute(pathname) {
  return routes[normalizePath(pathname)] || routes['/'];
}

function getHashTargetId(hash = window.location.hash) {
  const fragment = (hash || '').replace(/^#/, '').trim();

  if (!fragment || fragment.startsWith('/')) {
    return '';
  }

  return fragment;
}

function setHomeShellVisibility(isVisible) {
  const homeTop = document.querySelector('.home-top');
  if (homeTop) {
    homeTop.hidden = !isVisible;
  }
}

function renderLegalRoute(type) {
  const app = document.getElementById('app');
  if (!app) return;

  setHomeShellVisibility(false);
  app.innerHTML = '';

  const section = renderLegalPage(type);
  section.id = 'legal-page';
  app.appendChild(section);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function renderHistoryRoute() {
  const app = document.getElementById('app');
  if (!app) return;

  setHomeShellVisibility(false);
  app.innerHTML = '';

  const section = renderHistoryPage();
  section.id = 'legal-page';
  app.appendChild(section);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function renderNewsRoute() {
  const app = document.getElementById('app');
  if (!app) return;

  setHomeShellVisibility(false);
  app.innerHTML = '';

  renderNewsPage().then((section) => {
    if (section) {
      section.id = 'news-page';
      app.appendChild(section);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }).catch((error) => {
    console.error('Failed to render news page:', error);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  const offset = 96;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, left: 0, behavior: 'smooth' });
}

export function navigate(path) {
  const routePath = normalizePath(path);
  const route = routes[routePath] || routes['/'];

  window.location.hash = `#${routePath}`;
  document.title = route.title;
}

export function initRouter() {
  const handleLinkClick = (event) => {
    const anchor = event.target.closest('a');

    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute('href');

    if (!href || !href.startsWith('#/') || href.startsWith('http') || href.startsWith('mailto:') || href.endsWith('.html')) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  document.addEventListener('click', handleLinkClick);
  window.addEventListener('hashchange', () => {
    const hashTargetId = getHashTargetId(window.location.hash);

    if (hashTargetId) {
      renderHomeRoute();
      window.requestAnimationFrame(() => scrollToTarget(hashTargetId));
      return;
    }

    const route = getRoute(window.location.hash);
    document.title = route.title;

    const routePath = normalizePath(window.location.hash);
    if (routePath === '/terms' || routePath === '/privacy' || routePath === '/history' || routePath === '/news') {
      if (routePath === '/history') {
        renderHistoryRoute();
      } else if (routePath === '/news') {
        renderNewsRoute();
      } else {
        renderLegalRoute(routePath === '/privacy' ? 'privacy' : 'terms');
      }
      return;
    }

    renderHomeRoute();
    scrollToTarget(route.targetId);
  });

  const hashTargetId = getHashTargetId(window.location.hash);

  if (hashTargetId) {
    renderHomeRoute();
    window.requestAnimationFrame(() => scrollToTarget(hashTargetId));
    return;
  }

  const initialRoute = getRoute(window.location.hash);
  document.title = initialRoute.title;

  const routePath = normalizePath(window.location.hash);
  if (routePath === '/terms' || routePath === '/privacy' || routePath === '/history' || routePath === '/news') {
    if (routePath === '/history') {
      renderHistoryRoute();
    } else if (routePath === '/news') {
      renderNewsRoute();
    } else {
      renderLegalRoute(routePath === '/privacy' ? 'privacy' : 'terms');
    }
    return;
  }

  renderHomeRoute();
  scrollToTarget(initialRoute.targetId);
}

