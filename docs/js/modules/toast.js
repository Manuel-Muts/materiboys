let toastContainer = null;

function ensureContainer() {
  if (toastContainer && toastContainer.isConnected) {
    return toastContainer;
  }

  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('aria-live', 'polite');
  toastContainer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toastContainer);
  return toastContainer;
}

export function showToast(message, { type = 'info', duration = 3200 } = {}) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const icon = document.createElement('span');
  icon.className = 'toast__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : '•';

  const messageNode = document.createElement('span');
  messageNode.className = 'toast__message';
  messageNode.textContent = message;

  toast.append(icon, messageNode);
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('is-visible');
  }, 10);

  window.setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 220);
  }, duration);
}
