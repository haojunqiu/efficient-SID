# Teaser Section: Implementation Plan

## Concept
Side-by-side comparison: SinDDM (trained) vs Ours (training-free).
The contrast hits on **two axes**:
1. **Training time**: SinDDM needs ~8h training; ours needs 0.
2. **Resolution ceiling**: SinDDM caps at ~250×250; ours scales to megapixel.

---

## SinDDM Card (Left)

### Behavior
1. On page load, a progress bar begins crawling and a clock counts up from `0:00:00` toward `8:00:00`.
2. The progress bar fills proportionally — after 60s of real time it's at ~0.2% (barely visible movement). This makes the "wait" feel real.
3. Below the progress bar: 3 grayed-out placeholder thumbnails (250×250) representing locked results.
4. Text: "Training... estimated 8 hours remaining"
5. **Easter egg / reveal**: After **45 seconds** on the page, a "⏩ Skip training" button fades in. Clicking it:
   - Instantly fills the progress bar to 100%
   - Clock snaps to `8:00:00`
   - Text changes to "Training complete! Generating..."
   - After a 1.6s delay (real inference time), the 3 placeholder thumbnails reveal actual SinDDM results (250×250, visibly small)
   - Footer updates to show: `8h training | 1.6s inference | 250×250 max`
6. If the user does NOT click skip, the results auto-reveal after **90 seconds** with the same animation.

### Stats Footer
- `~8 hours training`
- `1.6s inference`  
- `250×250 only`

---

## Ours Card (Right)

### Behavior
1. On page load (immediately, no delay):
   - Shows a small input image thumbnail at top.
   - Below it: a slideshow grid (2×2 or 1×3) cycling through generated outputs.
   - Outputs cycle at **~1 frame per second** (matching real inference speed).
   - Each new image fades/slides in to give a sense of continuous generation.
2. After cycling through low-res outputs for ~5 seconds, the card "upgrades":
   - Text: "Scaling to megapixel..."
   - The display area expands and shows a larger, high-res result.
   - A zoom crop inset appears to highlight fine detail.
3. The slideshow continues looping (low-res cycling → megapixel reveal → loop).

### Stats Footer
- `0s training`
- `<1s inference`
- `Up to megapixel+`

---

## Image Assets Needed

### Directory: `static/images/teaser/`

```
teaser/
  input_01.jpg          # Input image (shown in "ours" card)
  ours_01_001.jpg       # Generated output 1 (250×250 for cycling)
  ours_01_002.jpg       # Generated output 2
  ...
  ours_01_020.jpg       # Generated output 20
  ours_01_highres.jpg   # Megapixel result (or large crop)
  ours_01_crop.jpg      # Zoom crop from megapixel
  sinddm_01_001.jpg    # SinDDM result 1 (250×250)
  sinddm_01_002.jpg    # SinDDM result 2
  sinddm_01_003.jpg    # SinDDM result 3
```

For now: use colored placeholder divs until real images are provided.

---

## Implementation Steps

### 1. HTML (`index.html`)
- Restructure teaser cards:
  - SinDDM card: progress bar + clock + placeholder grid + skip button + stats
  - Ours card: input thumbnail + slideshow container + resolution upgrade area + stats

### 2. JS (`static/js/main.js`)
- **SinDDM logic**:
  - Clock counter (already exists, update target to 8h)
  - Progress bar: fill width = `(elapsedSeconds / (8*3600)) * 100`%
  - Skip button: appears at 45s, triggers reveal sequence
  - Auto-reveal at 90s fallback
  - Reveal animation: fill bar → show results with 1.6s delay
- **Ours logic**:
  - Slideshow: cycle through images array at 1 FPS
  - After 5s: trigger megapixel "upgrade" animation
  - Loop back after showing high-res for 4s

### 3. CSS (`static/css/animations.css` + `components.css`)
- Update progress bar to fill proportionally (not loop at 35%)
- Skip button styling (fade-in after delay)
- Slideshow transitions (crossfade)
- Megapixel upgrade animation (scale + crop reveal)
- Resolution badge styling
- Ensure SinDDM results look small (250×250 in a larger container = clearly lower-res)

---

## Key Design Decisions
- **No infinite progress loop**: bar fills proportionally to real 8h, making it feel impossibly slow.
- **Skip button as UX mercy**: nobody waits 90s, the button is the expected interaction.
- **1.6s inference delay**: after skip, the 1.6s pause before results appear sells the "even inference is slower" point.
- **Resolution contrast is visual**: SinDDM results are tiny thumbnails; ours fills the card with high-res detail.
