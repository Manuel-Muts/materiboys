export function renderAboutSection() {
  const section = document.createElement('section');
  section.className = 'section section--light';
  section.id = 'about-us';
  section.innerHTML = `
    <div class="container about-card">
      <div class="section-heading">
        <p class="eyebrow">About Us</p>
        <h2>We are a school committed to shaping responsible young men with strong character and academic excellence.</h2>
      </div>
      <div class="about-grid">
        <div class="about-copy">
          <p>Materi Boys' Senior School is a vibrant learning community where every learner is encouraged to grow in knowledge, discipline, and confidence. Our purpose is to create an environment where boys can discover their potential, build strong values, and prepare for meaningful leadership in society.</p>
          <p>We believe education goes beyond classroom lessons. It is about developing the whole child through academic rigor, moral guidance, mentorship, and consistent support from a dedicated team of educators.</p>
        </div>
        <div class="about-highlights">
          <div id="mission" class="about-highlight about-highlight--mission">
            <h3>Mission</h3>
            <p>Nurture and instill strong moral values for character formation.</p>
          </div>
          <div id="vision" class="about-highlight about-highlight--vision">
            <h3>Vision</h3>
            <p>To produce strong, self reliant students who become the leaders of tomorrow.</p>
          </div>
        </div>
      </div>
    </div>
  `;
  return section;
}
