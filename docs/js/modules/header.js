export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container header-inner">
      <nav class="nav-links" aria-label="Primary navigation">
        <details class="dropdown">
          <summary>About</summary>
          <div class="dropdown-menu">
            <a href="#/about">About Us</a>
            <a href="/history">History</a>
            <a href="#/mission">Mission &amp; Vision</a>
            <a href="#/facilities">Facilities</a>
          </div>
        </details>
        <details class="dropdown">
          <summary>Downloads</summary>
          <div class="dropdown-menu">
            <a href="/docs/downloads/application-form.pdf" target="_blank">Application Form</a>
            <a href="/docs/downloads/interview-requirements.pdf" target="_blank">Interview Requirements</a>
            <a href="/docs/downloads/fee-schedule.pdf" target="_blank">Fee Schedule</a>
            <a href="/docs/downloads/prospectus.pdf" target="_blank">School Prospectus</a>
          </div>
        </details>
        <a href="/docs/academics" target="_self">Academics</a>
        <a href="/contact" target="_self">Contact</a>
        <a href="/docs/staff" target="_self">Staff</a>
        <a href="/admissions" target="_self">Admissions</a>
      </nav>
      <a class="button button--primary" href="/admissions" target="_self">Enroll Now</a>
    </div>
  `;

  const dropdowns = header.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) {
      return;
    }

    let closeTimer;

    const openDropdown = () => {
      clearTimeout(closeTimer);
      dropdown.setAttribute('open', '');
    };

    const closeDropdown = () => {
      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        dropdown.removeAttribute('open');
      }, 220);
    };

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('focusin', openDropdown);
    dropdown.addEventListener('click', openDropdown);

    dropdown.addEventListener('mouseleave', (event) => {
      const relatedTarget = event.relatedTarget;
      if (relatedTarget && dropdown.contains(relatedTarget)) {
        return;
      }
      closeDropdown();
    });

    menu.addEventListener('mouseenter', openDropdown);
    menu.addEventListener('mouseleave', (event) => {
      const relatedTarget = event.relatedTarget;
      if (relatedTarget && dropdown.contains(relatedTarget)) {
        return;
      }
      closeDropdown();
    });

    menu.addEventListener('focusin', openDropdown);
    menu.addEventListener('focusout', (event) => {
      const nextFocus = event.relatedTarget;
      if (nextFocus && dropdown.contains(nextFocus)) {
        return;
      }
      closeDropdown();
    });
  });

  return header;
}
