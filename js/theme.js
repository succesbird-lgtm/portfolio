/* ===== THEME TOGGLE ===== */
(function () {
  const STORAGE_KEY = 'sg-portfolio-theme';

  // Apply theme immediately to avoid flash
  function applyTheme(theme, animate) {
    if (!animate) document.body.classList.add('no-transition');
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    // Update all toggle buttons on the page
    updateButtons(theme);
    if (!animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.remove('no-transition');
        });
      });
    }
  }

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || 'dark'; } catch { return 'dark'; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }

  function updateButtons(theme) {
    document.querySelectorAll('.toggle-thumb').forEach(thumb => {
      thumb.innerHTML = theme === 'light' ? '☀️' : '🌙';
    });
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      btn.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function toggleTheme() {
    const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    saveTheme(next);

    // Ripple animation on the button
    const btn = event && event.currentTarget;
    if (btn) {
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }
  }

  // Inject toggle button into ALL navbars
  function injectButtons() {
    document.querySelectorAll('.nav-container').forEach(container => {
      if (container.querySelector('.theme-toggle-btn')) return; // already injected
      const btn = document.createElement('button');
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle theme');
      btn.innerHTML = `<span class="toggle-thumb">🌙</span>`;
      btn.addEventListener('click', toggleTheme);

      // Insert before hamburger (or at end)
      const hamburger = container.querySelector('.hamburger');
      if (hamburger) {
        container.insertBefore(btn, hamburger);
      } else {
        container.appendChild(btn);
      }
    });
  }

  // Init on DOM ready
  function init() {
    injectButtons();
    const saved = getSavedTheme();
    applyTheme(saved, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
