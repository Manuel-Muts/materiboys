function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    <div class="network-status" role="status" style="padding: 1.25rem 1.5rem; border: 1px solid rgba(13, 59, 102, 0.16); border-radius: 14px; background: rgba(13, 59, 102, 0.04); color: #0d3b66;">
      <h2 style="margin: 0 0 0.5rem; font-size: 1.1rem;">${escapeHtml(title)}</h2>
      <p style="margin: 0; line-height: 1.6;">${escapeHtml(message)}</p>
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

  const overlay = createOverlayElement();
  overlay.innerHTML = createOfflineOverlayMarkup(options);
  overlay.classList.add('is-visible');
}

export function hideOfflineOverlay() {
  if (typeof document === 'undefined') {
    return;
  }

  const overlay = document.body.querySelector('.network-status-overlay');
  if (!overlay) {
    return;
  }

  overlay.classList.remove('is-visible');
  window.setTimeout(() => {
    overlay.remove();
  }, 220);
}
