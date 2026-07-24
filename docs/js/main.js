import { renderHeader } from './modules/header.js';
import { renderHero } from './modules/hero.js';
import { renderFeatures } from './modules/features.js';
import { renderAboutSection } from './modules/about.js';
import { renderCTA } from './modules/cta.js';
import { renderFooter } from './modules/footer.js';
import { initImageSlider } from './slider.js';
import { initRouter } from './router.js';
import { initChatAssistant } from './chat-assistant.js';
import { createOfflineNoticeMarkup, isBrowserOnline } from './modules/network-status.js';

const app = document.getElementById('app');
let deferredPrompt = null;
let installBanner = null;
let installBannerTimer = null;
let installBannerDismissedUntil = Number(window.localStorage.getItem('Matiri-install-dismiss-until') || 0);
let cookieBanner = null;

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
  window.localStorage.setItem('Matiri-install-dismiss-until', String(Date.now() + 1000 * 60 * 60 * 24 * 3));
}

function showInstallBanner() {
  if (!canShowInstallBanner() || installBanner || Date.now() < installBannerDismissedUntil) {
    return;
  }

  installBanner = document.createElement('div');
  installBanner.className = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="pwa-install-banner__content">
      <strong>Install Matiri Boys</strong>
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

function showCookieBanner() {
  if (cookieBanner) {
    return;
  }

  const consent = window.localStorage.getItem('Matiri-cookie-consent');
  if (consent) {
    return;
  }

  cookieBanner = document.createElement('div');
  cookieBanner.className = 'cookie-banner';
  cookieBanner.innerHTML = `
    <div class="cookie-banner__text">
      We use cookies to improve your experience on this site and remember your preferences.
    </div>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-banner__accept">Accept</button>
      <button type="button" class="cookie-banner__dismiss">Decline</button>
    </div>
  `;

  const acceptButton = cookieBanner.querySelector('.cookie-banner__accept');
  const declineButton = cookieBanner.querySelector('.cookie-banner__dismiss');

  const dismissBanner = (choice) => {
    window.localStorage.setItem('Matiri-cookie-consent', choice);
    cookieBanner.remove();
    cookieBanner = null;
  };

  acceptButton.addEventListener('click', () => dismissBanner('accepted'));
  declineButton.addEventListener('click', () => dismissBanner('declined'));

  document.body.appendChild(cookieBanner);
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

function showOfflineNoticeIfNeeded() {
  const existingNotice = document.querySelector('.network-status');
  if (!existingNotice && !isBrowserOnline()) {
    const notice = document.createElement('div');
    notice.className = 'network-status';
    notice.innerHTML = createOfflineNoticeMarkup({
      title: 'Connection unavailable',
      message: 'Some content may be unavailable while the connection is offline. Please check your network and try again.'
    });
    document.body.prepend(notice);
  }
}

function initRevealOnScroll() {
  const targets = Array.from(document.querySelectorAll('.section, .hero-copy, .hero-card, .card, .cta-card, .location-card, .admissions-copy'));

  if (!targets.length) {
    return;
  }

  targets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${Math.min(index * 70, 260)}ms`;
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('reveal-visible');
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach((element) => observer.observe(element));
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
  initRevealOnScroll();
}

window.renderHomePage = renderHomePage;

function getHashTargetId() {
  const hash = window.location.hash.replace(/^#/, '').trim();
  if (!hash || hash.startsWith('/')) {
    return '';
  }
  return hash;
}

function scrollToHashTarget(behavior = 'smooth') {
  const targetId = getHashTargetId();
  if (!targetId) {
    return false;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return false;
  }

  const offset = 94;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, left: 0, behavior });
  return true;
}

function resetPagePosition() {
  if (scrollToHashTarget('auto')) {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

if (app) {
  renderHomePage();
  initRouter();
  window.requestAnimationFrame(() => {
    scrollToHashTarget('smooth');
  });
}

registerInstallExperience();
showCookieBanner();
showOfflineNoticeIfNeeded();
initChatAssistant();
window.addEventListener('load', resetPagePosition);
window.addEventListener('online', () => {
  const notice = document.querySelector('.network-status');
  if (notice) {
    notice.remove();
  }
});
window.addEventListener('offline', () => {
  showOfflineNoticeIfNeeded();
});
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) {
    return;
  }

  window.location.reload();
});
requestAnimationFrame(resetPagePosition);

