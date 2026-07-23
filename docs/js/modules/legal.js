function createLegalContent(type) {
  if (type === 'privacy') {
    return `
      <section class="legal-page">
        <div class="container legal-card">
          <p class="eyebrow">Privacy Policy</p>
          <h1>Your privacy matters to us.</h1>
          <p class="legal-intro">At Matiri Boys' Senior School, we are committed to protecting the personal information of parents, students, and visitors in a respectful and transparent way.</p>
          <div class="legal-list">
            <article class="legal-section">
              <h2>Information we collect</h2>
              <p>We may collect names, contact details, student information, and communication records when you enquire about admissions, visit the school, or contact us through our website.</p>
            </article>
            <article class="legal-section">
              <h2>How we use it</h2>
              <p>Information is used to respond to enquiries, manage admissions, provide school updates, and improve our services. We do not use personal data for unrelated purposes.</p>
            </article>
            <article class="legal-section">
              <h2>Data protection</h2>
              <p>We keep personal data secure and only share it with authorized school staff or approved service providers where necessary for school operations.</p>
            </article>
            <article class="legal-section">
              <h2>Contact</h2>
              <p>If you have questions about your information or this policy, please contact the school through the admissions section of this website.</p>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  return `
    <section class="legal-page">
      <div class="container legal-card">
        <p class="eyebrow">Terms of Service</p>
        <h1>Terms of Service</h1>
        <p class="legal-intro">These terms outline how visitors may use the Matiri Boys' Senior School website and the expectations for respectful and responsible engagement with our online content.</p>
        <div class="legal-list">
          <article class="legal-section">
            <h2>Use of the website</h2>
            <p>You may browse this website for information about the school, admissions, and available programs. Any use of the site should be for lawful, school-related purposes.</p>
          </article>
          <article class="legal-section">
            <h2>Content and information</h2>
            <p>All school information, images, and written content are provided for general informational purposes. We may update content from time to time to keep it accurate and relevant.</p>
          </article>
          <article class="legal-section">
            <h2>Responsibility of visitors</h2>
            <p>Visitors are expected to use the website respectfully and avoid submitting harmful, misleading, or inappropriate content through contact forms or communications.</p>
          </article>
          <article class="legal-section">
            <h2>Contact</h2>
            <p>If you have concerns about these terms or wish to contact the school, please use the admissions or contact information provided on this website.</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

export function renderLegalPage(type) {
  const section = document.createElement('section');
  section.className = 'legal-page-shell';
  section.innerHTML = createLegalContent(type);
  return section;
}

