export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="container footer-inner">
      <p class="footer-copy">© ${year} All rights reserved. Materi Boys' Senior School</p>
      <div class="footer-links">
        <a href="/terms" target="_self" rel="noopener noreferrer" class="footer-link">Terms of Service |</a>
        <a href="/privacy" target="_self" rel="noopener noreferrer" class="footer-link">Privacy</a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" class="footer-icon footer-icon--facebook" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.409.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.409 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/></svg>
        </a>
        <a href="https://wa.me/254726677666" target="_blank" rel="noreferrer" class="footer-icon footer-icon--whatsapp" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.88 11.88 0 0 0 12 0C5.372 0 0 5.372 0 12c0 2.114.55 4.168 1.595 5.99L0 24l6.273-1.58A11.93 11.93 0 0 0 12 24c6.628 0 12-5.372 12-12 0-3.214-1.255-6.226-3.48-8.52Zm-8.524 17.397c-1.98 0-3.915-.52-5.61-1.51l-.4-.24-3.72.94.99-3.62-.26-.38A9.903 9.903 0 0 1 2.1 12C2.1 6.48 6.48 2.1 12 2.1c2.55 0 4.934.99 6.735 2.79A9.451 9.451 0 0 1 21.9 12c0 5.52-4.48 9.857-9.904 9.877Zm5.467-7.34c-.3-.15-1.78-.88-2.06-.98-.28-.09-.48-.15-.68.15-.2.3-.78.98-.96 1.19-.2.23-.42.26-.78.09-.35-.17-1.45-.53-2.77-1.72-1.03-.91-1.72-2.03-1.92-2.33-.2-.3-.02-.46.15-.61.15-.14.35-.35.53-.53.18-.17.22-.28.33-.47.1-.18.05-.34 0-.49-.05-.15-.68-1.66-.93-2.28-.24-.61-.49-.53-.68-.54h-.58c-.2 0-.53.07-.81.34-.28.27-1.08 1.06-1.08 2.58 0 1.52 1.1 2.99 1.25 3.2.15.22 2.15 3.28 5.22 4.59 3.07 1.31 3.07.87 3.62.82.55-.05 1.78-.72 2.04-1.42.26-.7.26-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z"/></svg>
        </a>
      </div>
    </div>
  `;
  return footer;
}
