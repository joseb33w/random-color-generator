// Random Color Generator
(function() {
  try {
    const hexEl = document.getElementById('hex');
    const rgbEl = document.getElementById('rgb');
    const hintEl = document.getElementById('hint');
    const historyEl = document.getElementById('history');
    const copyBtn = document.getElementById('copyBtn');

    let currentHex = '#1A1A2E';
    let colorHistory = [];
    const MAX_HISTORY = 10;
    let tapCount = 0;

    // Generate random hex color
    function randomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return { r, g, b };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    // Determine if bg is light (for text contrast)
    function isLight(r, g, b) {
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.55;
    }

    // Change color
    function changeColor() {
      const { r, g, b } = randomColor();
      currentHex = rgbToHex(r, g, b);

      // Animate background
      document.body.style.backgroundColor = currentHex;

      // Toggle light/dark text
      if (isLight(r, g, b)) {
        document.body.classList.add('light-bg');
      } else {
        document.body.classList.remove('light-bg');
      }

      // Update text
      hexEl.textContent = currentHex;
      rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;

      // Pop animation
      hexEl.classList.add('pop');
      setTimeout(() => hexEl.classList.remove('pop'), 150);

      // Hide hint after first tap
      tapCount++;
      if (tapCount >= 1) {
        hintEl.classList.add('hidden');
      }

      // Add to history
      colorHistory.unshift(currentHex);
      if (colorHistory.length > MAX_HISTORY) colorHistory.pop();
      renderHistory();
    }

    // Render history dots
    function renderHistory() {
      historyEl.innerHTML = colorHistory.map(c =>
        `<div class="history-dot" style="background:${c}" title="${c}"></div>`
      ).join('');
    }

    // Copy hex to clipboard
    function copyHex() {
      if (!currentHex || tapCount === 0) return;
      navigator.clipboard.writeText(currentHex).then(() => {
        showToast('Copied ' + currentHex + ' ✓');
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = currentHex;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied ' + currentHex + ' ✓');
      });
    }

    // Toast notification
    function showToast(msg) {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    }

    // Event listeners
    document.body.addEventListener('click', function(e) {
      // Don't trigger color change when copy button is clicked
      if (e.target.closest('.copy-btn')) return;
      changeColor();
    });

    document.body.addEventListener('touchstart', function(e) {
      if (e.target.closest('.copy-btn')) return;
      // Prevent double-fire on touch devices
      e.preventDefault();
      changeColor();
    }, { passive: false });

    copyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      copyHex();
    });

    copyBtn.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      e.preventDefault();
      copyHex();
    }, { passive: false });

  } catch(e) {
    console.error('App error:', e.message, e.stack);
  }
})();
