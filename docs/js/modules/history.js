function createHistoryContent() {
  return `
    <div class="container legal-card">
      <div class="standalone-topbar">
        <button type="button" class="button button--secondary standalone-back">Back</button>
      </div>
      <p class="eyebrow">Our Story</p>
      <h1>History of Matiri Boys' Senior School</h1>
      <p class="legal-intro">Founded to build confidence, character, and academic strength, Matiri Boys' Senior School has grown into a trusted place for young learners to thrive.</p>
      <div class="legal-list">
        <article class="legal-section">
          <h2>Roots and values</h2>
          <p>From the beginning, our mission has been to blend academic excellence with discipline, leadership, and a strong sense of community.</p>
        </article>
        <article class="legal-section">
          <h2>Growth and achievements</h2>
          <p>Over the years, the school has expanded its facilities, introduced modern classrooms, and developed programs that prepare students for the next stage in life.</p>
        </article>
        <article class="legal-section">
          <h2>Community focus</h2>
          <p>Families choose Matiri Boys because we care deeply about safety, mentorship, and nurturing each boy's potential through positive guidance.</p>
        </article>
        <article class="legal-section">
          <h2>Looking ahead</h2>
          <p>Today, we continue to evolve while staying true to the values that shaped our first generation of learners.</p>
        </article>
      </div>
    </div>
  `;
}

export function renderHistoryPage() {
  const section = document.createElement('section');
  section.className = 'legal-page-shell';
  section.innerHTML = createHistoryContent();

  const backButton = section.querySelector('.standalone-back');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.assign('/');
      }
    });
  }

  return section;
}

