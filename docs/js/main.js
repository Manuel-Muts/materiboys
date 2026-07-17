import { renderHeader } from './modules/header.js';
import { renderHero } from './modules/hero.js';
import { renderFeatures } from './modules/features.js';
import { renderAboutSection } from './modules/about.js';
import { renderCTA } from './modules/cta.js';
import { renderFooter } from './modules/footer.js';
import { initImageSlider } from './slider.js';
import { initRouter } from './router.js';

const app = document.getElementById('app');

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

window.addEventListener('load', resetPagePosition);
requestAnimationFrame(resetPagePosition);
