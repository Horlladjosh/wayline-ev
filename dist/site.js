const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-nav');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu.dataset.open = String(!isOpen);
    menuButton.textContent = isOpen ? 'Menu' : 'Close';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.dataset.open === 'true') {
      menu.dataset.open = 'false';
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = 'Menu';
      menuButton.focus();
    }
  });
}

// Keep the navigation close at hand when returning up the page.
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  let lastScrollY = window.scrollY;
  let directionStart = lastScrollY;
  let lastDirection = 0;
  let ticking = false;

  const updateHeader = () => {
    const currentY = Math.max(0, window.scrollY);
    const direction = Math.sign(currentY - lastScrollY);
    if (direction && direction !== lastDirection) {
      directionStart = lastScrollY;
      lastDirection = direction;
    }

    if (currentY < 120 || menu?.dataset.open === 'true' || siteHeader.querySelector(':focus-visible')) {
      siteHeader.classList.remove('is-hidden');
    } else if (direction && Math.abs(currentY - directionStart) > 12) {
      siteHeader.classList.toggle('is-hidden', direction > 0);
    }

    lastScrollY = currentY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  siteHeader.addEventListener('focusin', () => siteHeader.classList.remove('is-hidden'));
}

// Reveal each editorial section once it reaches the viewport. Keep content
// visible when motion is reduced or IntersectionObserver is unavailable.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const sections = document.querySelectorAll(
    '.home-places__head, .place, .feature, .sector, .process-row, .operations, .project-feature, .project-tile, .detail-secondary, .company-proof, .footer-invite__inner'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  const pendingSections = Array.from(sections).filter(
    section => section.getBoundingClientRect().top > window.innerHeight * 0.82
  );
  pendingSections.forEach(section => {
    section.classList.add('motion-pending');
    observer.observe(section);
  });
}

// Cover only deliberate, same-site page navigation. The next page loads
// normally; first visits, anchor jumps, downloads and modified clicks do not wait.
if (!reduceMotion) {
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="page-curtain__wordmark">wayline</span>';
  document.body.appendChild(curtain);
  let navigationTimer;

  document.addEventListener('click', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const destination = new URL(link.href, window.location.href);
    if (!['http:', 'https:'].includes(destination.protocol) || destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    if (navigationTimer) return;
    curtain.classList.add('is-active');
    navigationTimer = window.setTimeout(() => {
      window.location.assign(destination.href);
    }, 320);
  });

  window.addEventListener('pageshow', () => {
    window.clearTimeout(navigationTimer);
    navigationTimer = undefined;
    curtain.classList.remove('is-active');
  });
}
