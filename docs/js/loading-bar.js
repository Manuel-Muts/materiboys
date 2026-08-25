const loadingBar = document.createElement('div');
loadingBar.className = 'page-loading-bar';
loadingBar.setAttribute('role', 'progressbar');
loadingBar.setAttribute('aria-label', 'Loading page');
loadingBar.setAttribute('aria-valuemin', '0');
loadingBar.setAttribute('aria-valuemax', '100');
loadingBar.setAttribute('aria-valuenow', '25');
loadingBar.innerHTML = '<span class="page-loading-bar__fill"></span>';

document.body.prepend(loadingBar);

const finishLoading = () => {
  const fill = loadingBar.querySelector('.page-loading-bar__fill');
  fill.style.width = '100%';
  loadingBar.setAttribute('aria-valuenow', '100');
  loadingBar.classList.add('is-complete');
  window.setTimeout(() => loadingBar.remove(), 700);
};

if (document.readyState === 'complete') {
  finishLoading();
} else {
  window.addEventListener('load', finishLoading, { once: true });
}
