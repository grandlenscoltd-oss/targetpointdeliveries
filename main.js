/* =========================================
   TARGET POINT DELIVERIES — main.js
   ========================================= */

// ---- NAV SCROLL EFFECT ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- MOBILE MENU ----
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navMobile.classList.toggle('open', menuOpen);
  burger.querySelectorAll('span')[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px, 6px)' : '';
  burger.querySelectorAll('span')[1].style.opacity = menuOpen ? '0' : '1';
  burger.querySelectorAll('span')[2].style.transform = menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : '';
});

function closeMobile() {
  menuOpen = false;
  navMobile.classList.remove('open');
  burger.querySelectorAll('span')[0].style.transform = '';
  burger.querySelectorAll('span')[1].style.opacity = '1';
  burger.querySelectorAll('span')[2].style.transform = '';
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- STAGGERED REVEAL FOR GRIDS ----
const grids = document.querySelectorAll(
  '.services-grid, .steps, .why-right, .testi-grid, .pricing-grid, .contact-items'
);
grids.forEach(grid => {
  const children = grid.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 100}ms`;
  });
});

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Hero stat counter
const heroStat = document.querySelector('.hero-stat-1 .stat-num');
if (heroStat) {
  const heroStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(heroStat, 500);
        heroStatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  heroStatObserver.observe(heroStat);
}

// ---- WHATSAPP ENQUIRY FORM ----
document.getElementById('sendEnquiry').addEventListener('click', () => {
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const pickup = document.getElementById('fpickup').value.trim();
  const dropoff = document.getElementById('fdropoff').value.trim();
  const item = document.getElementById('fitem').value.trim();

  if (!name || !phone || !pickup || !dropoff) {
    showToast('Please fill in your name, phone, pickup and drop-off locations.', 'error');
    return;
  }

  let msg = `Hi Target Point! I'd like to book a delivery.\n\n`;
  msg += `👤 *Name:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `📍 *Pickup:* ${pickup}\n`;
  msg += `🏁 *Drop-off:* ${dropoff}\n`;
  if (item) msg += `📦 *Item:* ${item}\n`;
  msg += `\nPlease confirm availability. Thank you!`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/254797939390?text=${encoded}`, '_blank');
});

// ---- TOAST NOTIFICATIONS ----
function showToast(message, type = 'success') {
  const existing = document.querySelector('.tp-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'tp-toast';
  toast.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${type === 'error' ? '#ef4444' : '#1a1a2e'};
    color: #fff; padding: 14px 24px; border-radius: 50px;
    font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999; opacity: 0; transition: all 0.3s ease;
    white-space: nowrap; max-width: 90vw;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- ACTIVE NAV LINK HIGHLIGHTING ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? '#fff'
      : 'rgba(255,255,255,0.75)';
  });
}, { passive: true });

// ---- PRELOAD FONTS CHECK ----
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});
