export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-meta">
        <p class="footer-copy">© ${year} All rights reserved. Materi Boys' Senior School</p>
        <p class="footer-credit">Designed by <span>Muts Tech</span></p>
      </div>
      <div class="footer-links">
        <a href="../terms/" target="_self" rel="noopener noreferrer" class="footer-link">Terms of Service |</a>
        <a href="../privacy/" target="_self" rel="noopener noreferrer" class="footer-link">Privacy</a>
      </div>
    </div>
  `;
  return footer;
}

