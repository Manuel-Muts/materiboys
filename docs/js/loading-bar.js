const loadingBar = document.createElement('div');
loadingBar.className = 'top-loading-bar';
loadingBar.setAttribute('role', 'progressbar');
loadingBar.setAttribute('aria-label', 'Loading page');
loadingBar.setAttribute('aria-valuemin', '0');
loadingBar.setAttribute('aria-valuemax', '100');
loadingBar.setAttribute('aria-valuenow', '0');
loadingBar.innerHTML = '<span class="top-loading-bar__fill"></span>';

document.body.prepend(loadingBar);

const fill = loadingBar.querySelector('.top-loading-bar__fill');
const startedAt = performance.now();
let progressFrame = null;

const updateProgress = (timestamp) => {
  const elapsed = timestamp - startedAt;
  const progress = Math.min(90, 90 * (1 - Math.exp(-elapsed / 1800)));
  fill.style.width = `${progress}%`;
  loadingBar.setAttribute('aria-valuenow', String(Math.round(progress)));
  progressFrame = window.requestAnimationFrame(updateProgress);
};

const finishLoading = () => {
  if (progressFrame) {
    window.cancelAnimationFrame(progressFrame);
  }

  fill.style.width = '100%';
  loadingBar.setAttribute('aria-valuenow', '100');
  loadingBar.classList.add('is-complete');
  window.setTimeout(() => loadingBar.remove(), 700);
};

progressFrame = window.requestAnimationFrame(updateProgress);

if (document.readyState === 'complete') {
  finishLoading();
} else {
  window.addEventListener('load', finishLoading, { once: true });
}
