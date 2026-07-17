export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container header-inner">
      <nav class="nav-links" aria-label="Primary navigation">
        <details class="dropdown">
          <summary>About</summary>
          <div class="dropdown-menu">
            <a href="../about/" target="_self">About Us</a>
            <a href="../history/" target="_self">History</a>
            <a href="../mission/" target="_self">Mission &amp; Vision</a>
            <a href="../facilities/" target="_self">Facilities</a>
          </div>
        </details>
        <details class="dropdown">
          <summary>Downloads</summary>
          <div class="dropdown-menu">
            <a href="../downloads/application-form.pdf" target="_blank" rel="noopener noreferrer">Application Form</a>
            <a href="../downloads/interview-requirements.pdf" target="_blank" rel="noopener noreferrer">Interview Requirements</a>
            <a href="../downloads/fee-schedule.pdf" target="_blank" rel="noopener noreferrer">Fee Schedule</a>
          </div>
        </details>
        <a href="../academics/" target="_self">Academics</a>
        <a href="../contact/" target="_self">Contact</a>
        <a href="../staff/" target="_self">Staff</a>
        <a href="../admissions/" target="_self">Admissions</a>
      </nav>
      <a class="button button--primary" href="../admissions/" target="_self">Enroll Now</a>
    </div>
  `;

  const dropdowns = header.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('summary');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!summary || !menu) {
      return;
    }

    let closeTimer = null;

    const clearCloseTimer = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const openDropdown = () => {
      clearCloseTimer();
      dropdown.setAttribute('open', '');
    };

    const closeDropdown = () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => {
        dropdown.removeAttribute('open');
      }, 260);
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = dropdown.hasAttribute('open');
      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.removeAttribute('open');
        }
      });

      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', closeDropdown);
    menu.addEventListener('mouseenter', openDropdown);
    menu.addEventListener('mouseleave', closeDropdown);
  });

  document.addEventListener('click', (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.removeAttribute('open');
      }
    });
  });

  return header;
}
