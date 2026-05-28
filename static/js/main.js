// Font switcher (dev tool — remove before deploy)
function switchFont(fontFamily) {
  document.documentElement.style.setProperty('font-family', fontFamily + ', -apple-system, BlinkMacSystemFont, sans-serif');
  document.body.style.fontFamily = fontFamily + ', -apple-system, BlinkMacSystemFont, sans-serif';
  // Also update headings
  document.querySelectorAll('h1, h2, h3, h4, .publication-title, .publication-authors').forEach(function(el) {
    el.style.fontFamily = fontFamily + ', sans-serif';
  });
  // Save preference
  localStorage.setItem('preferred-font', fontFamily);
}

// Restore saved font on load
document.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('preferred-font');
  if (saved) {
    switchFont(saved);
    var sel = document.getElementById('fontSelect');
    if (sel) sel.value = saved;
  }
});

/* ========== Main JS: Scroll reveals, utilities ========== */

document.addEventListener('DOMContentLoaded', function() {
  // Scroll to top button
  const scrollBtn = document.querySelector('.scroll-to-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });
  }

  // Scroll reveal with Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // Teaser time counter animation
  const counter = document.querySelector('.time-counter');
  if (counter) {
    let seconds = 0;
    setInterval(function() {
      seconds++;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      counter.textContent = h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }, 1000);
  }
});

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy BibTeX
function copyBibTeX() {
  const code = document.querySelector('#bibtex-code code');
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(function() {
    const btn = document.querySelector('.copy-bibtex-btn');
    btn.classList.add('copied');
    btn.querySelector('.copy-text').textContent = 'Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.querySelector('.copy-text').textContent = 'Copy';
    }, 2000);
  });
}
