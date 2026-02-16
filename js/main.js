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
      if (targetId === '#accessibility-statement') return; // Handled separately

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

  // ---------- Accessibility Statement Modal ----------
  (function () {
    var isEnglish = document.body.classList.contains('ltr');

    var modalContent = isEnglish ?
      '<div class="a11y-modal" role="dialog" aria-label="Accessibility Statement" aria-modal="true">' +
        '<button class="a11y-modal__close" aria-label="Close">&times;</button>' +
        '<h2>Accessibility Statement</h2>' +
        '<p>The Reut Klein website is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>' +
        '<h3>Measures Taken</h3>' +
        '<ul>' +
          '<li>Semantic HTML structure for screen reader compatibility</li>' +
          '<li>Full keyboard navigation support</li>' +
          '<li>Sufficient color contrast ratios</li>' +
          '<li>Alt text for all images</li>' +
          '<li>ARIA labels for interactive elements</li>' +
          '<li>Built-in accessibility widget with text size, contrast, and other adjustments</li>' +
          '<li>Responsive design for all screen sizes</li>' +
          '<li>Skip to main content link</li>' +
        '</ul>' +
        '<h3>Standards</h3>' +
        '<p>This website strives to conform to WCAG 2.0 level AA guidelines and Israeli Standard 5568.</p>' +
        '<h3>Contact Us</h3>' +
        '<p>If you encounter any accessibility issues on this website, please contact us:</p>' +
        '<p>Phone: <a href="tel:+972508551565">050-8551565</a><br>Email: <a href="mailto:reut.kleinoiknine@gmail.com">reut.kleinoiknine@gmail.com</a></p>' +
        '<p style="margin-top:1.5rem;font-size:0.85rem;color:#999;">Last updated: February 2026</p>' +
      '</div>' :
      '<div class="a11y-modal" role="dialog" aria-label="\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA" aria-modal="true">' +
        '<button class="a11y-modal__close" aria-label="\u05E1\u05D2\u05D9\u05E8\u05D4">&times;</button>' +
        '<h2>\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA</h2>' +
        '<p>\u05D0\u05EA\u05E8 \u05E8\u05E2\u05D5\u05EA \u05E7\u05DC\u05D9\u05D9\u05DF \u05DE\u05D7\u05D5\u05D9\u05D1 \u05DC\u05D4\u05E0\u05D2\u05E9\u05D4 \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA \u05E2\u05D1\u05D5\u05E8 \u05D0\u05E0\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05D9\u05D5\u05EA. \u05D0\u05E0\u05D5 \u05E4\u05D5\u05E2\u05DC\u05D9\u05DD \u05D1\u05D0\u05D5\u05E4\u05DF \u05DE\u05EA\u05DE\u05D9\u05D3 \u05DC\u05E9\u05D9\u05E4\u05D5\u05E8 \u05D7\u05D5\u05D5\u05D9\u05D9\u05EA \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05E2\u05D1\u05D5\u05E8 \u05DB\u05D5\u05DC\u05DD \u05D5\u05DE\u05D9\u05D9\u05E9\u05DE\u05D9\u05DD \u05D0\u05EA \u05EA\u05E7\u05E0\u05D9 \u05D4\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05D4\u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D9\u05DD.</p>' +
        '<h3>\u05D4\u05E6\u05E2\u05D3\u05D9\u05DD \u05E9\u05E0\u05E0\u05E7\u05D8\u05D5</h3>' +
        '<ul>' +
          '<li>\u05DE\u05D1\u05E0\u05D4 HTML \u05E1\u05DE\u05E0\u05D8\u05D9 \u05DC\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05E2\u05DD \u05E7\u05D5\u05E8\u05D0\u05D9 \u05DE\u05E1\u05DA</li>' +
          '<li>\u05EA\u05DE\u05D9\u05DB\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D1\u05E0\u05D9\u05D5\u05D5\u05D8 \u05DE\u05E7\u05DC\u05D3\u05EA</li>' +
          '<li>\u05D9\u05D7\u05E1\u05D9 \u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05E6\u05D1\u05E2\u05D9\u05DD \u05DE\u05E1\u05E4\u05E7\u05D9\u05DD</li>' +
          '<li>\u05D8\u05E7\u05E1\u05D8 \u05D7\u05DC\u05D5\u05E4\u05D9 \u05DC\u05DB\u05DC \u05D4\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</li>' +
          '<li>\u05EA\u05D5\u05D5\u05D9\u05D5\u05EA ARIA \u05DC\u05D0\u05DC\u05DE\u05E0\u05D8\u05D9\u05DD \u05D0\u05D9\u05E0\u05D8\u05E8\u05D0\u05E7\u05D8\u05D9\u05D1\u05D9\u05D9\u05DD</li>' +
          '<li>\u05DB\u05DC\u05D9 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05DE\u05D5\u05D1\u05E0\u05D4 \u05E2\u05DD \u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05DC\u05D4\u05EA\u05D0\u05DE\u05EA \u05D2\u05D5\u05D3\u05DC \u05D8\u05E7\u05E1\u05D8, \u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D5\u05E2\u05D5\u05D3</li>' +
          '<li>\u05E2\u05D9\u05E6\u05D5\u05D1 \u05E8\u05E1\u05E4\u05D5\u05E0\u05E1\u05D9\u05D1\u05D9 \u05DC\u05DB\u05DC \u05D2\u05D5\u05D3\u05DC\u05D9 \u05D4\u05DE\u05E1\u05DA</li>' +
          '<li>\u05E7\u05D9\u05E9\u05D5\u05E8 \u05D3\u05D9\u05DC\u05D5\u05D2 \u05DC\u05EA\u05D5\u05DB\u05DF \u05D4\u05E8\u05D0\u05E9\u05D9</li>' +
        '</ul>' +
        '<h3>\u05EA\u05E7\u05E0\u05D9\u05DD</h3>' +
        '<p>\u05D0\u05EA\u05E8 \u05D6\u05D4 \u05E9\u05D5\u05D0\u05E3 \u05DC\u05E2\u05DE\u05D5\u05D3 \u05D1\u05D4\u05E0\u05D7\u05D9\u05D5\u05EA WCAG 2.0 \u05D1\u05E8\u05DE\u05D4 AA \u05D5\u05D1\u05EA\u05E7\u05DF \u05D4\u05D9\u05E9\u05E8\u05D0\u05DC\u05D9 5568.</p>' +
        '<h3>\u05D9\u05E6\u05D9\u05E8\u05EA \u05E7\u05E9\u05E8</h3>' +
        '<p>\u05D0\u05DD \u05E0\u05EA\u05E7\u05DC\u05EA\u05DD \u05D1\u05D1\u05E2\u05D9\u05D9\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8, \u05D0\u05E0\u05D0 \u05E6\u05E8\u05D5 \u05D0\u05D9\u05EA\u05E0\u05D5 \u05E7\u05E9\u05E8:</p>' +
        '<p>\u05D8\u05DC\u05E4\u05D5\u05DF: <a href="tel:+972508551565">050-8551565</a><br>\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC: <a href="mailto:reut.kleinoiknine@gmail.com">reut.kleinoiknine@gmail.com</a></p>' +
        '<p style="margin-top:1.5rem;font-size:0.85rem;color:#999;">\u05E2\u05D5\u05D3\u05DB\u05DF \u05DC\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4: \u05E4\u05D1\u05E8\u05D5\u05D0\u05E8 2026</p>' +
      '</div>';

    var overlay = document.createElement('div');
    overlay.className = 'a11y-modal-overlay';
    overlay.id = 'a11yModal';
    overlay.innerHTML = modalContent;
    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.a11y-modal__close');

    // Open modal from footer link
    document.querySelectorAll('a[href="#accessibility-statement"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('active');
        closeBtn.focus();
      });
    });

    // Close modal
    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }
    });
  })();

  // ---------- Google Tag Manager (loaded only with consent) ----------
  function loadGTM() {
    if (window._gtmLoaded) return;
    window._gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-N8MZ63S';
    document.head.appendChild(s);
  }

  // ---------- Cookie Consent Banner ----------
  (function () {
    var COOKIE_KEY = 'reutklein_cookie_consent';
    var consent;

    try {
      consent = localStorage.getItem(COOKIE_KEY);
    } catch (e) {
      return;
    }

    // If previously accepted, load GTM and skip banner
    if (consent === 'accepted') {
      loadGTM();
      return;
    }

    // If previously declined, skip banner (no GTM)
    if (consent === 'declined') return;

    var isEnglish = document.body.classList.contains('ltr');

    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.id = 'cookieConsent';
    banner.innerHTML = isEnglish ?
      '<div class="cookie-consent__inner">' +
        '<p class="cookie-consent__text">This website uses cookies to improve your browsing experience and analyze site traffic. By clicking "Accept", you consent to the use of cookies.</p>' +
        '<div class="cookie-consent__buttons">' +
          '<button class="cookie-consent__btn cookie-consent__btn--accept" id="cookieAccept">Accept</button>' +
          '<button class="cookie-consent__btn cookie-consent__btn--decline" id="cookieDecline">Decline</button>' +
        '</div>' +
      '</div>' :
      '<div class="cookie-consent__inner">' +
        '<p class="cookie-consent__text">\u05D0\u05EA\u05E8 \u05D6\u05D4 \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E2\u05D5\u05D2\u05D9\u05D5\u05EA (Cookies) \u05DC\u05E9\u05D9\u05E4\u05D5\u05E8 \u05D7\u05D5\u05D5\u05D9\u05D9\u05EA \u05D4\u05D2\u05DC\u05D9\u05E9\u05D4 \u05D5\u05DC\u05E0\u05D9\u05EA\u05D5\u05D7 \u05EA\u05E0\u05D5\u05E2\u05EA \u05D4\u05D2\u05D5\u05DC\u05E9\u05D9\u05DD. \u05D1\u05DC\u05D7\u05D9\u05E6\u05D4 \u05E2\u05DC "\u05D0\u05D9\u05E9\u05D5\u05E8" \u05D0\u05EA/\u05D4 \u05DE\u05E1\u05DB\u05D9\u05DD/\u05D4 \u05DC\u05E9\u05D9\u05DE\u05D5\u05E9 \u05D1\u05E2\u05D5\u05D2\u05D9\u05D5\u05EA.</p>' +
        '<div class="cookie-consent__buttons">' +
          '<button class="cookie-consent__btn cookie-consent__btn--accept" id="cookieAccept">\u05D0\u05D9\u05E9\u05D5\u05E8</button>' +
          '<button class="cookie-consent__btn cookie-consent__btn--decline" id="cookieDecline">\u05D3\u05D7\u05D9\u05D9\u05D4</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    // Show banner after a short delay
    setTimeout(function () {
      banner.classList.add('active');
    }, 1000);

    document.getElementById('cookieAccept').addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'accepted'); } catch (e) {}
      loadGTM();
      banner.classList.remove('active');
      setTimeout(function () { banner.remove(); }, 300);
    });

    document.getElementById('cookieDecline').addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'declined'); } catch (e) {}
      banner.classList.remove('active');
      setTimeout(function () { banner.remove(); }, 300);
    });
  })();

});
