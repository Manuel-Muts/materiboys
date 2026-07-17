import { renderHeader } from './modules/header.js';
import { renderHero } from './modules/hero.js';
import { renderFeatures } from './modules/features.js';
import { renderAboutSection } from './modules/about.js';
import { renderCTA } from './modules/cta.js';
import { renderFooter } from './modules/footer.js';
import { initImageSlider } from './slider.js';
import { initRouter } from './router.js';

const app = document.getElementById('app');
let deferredPrompt = null;
let installBanner = null;
let installBannerTimer = null;
let installBannerDismissedUntil = Number(window.localStorage.getItem('materi-install-dismiss-until') || 0);

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function canShowInstallBanner() {
  return !isStandaloneMode() && window.isSecureContext && window.location.protocol === 'https:';
}

function dismissInstallBanner() {
  if (!installBanner) {
    return;
  }

  installBanner.remove();
  installBanner = null;
  window.localStorage.setItem('materi-install-dismiss-until', String(Date.now() + 1000 * 60 * 60 * 24 * 3));
}

function showInstallBanner() {
  if (!canShowInstallBanner() || installBanner || Date.now() < installBannerDismissedUntil) {
    return;
  }

  installBanner = document.createElement('div');
  installBanner.className = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="pwa-install-banner__content">
      <strong>Install Materi Boys</strong>
      <p>Get a quick app-style shortcut for admissions, contact details, and school updates.</p>
    </div>
    <div class="pwa-install-banner__actions">
      <button class="pwa-install-banner__button pwa-install-banner__button--primary" type="button">Install now</button>
      <button class="pwa-install-banner__button" type="button">Not now</button>
    </div>
  `;

  const installButton = installBanner.querySelector('.pwa-install-banner__button--primary');
  const dismissButton = installBanner.querySelector('.pwa-install-banner__button:not(.pwa-install-banner__button--primary)');

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      installButton.textContent = 'Install unavailable yet';
      installButton.classList.add('pwa-install-banner__button--fallback');
      window.setTimeout(() => {
        if (installBanner) {
          dismissInstallBanner();
        }
      }, 2600);
      return;
    }

    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        dismissInstallBanner();
      }
    } catch (error) {
      console.warn('Install prompt failed', error);
      installButton.textContent = 'Try again in Chrome';
    }
    deferredPrompt = null;
  });

  dismissButton.addEventListener('click', dismissInstallBanner);
  document.body.appendChild(installBanner);
}

function registerInstallExperience() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    dismissInstallBanner();
  });

  window.addEventListener('click', () => {
    if (!installBannerTimer) {
      installBannerTimer = window.setTimeout(showInstallBanner, 1400);
    }
  }, { once: true });

  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      const swUrl = new URL('../sw.js', window.location.href);
      navigator.serviceWorker.register(swUrl.href, { scope: './' }).then(() => {
        if (!installBannerTimer) {
          installBannerTimer = window.setTimeout(showInstallBanner, 4000);
        }
      }).catch((error) => {
        console.warn('Service worker registration failed', error);
      });
    }

    if (!installBannerTimer) {
      installBannerTimer = window.setTimeout(showInstallBanner, 8000);
    }
  });
}

export function renderHomePage() {
  if (!app) {
    return;
  }

  app.innerHTML = '';
  app.appendChild(renderHeader());
  app.appendChild(renderHero());
  app.appendChild(renderAboutSection());
  app.appendChild(renderFeatures());
  app.appendChild(renderCTA());
  app.appendChild(renderFooter());
  initImageSlider();
}

window.renderHomePage = renderHomePage;

function resetPagePosition() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

if (app) {
  renderHomePage();
  initRouter();
}

registerInstallExperience();
window.addEventListener('load', resetPagePosition);
requestAnimationFrame(resetPagePosition);
