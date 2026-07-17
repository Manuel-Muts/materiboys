export function renderFeatures() {
  const section = document.createElement('section');
  section.className = 'section section--light';
  section.id = 'features';
  section.innerHTML = `
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">Why choose us</p>
        <h2>Learning that prepares boys for life, leadership, and success.</h2>
      </div>
      <div class="feature-grid">
        <article class="card card--academic">
          <div class="card-icon card-icon--academic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11c1.38 0 2.5 1.12 2.5 2.5V18c0 1.38-1.12 2.5-2.5 2.5H6.5C5.12 20.5 4 19.38 4 18V6.5Z" />
              <path d="M6.5 6h11M6.5 10h11" />
            </svg>
          </div>
          <h3>Academic Excellence</h3>
          <p>Focused teaching and consistent guidance help students build strong knowledge and confidence in every subject. <span class="feature-emphasis">Well-equipped science and computer laboratories support hands-on learning.</span> Computer studies are offered at no extra cost.</p>
        </article>
        <article class="card card--values">
          <div class="card-icon card-icon--values" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l7 3v5.5c0 4.8-2.9 9.1-7 10-4.1-.9-7-5.2-7-10V6l7-3Z" />
              <path d="M10 11.5h4M10 15h4" />
            </svg>
          </div>
          <h3>Values and Discipline</h3>
          <p>We nurture respect, responsibility, and self-control so students grow into reliable young men. <span class="feature-emphasis">Well-established leadership and moral support programmes</span> help students develop character and serve their communities.</p>
        </article>
        <article class="card card--wellrounded">
          <div class="card-icon card-icon--wellrounded" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 11a4 4 0 1 1 8 0" />
              <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" />
              <path d="M6 7h.01M12 7h.01M18 7h.01" />
            </svg>
          </div>
          <h3>Well-Rounded Development</h3>
          <p><span class="feature-emphasis">Vibrant co-curricular activities</span> — sports, clubs, music and drama — support holistic growth and discovery. We prepare and take students up to national-level competitions.</p>
        </article>
      </div>
    </div>
  `;
  return section;
}
