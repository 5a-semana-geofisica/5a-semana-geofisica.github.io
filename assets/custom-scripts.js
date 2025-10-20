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

// ===== Lightbox global: abrir imágenes en un modal al hacer click =====
document.addEventListener('DOMContentLoaded', function () {
  // avoid duplicate injection
  if (document.getElementById('site-lightbox')) return;

  const css = `
  .site-lightbox { display:none; position:fixed; inset:0; z-index:12000; }
  .site-lightbox[aria-hidden="false"] { display:block; }
  .site-lightbox-backdrop{position:fixed; inset:0; background:rgba(0,0,0,0.75);} 
  .site-lightbox-content{position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); max-width:96%; max-height:94%; padding:12px; box-sizing:border-box;}
  .site-lightbox-content img{display:block; max-width:100%; max-height:80vh; margin:0 auto; border-radius:6px;}
  .site-lightbox-close{position:absolute; right:8px; top:8px; background:rgba(0,0,0,0.6); color:#fff; border:none; font-size:22px; line-height:1; padding:6px 10px; border-radius:4px; cursor:pointer}
  .site-lightbox-caption{color:#fff; text-align:center; margin-top:8px;}
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.id = 'site-lightbox';
  wrapper.className = 'site-lightbox';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `
    <div class="site-lightbox-backdrop" id="site-lightbox-backdrop"></div>
    <div class="site-lightbox-content" role="dialog" aria-modal="true">
      <button class="site-lightbox-close" id="site-lightbox-close" aria-label="Cerrar">×</button>
      <img id="site-lightbox-image" src="" alt="" />
      <div class="site-lightbox-caption" id="site-lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const lightbox = document.getElementById('site-lightbox');
  const lbImg = document.getElementById('site-lightbox-image');
  const lbCap = document.getElementById('site-lightbox-caption');
  const lbClose = document.getElementById('site-lightbox-close');
  const lbBackdrop = document.getElementById('site-lightbox-backdrop');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  // helper: is asset image
  const isAssetImage = (url) => /assets\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);

  // intercept clicks on anchors that link to images
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    // skip anchors inside organizer/footer areas so those images keep their original behavior
    if (a.closest('.sponsor') || a.closest('footer') || a.closest('.footer-enhanced')) return;
    // skip anchors that are handled by local page lightboxes (e.g. .curso-lightbox)
    if (a.classList && a.classList.contains('curso-lightbox')) return;
    if (isAssetImage(href)) {
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // allow modifier open
        e.preventDefault();
        const caption = a.getAttribute('title') || (a.querySelector('img') ? (a.querySelector('img').alt || '') : '');
        openLightbox(href, caption);
      });
    }
  });

  // also intercept clicks on images themselves (that may not be wrapped in <a>)
  document.querySelectorAll('img').forEach(img => {
    try {
      const src = img.getAttribute('src') || '';
      if (!isAssetImage(src)) return; // only asset images
      // avoid banner slides (they often are .slide)
      if (img.classList && img.classList.contains('slide')) return;
      // skip images inside organizer/footer areas so those photos aren't captured by the lightbox
      if (img.closest('.sponsor') || img.closest('footer') || img.closest('.footer-enhanced')) return;
      // skip images that are handled by local page lightboxes (e.g. wrapped by a.curso-lightbox)
      if (img.closest('a.curso-lightbox')) return;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const caption = img.alt || img.getAttribute('title') || '';
        openLightbox(src, caption);
      });
    } catch (err) { /* ignore */ }
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
});

// ===== Lightbox global: abrir imágenes en un modal al hacer click =====
document.addEventListener('DOMContentLoaded', function () {
  // avoid duplicate injection
  if (document.getElementById('site-lightbox')) return;

  const css = `
  .site-lightbox { display:none; position:fixed; inset:0; z-index:12000; }
  .site-lightbox[aria-hidden="false"] { display:block; }
  .site-lightbox-backdrop{position:fixed; inset:0; background:rgba(0,0,0,0.75);} 
  .site-lightbox-content{position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); max-width:96%; max-height:94%; padding:12px; box-sizing:border-box;}
  .site-lightbox-content img{display:block; max-width:100%; max-height:80vh; margin:0 auto; border-radius:6px;}
  .site-lightbox-close{position:absolute; right:8px; top:8px; background:rgba(0,0,0,0.6); color:#fff; border:none; font-size:22px; line-height:1; padding:6px 10px; border-radius:4px; cursor:pointer}
  .site-lightbox-caption{color:#fff; text-align:center; margin-top:8px;}
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.id = 'site-lightbox';
  wrapper.className = 'site-lightbox';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `
    <div class="site-lightbox-backdrop" id="site-lightbox-backdrop"></div>
    <div class="site-lightbox-content" role="dialog" aria-modal="true">
      <button class="site-lightbox-close" id="site-lightbox-close" aria-label="Cerrar">×</button>
      <img id="site-lightbox-image" src="" alt="" />
      <div class="site-lightbox-caption" id="site-lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const lightbox = document.getElementById('site-lightbox');
  const lbImg = document.getElementById('site-lightbox-image');
  const lbCap = document.getElementById('site-lightbox-caption');
  const lbClose = document.getElementById('site-lightbox-close');
  const lbBackdrop = document.getElementById('site-lightbox-backdrop');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  // helper: is asset image
  const isAssetImage = (url) => /assets\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);

  // intercept clicks on anchors that link to images
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    // skip anchors that are handled by local page lightboxes (e.g. .curso-lightbox)
    if (a.classList && a.classList.contains('curso-lightbox')) return;
    if (isAssetImage(href)) {
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // allow modifier open
        e.preventDefault();
        const caption = a.getAttribute('title') || (a.querySelector('img') ? (a.querySelector('img').alt || '') : '');
        openLightbox(href, caption);
      });
    }
  });

  // also intercept clicks on images themselves (that may not be wrapped in <a>)
  document.querySelectorAll('img').forEach(img => {
    try {
      const src = img.getAttribute('src') || '';
      if (!isAssetImage(src)) return; // only asset images
      // avoid banner slides (they often are .slide)
      if (img.classList && img.classList.contains('slide')) return;
      // skip images that are handled by local page lightboxes (e.g. wrapped by a.curso-lightbox)
      if (img.closest('a.curso-lightbox')) return;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const caption = img.alt || img.getAttribute('title') || '';
        openLightbox(src, caption);
      });
    } catch (err) { /* ignore */ }
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
});