function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
