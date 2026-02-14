/* ============================================
   Reut Klein - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Header Scroll Effect ----------
  const header = document.querySelector('.header');

  if (header) {
    function handleScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ---------- Mobile Navigation ----------
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const isOpen = navList.classList.contains('open');

      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);

      if (navOverlay) {
        navOverlay.classList.toggle('active');
      }

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close menu when clicking a link
    navList.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ---------- Scroll Animations (Intersection Observer) ----------
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-right, .fade-in-left');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: make everything visible
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---------- Contact Form ----------
  const contactForm = document.querySelector('.contact-form form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('[name="name"]');
      var phone = contactForm.querySelector('[name="phone"]');
      var email = contactForm.querySelector('[name="email"]');
      var message = contactForm.querySelector('[name="message"]');

      if (!name || !phone || !email || !message) return;

      // Build WhatsApp message
      var waMessage = encodeURIComponent(
        'הודעה מהאתר:\n' +
        'שם: ' + name.value + '\n' +
        'טלפון: ' + phone.value + '\n' +
        'מייל: ' + email.value + '\n' +
        'הודעה: ' + message.value
      );

      window.open('https://wa.me/972508551565?text=' + waMessage, '_blank');

      // Show confirmation
      var btn = contactForm.querySelector('.btn');
      if (btn) {
        var originalText = btn.textContent;
        btn.textContent = 'ההודעה נשלחה! ✓';
        btn.style.background = '#27ae60';
        btn.style.borderColor = '#27ae60';

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
