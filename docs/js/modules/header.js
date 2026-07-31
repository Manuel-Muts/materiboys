const DOWNLOAD_MENU_ITEMS = [
  { key: 'admissions', label: 'Admission form', href: '../downloads/application-form.html' },
  { key: 'interview-requirements', label: 'Interview requirements', href: '../downloads/interview-requirements.html' },
  { key: 'fee-schedule', label: 'Fee schedule', href: '../downloads/fee-schedule.html' },
  { key: 'prospectus', label: 'Prospectus', href: '../downloads/prospectus.html' }
];

function readStoredDocuments() {
  try {
    return JSON.parse(localStorage.getItem('school-download-docs') || '{}');
  } catch (error) {
    return {};
  }
}

const SETTINGS_STORAGE_KEY = 'school-site-settings';

const CONTACT_HIGHLIGHTS = [
  { label: 'Email', value: 'matirischool@gmail.com', href: 'mailto:matirischool@gmail.com' },
  { label: 'Call', value: '+254 726 677 666', href: 'tel:+254726677666' },
  { label: 'Admissions', value: 'Admissions status pending' },
  { label: 'Motto', value: 'READ & LEAD' },
  { label: '📍', value: 'Near St. Orsola Hospital, Chiakariga' }
];

function buildDownloadsMarkup() {
  const documents = readStoredDocuments();

  return DOWNLOAD_MENU_ITEMS.map((item) => {
    const storedDoc = documents[item.key];
    const title = storedDoc?.title || item.label;
    const href = storedDoc?.url
      ? `${item.href}?title=${encodeURIComponent(title)}&url=${encodeURIComponent(storedDoc.url)}`
      : item.href;

    return `<a href="${href}" target="_self">${title}</a>`;
  }).join('');
}

function readStoredSiteSettings() {
  try {
    return JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function getAdmissionsStatusLabel() {
  const settings = readStoredSiteSettings();
  const hasStatus = Object.prototype.hasOwnProperty.call(settings, 'admissionsOpen');

  if (!hasStatus) {
    return 'Admissions status pending';
  }

  return settings.admissionsOpen !== false ? 'Admissions open' : 'Admissions closed';
}

function renderContactStrip() {
  const items = [...CONTACT_HIGHLIGHTS, ...CONTACT_HIGHLIGHTS];
  const admissionsLabel = getAdmissionsStatusLabel();

  const normalizedItems = items.map((item) => (item.label === 'Admissions' ? { ...item, value: admissionsLabel } : item));

  return normalizedItems.map((item, index) => {
    const isLoopCopy = index >= normalizedItems.length / 2;
    const hiddenAttribute = isLoopCopy ? ' aria-hidden="true"' : '';
    const labelMarkup = item.label === '📍'
      ? '<span class="site-header__contact-label" aria-label="Location"><span aria-hidden="true">📍</span></span>'
      : `<span class="site-header__contact-label">${item.label}</span>`;
    const content = item.href
      ? `<a href="${item.href}">${item.value}</a>`
      : `<span>${item.value}</span>`;

    return `
      <div class="site-header__contact-item"${hiddenAttribute}>
        ${labelMarkup}
        ${content}
      </div>`;
  }).join('');
}

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__contact-strip" aria-label="School contact information">
      <div class="site-header__contact-track">
        ${renderContactStrip()}
      </div>
    </div>
    <div class="container header-inner">
      <nav class="nav-links" aria-label="Primary navigation">
        <details class="dropdown">
          <summary>About</summary>
          <div class="dropdown-menu">
            <a href="#about-us" target="_self">About Us</a>
            <a href="../history/" target="_self">History</a>
            <a href="#mission" target="_self">Mission &amp; Vision</a>
            <a href="../facilities/" target="_self">Facilities</a>
          </div>
        </details>
        <details class="dropdown">
          <summary>Downloads</summary>
          <div class="dropdown-menu">
            ${buildDownloadsMarkup()}
          </div>
        </details>
        <a href="#/news" target="_self"> News & Updates</a>
        <details class="dropdown">
          <summary>Vacancies</summary>
          <div class="dropdown-menu">
            <a href="../vacancies/?type=teachers" target="_self">Teachers</a>
            <a href="../vacancies/?type=support-staff" target="_self">Support staff</a>
          </div>
        </details>
        <a href="../academics/" target="_self">Academics</a>
        <a href="../contact/" target="_self">Contact</a>
        <a href="../staff/" target="_self">Staff</a>
        <a href="../teachers/" target="_self">Teachers Gallery</a>
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

  const contactTrack = header.querySelector('.site-header__contact-track');
  if (contactTrack) {
    const updateContactStrip = () => {
      contactTrack.innerHTML = renderContactStrip();
    };

    updateContactStrip();
    window.addEventListener('storage', (event) => {
      if (event.key === SETTINGS_STORAGE_KEY) {
        updateContactStrip();
      }
    });
  }

  const dropdowns = header.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('summary');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!summary || !menu) {
      return;
    }

    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    let hoverTimer = null;

    const clearHoverTimer = () => {
      if (hoverTimer) {
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };

    const openDropdown = () => {
      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.removeAttribute('open');
          other.classList.remove('is-hovered');
        }
      });
      clearHoverTimer();
      dropdown.setAttribute('open', '');
      dropdown.classList.add('is-hovered');
    };

    const closeDropdown = () => {
      clearHoverTimer();
      dropdown.classList.remove('is-hovered');
      dropdown.removeAttribute('open');
    };

    const queueCloseDropdown = () => {
      clearHoverTimer();
      hoverTimer = window.setTimeout(() => {
        closeDropdown();
      }, 140);
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
          dropdown.removeAttribute('open');
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
          dropdown.setAttribute('open', '');
        }
      });

      summary.addEventListener('touchend', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = dropdown.hasAttribute('open');
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.removeAttribute('open');
          }
        });
        if (isOpen) {
          dropdown.removeAttribute('open');
        } else {
          openDropdown();
        }
      }, { passive: false });
    }

    if (!isTouchDevice) {
      dropdown.addEventListener('mouseenter', openDropdown);
      dropdown.addEventListener('mouseleave', queueCloseDropdown);
      menu.addEventListener('mouseenter', openDropdown);
      menu.addEventListener('mouseleave', queueCloseDropdown);
      dropdown.addEventListener('focusin', openDropdown);
      dropdown.addEventListener('focusout', (event) => {
        if (!dropdown.contains(event.relatedTarget)) {
          queueCloseDropdown();
        }
      });
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
