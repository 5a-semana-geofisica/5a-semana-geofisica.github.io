// ===== JavaScript del slideshow =====
document.addEventListener('DOMContentLoaded', function () {
  const banner = document.querySelector('.banner');
  if (!banner) return;

  const slides = banner.querySelectorAll('img.slide');
  const total = slides.length;
  if (total === 0) {
    console.warn('No se encontraron imágenes de banner (.slide). Revisa las rutas en el HTML.');
    return;
  }

  // Inicializar: mostrar la primera imagen
  let current = 0;
  slides.forEach((img, i) => {
    img.loading = 'eager';
    img.classList.toggle('active', i === 0);
    img.addEventListener('error', () => console.warn('Error cargando imagen:', img.src));
  });

  function nextSlide() {
    slides[current].classList.remove('active');
    current = (current + 1) % total;
    slides[current].classList.add('active');
  }

  const intervalMs = 5000;
  let intervalId = setInterval(nextSlide, intervalMs);

  // Opcional: pausa al poner el ratón encima (si quieres reanudar después podríamos implementar resume)
  banner.addEventListener('mouseenter', () => clearInterval(intervalId));
  banner.addEventListener('mouseleave', () => { intervalId = setInterval(nextSlide, intervalMs); });
});