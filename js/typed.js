/* ===== TYPING ANIMATION ===== */
(function() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = [
    'Machine Learning Engineer',
    'AI Researcher',
    'Open Source Enthusiast',
    'Computer Vision Expert',
    'Full Stack Developer',
    'NLP Practitioner',
    'Community Builder',
  ];

  let textIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = texts[textIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 50;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 100;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      delay = 400; // pause before next
    }

    setTimeout(type, delay);
  }

  // Start after a short delay
  setTimeout(type, 1200);
})();
