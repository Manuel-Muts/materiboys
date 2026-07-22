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
    <div class="hero-gallery" aria-label="Materi Boys teachers gallery">
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
          At Materi Boys' Senior School, we combine strong academics, moral values, and a supportive environment to prepare every learner for a brighter future.
        </p>
        <div class="hero-actions">
          <a class="button button--primary" href="../academics/" target="_self">Explore Programs</a>
          <a class="button button--secondary" href="../contact/" target="_self">Book a Visit</a>
        </div>
      </div>
      <div class="hero-card">
        <h3>Why families choose us</h3>
        <p>Safe learning spaces, dedicated teachers, and a culture of excellence that inspires success.</p>
        <div class="image-slider" aria-label="School gallery">
          <img src="../images/IMG_3728.JPG" alt="Bright school moments and warm smiles" class="image-slider__image active" data-caption="Bright school moments and warm smiles" />
          <img src="../images/IMG_3565.JPG" alt="Energetic learning in a lively classroom" class="image-slider__image" data-caption="Lively Moments" />
          <img src="../images/IMG_3567.JPG" alt="Students enjoying School life together" class="image-slider__image" data-caption="Students enjoying School life together" />
          <img src="../images/IMG_3569.JPG" alt="Fun moments during school activities" class="image-slider__image" data-caption="Fun moments during school activities" />
          <img src="../images/IMG_3636.JPG" alt="Focused learning and positive teamwork" class="image-slider__image" data-caption="Outdoor Activities" />
          <img src="../images/IMG_4271.JPG" alt="A proud school community in action" class="image-slider__image" data-caption="A proud school community" />
          <img src="../images/IMG_4275.JPG" alt="Warm friendships and joyful school spirit" class="image-slider__image" data-caption="Warm friendships and joyful school spirit" />
          <img src="../images/IMG_4278.JPG" alt="Confident learners sharing memorable moments" class="image-slider__image" data-caption="Confident learners sharing memorable moments" />
          <img src="../images/IMG_4304.JPG" alt="A vibrant campus full of life and growth" class="image-slider__image" data-caption="A vibrant School full of life" />
          <div class="image-slider__caption" aria-live="polite">Bright school moments and warm smiles</div>
        </div>
      </div>
    </div>
  `;
  return section;
}
