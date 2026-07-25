function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureNetworkStatusListeners() {
  if (typeof window === 'undefined' || window.__networkStatusListenersAttached) {
    return;
  }

  window.addEventListener('online', () => {
    hideOfflineOverlay();
  });

  window.addEventListener('offline', () => {
    showOfflineOverlay({
      title: 'Connection unavailable',
      message: 'Your connection is offline. Some sections may not update until the network is restored.'
    });
  });

  window.__networkStatusListenersAttached = true;
}

function createOverlayElement() {
  const existing = document.body.querySelector('.network-status-overlay');
  if (existing) {
    return existing;
  }

  const overlay = document.createElement('div');
  overlay.className = 'network-status-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'assertive');
  document.body.appendChild(overlay);
  return overlay;
}

export function isBrowserOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function createOfflineNoticeMarkup({
  title = 'Connection issue',
  message = 'We could not load this content right now. Please check your internet connection and try again.'
} = {}) {
  return `
    <div class="network-status" role="status">
      <div class="network-status__icon">⚠️</div>
      <div class="network-status__content">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

export function createOfflineOverlayMarkup({
  title = 'Connection unavailable',
  message = 'Your connection is offline. Some sections may not update until the network is restored.'
} = {}) {
  return `
    <div class="network-status-overlay__panel">
      <div class="network-status-overlay__indicator">⚠️</div>
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

export function showOfflineOverlay(options = {}) {
  if (typeof document === 'undefined') {
    return;
  }

  ensureNetworkStatusListeners();

  const overlay = createOverlayElement();
  overlay.innerHTML = createOfflineOverlayMarkup(options);
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-visible');
  document.body.classList.add('has-network-status-overlay');

  window.requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });
}

export function hideOfflineOverlay() {
  if (typeof document === 'undefined') {
    return;
  }

  const overlay = document.body.querySelector('.network-status-overlay');
  if (!overlay) {
    document.body.classList.remove('has-network-status-overlay');
    return;
  }

  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('has-network-status-overlay');
  window.setTimeout(() => {
    overlay.remove();
  }, 220);
}

export function syncNetworkStatusUI(options = {}) {
  ensureNetworkStatusListeners();

  if (!isBrowserOnline()) {
    showOfflineOverlay(options);
    return;
  }

  hideOfflineOverlay();
}
