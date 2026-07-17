export function initImageSlider() {
  const slider = document.querySelector('.image-slider');
  if (!slider) return;

  const images = Array.from(slider.querySelectorAll('.image-slider__image'));
  const caption = slider.querySelector('.image-slider__caption');
  if (images.length < 2) return;

  let currentIndex = 0;

  const updateSlide = () => {
    images.forEach((image, index) => {
      image.classList.toggle('active', index === currentIndex);
    });

    if (caption) {
      caption.textContent = images[currentIndex].dataset.caption || '';
    }
  };

  updateSlide();

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlide();
  }, 3500);
}
