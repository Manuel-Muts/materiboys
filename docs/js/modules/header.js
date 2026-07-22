export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container header-inner">
      <nav class="nav-links" aria-label="Primary navigation">
        <details class="dropdown">
          <summary>About</summary>
          <div class="dropdown-menu">
            <a href="../home/#about-us" target="_self">About Us</a>
            <a href="../history/" target="_self">History</a>
            <a href="../home/#mission" target="_self">Mission &amp; Vision</a>
            <a href="../facilities/" target="_self">Facilities</a>
          </div>
        </details>
        <details class="dropdown">
          <summary>Downloads</summary>
          <div class="dropdown-menu">
            <a href="../downloads/admission-form.pdf" target="_blank" rel="noopener noreferrer">Admission Form</a>
            <a href="../downloads/interview-requirements.pdf" target="_blank" rel="noopener noreferrer">Interview Requirements</a>
            <a href="../downloads/fee-schedule.pdf" target="_blank" rel="noopener noreferrer">Fee Schedule</a>
          </div>
        </details>
        <a href="../academics/" target="_self">Academics</a>
        <a href="../contact/" target="_self">Contact</a>
        <a href="../staff/" target="_self">Staff</a>
        <a href="../alumni/" target="_self">Alumni</a>
        <a href="../admissions/" target="_self">Admissions</a>
      </nav>
      <a class="button button--primary" href="../admissions/" target="_self">Enroll Now</a>
      <button class="nav-toggle" aria-expanded="false" aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
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
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const clearCloseTimer = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const openDropdown = () => {
      clearCloseTimer();
      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.removeAttribute('open');
        }
      });
      dropdown.setAttribute('open', '');
    };

    const closeDropdown = () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => {
        dropdown.removeAttribute('open');
      }, 180);
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isTouchDevice) {
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
        return;
      }

      openDropdown();
    });

    if (isTouchDevice) {
      menu.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('a')) {
          clearCloseTimer();
          dropdown.removeAttribute('open');
        }
      });

      dropdown.addEventListener('touchstart', () => {
        clearCloseTimer();
      }, { passive: true });
    }

    if (!isTouchDevice) {
      dropdown.addEventListener('mouseenter', openDropdown);
      dropdown.addEventListener('mouseleave', closeDropdown);
      menu.addEventListener('mouseenter', openDropdown);
      menu.addEventListener('mouseleave', closeDropdown);
    }
  });

  // Bind a single document-level click handler once to avoid duplicates
  if (!document._headerDropdownClickBound) {
    document._headerDropdownClickBound = true;
    document.addEventListener('click', (event) => {
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          dropdown.removeAttribute('open');
        }
      });
    });
  }

  const toggleButton = header.querySelector('.nav-toggle');
  const navLinks = header.querySelector('.nav-links');

  if (toggleButton && navLinks) {
    toggleButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement) {
        if (window.matchMedia('(max-width: 720px)').matches) {
          navLinks.classList.remove('open');
          toggleButton.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  return header;
}
