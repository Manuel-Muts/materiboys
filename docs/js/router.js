import { renderLegalPage } from './modules/legal.js';
import { renderHistoryPage } from './modules/history.js';

function renderHomeRoute() {
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
  '/': { title: 'Materi Boys\' Senior School', targetId: 'top' },
  '/about': { title: 'About | Materi Boys\' Senior School', targetId: 'about-us' },
  '/mission': { title: 'Mission & Vision | Materi Boys\' Senior School', targetId: 'about-us' },
  '/facilities': { title: 'Facilities | Materi Boys\' Senior School', targetId: 'about-us' },
  '/academics': { title: 'Academics | Materi Boys\' Senior School', targetId: 'features' },
  '/admissions': { title: 'Admissions | Materi Boys\' Senior School', targetId: 'top' },
  '/contact': { title: 'Contact | Materi Boys\' Senior School', targetId: 'contact' },
  '/history': { title: 'History | Materi Boys\' Senior School', targetId: 'legal-page' },
  '/terms': { title: 'Terms of Service | Materi Boys\' Senior School', targetId: 'legal-page' },
  '/privacy': { title: 'Privacy Policy | Materi Boys\' Senior School', targetId: 'legal-page' }
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

function renderLegalRoute(type) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  const section = renderLegalPage(type);
  section.id = 'legal-page';
  app.appendChild(section);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function renderHistoryRoute() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  const section = renderHistoryPage();
  section.id = 'legal-page';
  app.appendChild(section);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function navigate(path) {
  const routePath = normalizePath(path);
  const route = routes[routePath] || routes['/'];

  window.location.hash = `#${routePath}`;
  document.title = route.title;

  if (routePath === '/terms' || routePath === '/privacy' || routePath === '/history') {
    if (routePath === '/history') {
      renderHistoryRoute();
    } else {
      renderLegalRoute(routePath === '/privacy' ? 'privacy' : 'terms');
    }
    return;
  }

  renderHomeRoute();
  window.requestAnimationFrame(() => scrollToTarget(route.targetId));
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
    const route = getRoute(window.location.hash);
    document.title = route.title;

    const routePath = normalizePath(window.location.hash);
    if (routePath === '/terms' || routePath === '/privacy' || routePath === '/history') {
      if (routePath === '/history') {
        renderHistoryRoute();
      } else {
        renderLegalRoute(routePath === '/privacy' ? 'privacy' : 'terms');
      }
      return;
    }

    renderHomeRoute();
    scrollToTarget(route.targetId);
  });

  const initialRoute = getRoute(window.location.hash);
  document.title = initialRoute.title;

  const routePath = normalizePath(window.location.hash);
  if (routePath === '/terms' || routePath === '/privacy' || routePath === '/history') {
    if (routePath === '/history') {
      renderHistoryRoute();
    } else {
      renderLegalRoute(routePath === '/privacy' ? 'privacy' : 'terms');
    }
    return;
  }

  renderHomeRoute();
  scrollToTarget(initialRoute.targetId);
}
