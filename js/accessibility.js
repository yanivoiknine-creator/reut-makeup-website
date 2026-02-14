/* ============================================
   Reut Klein - Accessibility Widget
   WCAG 2.0 AA Compliance
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var toggle = document.getElementById('accessibilityToggle');
  var panel = document.getElementById('accessibilityPanel');
  var closeBtn = document.getElementById('accessibilityClose');
  var resetBtn = document.getElementById('accessibilityReset');
  var options = document.querySelectorAll('.accessibility-option');

  if (!toggle || !panel) return;

  // Storage key
  var STORAGE_KEY = 'reutklein_accessibility';

  // State
  var state = loadState();

  // ---------- Panel Toggle ----------
  function openPanel() {
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closePanel() {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closePanel();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('open') &&
        !panel.contains(e.target) &&
        !toggle.contains(e.target)) {
      closePanel();
    }
  });

  // ---------- Accessibility Actions ----------
  var fontSizeLevel = state.fontSizeLevel || 0; // -1, 0, 1, 2

  var actions = {
    'increase-font': {
      toggle: function () {
        if (fontSizeLevel < 2) {
          fontSizeLevel++;
          applyFontSize();
        }
      },
      isActive: function () { return fontSizeLevel > 0; }
    },
    'decrease-font': {
      toggle: function () {
        if (fontSizeLevel > -1) {
          fontSizeLevel--;
          applyFontSize();
        }
      },
      isActive: function () { return fontSizeLevel < 0; }
    },
    'high-contrast': {
      toggle: function () {
        document.body.classList.toggle('high-contrast');
      },
      isActive: function () { return document.body.classList.contains('high-contrast'); }
    },
    'grayscale': {
      toggle: function () {
        document.body.classList.toggle('grayscale');
      },
      isActive: function () { return document.body.classList.contains('grayscale'); }
    },
    'highlight-links': {
      toggle: function () {
        document.body.classList.toggle('highlight-links');
      },
      isActive: function () { return document.body.classList.contains('highlight-links'); }
    },
    'readable-font': {
      toggle: function () {
        document.body.classList.toggle('readable-font');
      },
      isActive: function () { return document.body.classList.contains('readable-font'); }
    },
    'big-cursor': {
      toggle: function () {
        document.body.classList.toggle('big-cursor');
      },
      isActive: function () { return document.body.classList.contains('big-cursor'); }
    },
    'stop-animations': {
      toggle: function () {
        document.body.classList.toggle('stop-animations');
      },
      isActive: function () { return document.body.classList.contains('stop-animations'); }
    }
  };

  function applyFontSize() {
    document.body.classList.remove('font-size-increase', 'font-size-increase-2', 'font-size-decrease');
    if (fontSizeLevel === 1) {
      document.body.classList.add('font-size-increase');
    } else if (fontSizeLevel >= 2) {
      document.body.classList.add('font-size-increase-2');
    } else if (fontSizeLevel < 0) {
      document.body.classList.add('font-size-decrease');
    }
  }

  // ---------- Option Click Handlers ----------
  options.forEach(function (option) {
    option.addEventListener('click', function () {
      var action = this.getAttribute('data-action');
      if (actions[action]) {
        actions[action].toggle();
        updateButtonStates();
        saveState();
      }
    });
  });

  // ---------- Update Active States ----------
  function updateButtonStates() {
    options.forEach(function (option) {
      var action = option.getAttribute('data-action');
      if (actions[action]) {
        if (actions[action].isActive()) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      }
    });
  }

  // ---------- Reset ----------
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      // Remove all body classes
      document.body.classList.remove(
        'high-contrast', 'grayscale', 'highlight-links',
        'readable-font', 'big-cursor', 'stop-animations',
        'font-size-increase', 'font-size-increase-2', 'font-size-decrease'
      );
      fontSizeLevel = 0;
      updateButtonStates();
      saveState();
    });
  }

  // ---------- Persistence ----------
  function saveState() {
    try {
      var data = {
        fontSizeLevel: fontSizeLevel,
        highContrast: document.body.classList.contains('high-contrast'),
        grayscale: document.body.classList.contains('grayscale'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        readableFont: document.body.classList.contains('readable-font'),
        bigCursor: document.body.classList.contains('big-cursor'),
        stopAnimations: document.body.classList.contains('stop-animations')
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage not available
    }
  }

  function loadState() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function applyState() {
    if (state.fontSizeLevel !== undefined) {
      fontSizeLevel = state.fontSizeLevel;
      applyFontSize();
    }
    if (state.highContrast) document.body.classList.add('high-contrast');
    if (state.grayscale) document.body.classList.add('grayscale');
    if (state.highlightLinks) document.body.classList.add('highlight-links');
    if (state.readableFont) document.body.classList.add('readable-font');
    if (state.bigCursor) document.body.classList.add('big-cursor');
    if (state.stopAnimations) document.body.classList.add('stop-animations');
    updateButtonStates();
  }

  // Apply saved state on load
  applyState();

  // ---------- Keyboard trap within panel ----------
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;

    var focusable = panel.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

});
