// ── Navbar scroll state ───────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ── Mobile hamburger menu ─────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Smooth anchor scrolling ───────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── Service tabs ──────────────────────────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ── Scroll animations (Intersection Observer) ─────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Animated counters ─────────────────────────────────────────────────────────
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || (el.textContent.includes('%') ? '%' : '');
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(update);
}

// Detect % suffix from sibling label text
counters.forEach(el => {
  const label = el.nextElementSibling?.textContent || '';
  if (label.toLowerCase().includes('%') || label.toLowerCase().includes('percent'))
    el.dataset.suffix = '%';
});

// ── Contact form (Formspree) ──────────────────────────────────────────────────
// Sign up at formspree.io, create a form, paste your endpoint below.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykovwqk';

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(contactForm),
      });

      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
      } else {
        const data = await res.json();
        const msg  = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
        alert('Could not send message: ' + msg);
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled    = false;
      }
    } catch {
      alert('Network error — please email us directly.');
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled    = false;
    }
  });
}

// ── Active nav link highlight on scroll ──────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - navbar.offsetHeight - 60) {
      current = section.id;
    }
  });

  navAnchors.forEach(a => {
    a.style.fontWeight = a.getAttribute('href') === '#' + current ? '700' : '';
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });
