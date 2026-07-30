const teacherProfiles = [
  { file: 'Eng & Lit Madam Grace.jpeg', name: 'Madam Grace', role: 'Eng & Lit' },
  { file: 'maths Mr.Mwangi.jpeg', name: 'Mr. Mwangi', role: 'Mathematics' },
  { file: 'Mr. Kwenga Examination Officer.jpeg', name: 'Mr. Kwenga | Physics', role: 'Examination Officer' },
  { file: 'Mr. Wilson Mugambi Curriculum Coordinator.jpeg', name: 'Mr. Wilson Mugambi', role: 'Curriculum Coordinator' },
  { file: 'Mr.John Ireri IT.jpeg', name: 'Mr. John Ireri  ', role: 'IT' },
  { file: 'Mr.Muchai guidance&counselling.jpeg', name: 'Mr. Muchai', role: 'Guidance & Counselling' },
  { file: 'Mr.Murugaara deputyprincipal.jpeg', name: 'Mr. Murugara | Physics', role: 'Deputy Principal' },
  { file: 'Mr.Robert M Njagi seniorprincipal.jpeg', name: 'Mr. Robert M Njagi | Maths', role: 'Senior Principal' },
  { file: 'Mr.Mwaria Biology.jpeg', name: 'Mr. Mwaria', role: 'Biology' }
];

function renderTeacherGallery() {
  return [...teacherProfiles, ...teacherProfiles].map((teacher, index) => {
    const isLoopCopy = index >= teacherProfiles.length;
    const imagePath = `../images/teachers/${encodeURIComponent(teacher.file)}`;
    const hiddenAttribute = isLoopCopy ? ' aria-hidden="true"' : '';
    const imageAlt = isLoopCopy ? '' : teacher.name;
    return `
      <figure class="hero-gallery__item"${hiddenAttribute}>
        <img src="${imagePath}" alt="${imageAlt}" />
        <figcaption>
          <span class="hero-gallery__teacher-name">${teacher.name}</span>
          <span class="hero-gallery__teacher-role">${teacher.role}</span>
        </figcaption>
      </figure>`;
  }).join('');
}

export function renderHero() {
  const section = document.createElement('section');
  section.className = 'hero';
  section.innerHTML = `
    <div class="hero-gallery-heading">
      <p class="eyebrow">The people behind the journey</p>
      <h2>Our Lovely Teachers</h2>
    </div>
    <div class="hero-gallery" aria-label="Matiri Boys teachers gallery">
      <div class="hero-gallery__track">
        ${renderTeacherGallery()}
      </div>
    </div>
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Excellence in character and learning</p>
        <h1>A proud school where boys grow into disciplined, confident leaders.</h1>
        <div class="hero-copy__statement">
          <p>Where academic excellence, strong values, and bright futures are nurtured every day.</p>
        </div>
        <p class="hero-copy__lead">
          At Matiri Boys' Senior School, we combine strong academics, moral values, and a supportive environment to prepare every learner for a brighter future.
        </p>
        <div class="hero-actions">
          <a class="button button--primary" href="../academics/" target="_self">Explore Programs</a>
          <a class="button button--secondary" href="../contact/" target="_self">Book a Visit</a>
        </div>
      </div>
      <div class="hero-card">
        <h3>Why families choose us</h3>
        <p>A school where strong academics are matched by rich extracurricular opportunities, supportive mentors, and a winning spirit on and off the court.</p>
        <div class="image-slider" aria-label="Why families choose us gallery">
          <img src="../images/why family choose us/basketball.jpeg" alt="Students playing basketball" class="image-slider__image active" data-caption="Teamwork and skill on the basketball court" />
          <img src="../images/why family choose us/basketball 2.jpeg" alt="Basketball training session" class="image-slider__image" data-caption="Energetic training and positive sportsmanship" />
          <img src="../images/why family choose us/basketball team.jpeg" alt="Basketball team celebrating" class="image-slider__image" data-caption="Proud BasketBall team building confidence and character" />
          <div class="image-slider__caption" aria-live="polite">Teamwork and skill on the basketball court</div>
        </div>
      </div>
    </div>
  `;
  return section;
}

