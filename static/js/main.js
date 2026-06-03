

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

  // SinDDM result image config
  const sinddmInputNames = ['aqueduct', 'balloons', 'marinabaysands'];
  const sinddmResolutions = ['258×193', '248×186', '273×182'];
  const sinddmResultIds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
  let currentSinddmInput = 0;

  // Resolution badge & done-text elements
  const sinddmResBadge = document.querySelector('.res-badge--low');
  const sinddmDoneText = document.querySelector('.sinddm-done-text');

  function updateSinddmResolution(idx) {
    var res = sinddmResolutions[idx];
    if (sinddmResBadge) sinddmResBadge.textContent = res + ' px';
    if (sinddmDoneText) sinddmDoneText.textContent = 'Done! 3 samples at ' + res + ' px';
  }

  function getSinddmResultImages(inputIdx) {
    var name = sinddmInputNames[inputIdx];
    // Pick 3 random distinct indices from available results
    var shuffled = sinddmResultIds.slice().sort(function() { return Math.random() - 0.5; });
    var picked = shuffled.slice(0, 3);
    return picked.map(function(id) {
      return 'static/images/teaser/sinddm/results/' + name + '/' + id + '.png';
    });
  }

  function populateSinddmResults() {
    var imgs = getSinddmResultImages(currentSinddmInput);
    for (var i = 0; i < 3; i++) {
      var el = document.getElementById('sinddmResult' + i);
      if (el) el.src = imgs[i];
    }
  }

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
        populateSinddmResults();
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
        currentSinddmInput = parseInt(thumb.getAttribute('data-input'));
        updateSinddmResolution(currentSinddmInput);
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
    // Image sets per input: each entry maps to a folder with numbered PNGs
    const oursImageSets = {
      0: { path: 'static/images/teaser/ours/succulent/', ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], total: 20, res: '1216×816' },
      1: { path: 'static/images/teaser/ours/yosemite/', ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], total: 20, res: '1600×608' },
      2: { path: 'static/images/teaser/ours/terrace/', ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], total: 20, res: '1216×816' },
      3: { path: 'static/images/teaser/ours/moon/', ids: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], total: 20, res: '1216×816' }
    };
    const oursResBadge = document.getElementById('oursResBadge');
    let currentOursInput = 0;
    let currentSet = oursImageSets[0];
    let slideIdx = 0;
    let generatedCount = 1; // how many images have been generated so far
    const CYCLE_INTERVAL = 1500; // 1.5s per frame for better viewing

    const slideItems = [
      document.getElementById('oursSlide0'),
      document.getElementById('oursSlide1'),
      document.getElementById('oursSlide2'),
    ];
    const megapixelImg = document.getElementById('oursMegapixelImg');

    function getOursImageUrl(idx) {
      var set = oursImageSets[currentOursInput];
      var imgId = set.ids[idx % set.ids.length];
      return set.path + imgId + '.png';
    }

    // Update visibility and highlight state of slide items
    function updateSlideStates() {
      var visibleCount = Math.min(generatedCount, 3);
      slideItems.forEach(function(item, i) {
        if (!item) return;
        if (i < visibleCount) {
          item.classList.remove('ours-slide-hidden');
        } else {
          item.classList.add('ours-slide-hidden');
        }
        // The last visible item (newest) gets the 'current' highlight
        if (i === visibleCount - 1) {
          item.classList.add('ours-slide-current');
        } else {
          item.classList.remove('ours-slide-current');
        }
      });
    }

    function cycleSlides() {
      slideIdx = (slideIdx + 1) % currentSet.total;
      generatedCount = Math.min(generatedCount + 1, currentSet.total);
      var visibleCount = Math.min(generatedCount, 3);

      // Build the buffer: show last `visibleCount` generated images
      // The newest is at position visibleCount-1
      slideItems.forEach(function(item, i) {
        if (!item) return;
        if (i < visibleCount) {
          item.style.opacity = '0';
          (function(el, idx) {
            setTimeout(function() {
              // Buffer: slot 0 = oldest of the 3, slot visibleCount-1 = newest
              var imgIdx = slideIdx - (visibleCount - 1 - idx);
              if (imgIdx < 0) imgIdx += currentSet.ids.length;
              el.src = getOursImageUrl(imgIdx % currentSet.ids.length);
              el.style.opacity = '1';
            }, 150);
          })(item, i);
        } else {
          item.style.opacity = ''; // let CSS class control hidden items
        }
      });

      updateSlideStates();
      if (frameCounter) frameCounter.textContent = (slideIdx + 1);

      // Update the megapixel zoom to show the current (newest) image
      if (megapixelImg) {
        megapixelImg.src = getOursImageUrl(slideIdx % currentSet.ids.length);
      }
    }

    setInterval(cycleSlides, CYCLE_INTERVAL);

    // Input selector for ours card
    const oursInputThumbs = document.querySelectorAll('.ours-input-thumb');
    const oursInputPreview = document.getElementById('oursInputPreview');
    const inputPaths = ['static/images/teaser/ours/succulent/input.png', 'static/images/teaser/ours/yosemite/input.png', 'static/images/teaser/ours/terrace/input.png', 'static/images/teaser/ours/moon/input.png'];
    oursInputThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        oursInputThumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        currentOursInput = parseInt(thumb.dataset.input);
        currentSet = oursImageSets[currentOursInput];
        slideIdx = 0;
        generatedCount = 1; // reset to progressive reveal
        if (frameCounter) frameCounter.textContent = '1';
        if (oursResBadge) oursResBadge.textContent = currentSet.res + ' px';
        if (oursInputPreview) oursInputPreview.src = inputPaths[currentOursInput];
        // Show only first image
        slideItems.forEach(function(item, i) {
          if (item) {
            item.src = getOursImageUrl(0);
            item.style.opacity = ''; // clear inline opacity so CSS class takes effect
          }
        });
        updateSlideStates();
        // Update full-res preview
        if (megapixelImg) megapixelImg.src = getOursImageUrl(0);
      });
    });
  }

  // ===== Motivation figure: static/video toggle =====
  const playBtn = document.getElementById('playMotivationBtn');
  const backBtn = document.getElementById('backToStaticBtn');
  const motivStatic = document.getElementById('motivationStatic');
  const motivVideo = document.getElementById('motivationVideo');
  if (playBtn && backBtn) {
    playBtn.addEventListener('click', function() {
      motivStatic.classList.add('hidden');
      motivVideo.classList.remove('hidden');
      var vid = motivVideo.querySelector('video');
      vid.play().catch(function() {}); // ignore autoplay block
    });
    backBtn.addEventListener('click', function() {
      var vid = motivVideo.querySelector('video');
      vid.pause();
      vid.currentTime = 0;
      motivVideo.classList.add('hidden');
      motivStatic.classList.remove('hidden');
    });
  }

  // ===== Method figure: static/video toggle =====
  const playMethodBtn = document.getElementById('playMethodBtn');
  const backMethodBtn = document.getElementById('backToMethodStaticBtn');
  const methodStatic = document.getElementById('methodStatic');
  const methodVideo = document.getElementById('methodVideo');
  if (playMethodBtn && backMethodBtn) {
    playMethodBtn.addEventListener('click', function() {
      methodStatic.classList.add('hidden');
      methodVideo.classList.remove('hidden');
      var vid = methodVideo.querySelector('video');
      vid.play().catch(function() {});
    });
    backMethodBtn.addEventListener('click', function() {
      var vid = methodVideo.querySelector('video');
      vid.pause();
      vid.currentTime = 0;
      methodVideo.classList.add('hidden');
      methodStatic.classList.remove('hidden');
    });
  }
});

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Sticky Section Nav =====
(function() {
  var nav = document.getElementById('sectionNav');
  if (!nav) return;
  var links = nav.querySelectorAll('.section-nav__link');
  var sections = [];
  links.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  var lastActive = null;

  function update() {
    // Highlight active section
    var current = null;
    for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].el.getBoundingClientRect();
      if (rect.top <= 100) { current = sections[i]; break; }
    }
    if (current !== lastActive) {
      links.forEach(function(l) { l.classList.remove('active'); });
      if (current) current.link.classList.add('active');
      lastActive = current;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

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

/* ===== Application Tabs ===== */
document.querySelectorAll('.app-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    // Deactivate all tabs and panels
    document.querySelectorAll('.app-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.app-panel').forEach(function(p) { p.classList.remove('active'); });
    // Activate clicked tab and corresponding panel
    tab.classList.add('active');
    var panelId = 'app-' + tab.getAttribute('data-app');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  });
});
