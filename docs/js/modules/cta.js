export function renderCTA() {
  const section = document.createElement('section');
  section.className = 'cta';
  section.innerHTML = `
    <div class="container cta-card">
      <h2>Ready to apply?</h2>
      <p>Submit your application through the admissions page. All learner details are captured in one form.</p>
      <a class="button button--primary" href="/admissions" target="_self">Go to Admissions</a>
    </div>
  `;
  return section;
}
