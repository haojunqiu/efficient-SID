

/* ========== Main JS: Scroll reveals, utilities ========== */

document.addEventListener('DOMContentLoaded', function() {
  // ===== Title acronym animation =====
  const titleWords = document.querySelectorAll('.title-word');
  const acronymReveal = document.getElementById('acronymReveal');
  if (titleWords.length > 0 && acronymReveal) {
    // First word "Efficient" — highlight entire word
    // Remaining words (Single, Image, Diffusion) — highlight just the letter
    titleWords.forEach(function(word, i) {
      setTimeout(function() {
        if (i === 0) {
          // Highlight entire "Efficient" word
          word.classList.add('highlight');
        } else {
          // Highlight just the first letter (S, I, D)
          var letter = word.querySelector('.title-acronym');
          if (letter) letter.classList.add('highlight');
        }
      }, 800 + i * 500);
    });
    // Show the acronym text after all highlights
    setTimeout(function() {
      acronymReveal.classList.add('visible');
    }, 800 + titleWords.length * 500 + 400);
  }

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

  // ===== TEASER: SinDDM training simulation =====
  const sinddmClock = document.getElementById('sinddmClock');
  const sinddmFill = document.getElementById('sinddmProgressFill');
  const sinddmRemaining = document.getElementById('sinddmRemaining');
  const skipBtn = document.getElementById('skipTrainingBtn');
  const sinddmTraining = document.getElementById('sinddmTraining');
  const sinddmResults = document.getElementById('sinddmResults');

  if (sinddmClock) {
    const TOTAL_TRAINING_SECONDS = 8 * 3600; // 8 hours
    let elapsed = 0;
    let trainingDone = false;
    let clockInterval = null;
    let skipTimeout = null;
    const sinddmPct = document.getElementById('sinddmPct');

    function startTraining() {
      elapsed = 0;
      trainingDone = false;
      // Reset UI
      sinddmFill.style.transition = 'none';
      sinddmFill.style.width = '0%';
      sinddmClock.textContent = '0:00:00';
      if (sinddmPct) sinddmPct.textContent = '0.0000%';
      sinddmRemaining.textContent = '~8h 0m remaining';
      sinddmTraining.classList.remove('hidden');
      sinddmResults.classList.add('hidden');
      skipBtn.style.display = 'none';
      skipBtn.classList.remove('visible');
      // Re-enable transition after a frame
      requestAnimationFrame(function() {
        sinddmFill.style.transition = 'width 1s linear';
      });
      // Clear old intervals/timeouts
      if (clockInterval) clearInterval(clockInterval);
      if (skipTimeout) clearTimeout(skipTimeout);
      // Start clock
      clockInterval = setInterval(function() {
        if (trainingDone) return;
        elapsed++;
        const h = Math.floor(elapsed / 3600);
        const m = Math.floor((elapsed % 3600) / 60);
        const s = elapsed % 60;
        sinddmClock.textContent = h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        const pct = (elapsed / TOTAL_TRAINING_SECONDS) * 100;
        sinddmFill.style.width = pct + '%';
        if (sinddmPct) sinddmPct.textContent = pct.toFixed(4) + '%';
        const remSec = TOTAL_TRAINING_SECONDS - elapsed;
        const remH = Math.floor(remSec / 3600);
        const remM = Math.floor((remSec % 3600) / 60);
        sinddmRemaining.textContent = '~' + remH + 'h ' + remM + 'm remaining';
      }, 1000);
      // Show skip button after 10s
      skipTimeout = setTimeout(function() {
        if (!trainingDone && skipBtn) {
          skipBtn.style.display = 'inline-block';
          skipBtn.classList.add('visible');
        }
      }, 10000);
    }

    // Skip button handler
    if (skipBtn) {
      skipBtn.addEventListener('click', function() {
        revealSinddm();
      });
    }

    function revealSinddm() {
      if (trainingDone) return;
      trainingDone = true;
      if (clockInterval) clearInterval(clockInterval);
      if (skipTimeout) clearTimeout(skipTimeout);
      sinddmClock.textContent = '8:00:00';
      sinddmFill.style.transition = 'width 0.8s ease-out';
      sinddmFill.style.width = '100%';
      sinddmRemaining.textContent = 'Training complete!';
      if (sinddmPct) sinddmPct.textContent = '100%';
      skipBtn.style.display = 'none';
      skipBtn.classList.remove('visible');
      // After 1.6s (real inference time), show results
      setTimeout(function() {
        sinddmTraining.classList.add('hidden');
        sinddmResults.classList.remove('hidden');
      }, 1600);
    }

    // Input selector — clicking a new input resets training
    const inputThumbs = document.querySelectorAll('.sinddm-input-thumb');
    inputThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        inputThumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        startTraining();
      });
    });

    // Start initial training
    startTraining();
  }

  // ===== TEASER: Ours slideshow =====
  const oursSlideshow = document.getElementById('oursSlideshow');
  const oursMegapixel = document.getElementById('oursMegapixel');
  const frameCounter = document.getElementById('oursFrameCounter');

  if (oursSlideshow) {
    // Placeholder colors per input (will be replaced with real images)
    const colorSets = {
      0: [
        ['#6b8e6b', '#7a9e7a', '#5c7e5c'],
        ['#8fbc8f', '#6b9e6b', '#4a8a4a'],
        ['#5f9f5f', '#7ab87a', '#3d8d3d'],
        ['#4caf4c', '#66bb66', '#339933'],
        ['#2e8b2e', '#5ca85c', '#1a751a'],
      ],
      1: [
        ['#6b9e9e', '#7aaeae', '#5c8e8e'],
        ['#8fcfcf', '#6baeae', '#4a9a9a'],
        ['#5fafaf', '#7ac8c8', '#3d9d9d'],
        ['#4cbfbf', '#66cbcb', '#339a9a'],
        ['#2e9b9b', '#5cb8b8', '#1a8585'],
      ],
      2: [
        ['#9e8f6b', '#ae9e7a', '#8e7e5c'],
        ['#cfbc8f', '#ae9e6b', '#9a8a4a'],
        ['#af9f5f', '#c8b87a', '#9d8d3d'],
        ['#bfaf4c', '#cbbb66', '#9a9933'],
        ['#9b8b2e', '#b8a85c', '#85751a'],
      ],
    };
    let currentOursInput = 0;
    let slideColors = colorSets[0];
    let slideIdx = 0;
    let megapixelShown = false;
    const CYCLE_INTERVAL = 1000; // 1 FPS
    const MEGAPIXEL_AFTER = 5; // show megapixel after 5 frames
    const MEGAPIXEL_DURATION = 4000; // show megapixel for 4s

    const slideItems = [
      document.getElementById('oursSlide0'),
      document.getElementById('oursSlide1'),
      document.getElementById('oursSlide2'),
    ];

    function cycleSlides() {
      slideIdx = (slideIdx + 1) % 20;
      const colorSet = slideColors[slideIdx % slideColors.length];
      slideItems.forEach(function(item, i) {
        if (item) {
          item.style.opacity = '0';
          setTimeout(function() {
            item.style.background = colorSet[i];
            item.style.opacity = '1';
          }, 150);
        }
      });
      if (frameCounter) frameCounter.textContent = slideIdx + 1;

      // Show megapixel upgrade after N frames
      if (slideIdx === MEGAPIXEL_AFTER && !megapixelShown) {
        megapixelShown = true;
        oursSlideshow.classList.add('hidden');
        oursMegapixel.classList.remove('hidden');
        oursMegapixel.classList.add('megapixel-enter');
        // Return to slideshow after duration
        setTimeout(function() {
          oursMegapixel.classList.remove('megapixel-enter');
          oursMegapixel.classList.add('hidden');
          oursSlideshow.classList.remove('hidden');
          megapixelShown = false;
        }, MEGAPIXEL_DURATION);
      }
    }

    setInterval(cycleSlides, CYCLE_INTERVAL);

    // Input selector for ours card
    const oursInputThumbs = document.querySelectorAll('.ours-input-thumb');
    oursInputThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        oursInputThumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        currentOursInput = parseInt(thumb.dataset.input);
        slideColors = colorSets[currentOursInput];
        slideIdx = 0;
        if (frameCounter) frameCounter.textContent = '1';
      });
    });
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
