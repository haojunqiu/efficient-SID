# Efficient-SID Project Website Plan

## Paper Info
- **Title**: Efficient and Training-Free Single-Image Diffusion Models
- **Authors**: Haojun Qiu, Kiriakos N. Kutulakos, David B. Lindell
- **Affiliation**: University of Toronto, Vector Institute
- **Venue**: CVPR 2026 **(Highlight)**
- **URL**: https://haojunqiu.github.io/efficient-SID/

---

## Website Structure (Top to Bottom)

### 1. Hero / Title Section
- Paper title, authors (with links), affiliation, venue badge
- **Highlight badge**: Prominent "CVPR 2026 Highlight" badge/pill near the title (colored, eye-catching)
- Buttons: Paper (arXiv PDF), arXiv, Code (GitHub), Supplementary

### 2. Teaser — Animated "Training-Free" Hook
- **Animation idea**: Split-screen or timeline comparison
  - Left/top: "Trained methods" — a progress bar slowly filling over "10 hours", clock ticking
  - Right/bottom: "Ours" — instantly starts generating, results appear in ~1 second
- Below: a row of diverse outputs from a single input image
- Key message in one line: *"Zero training. One second. Diverse generation."*

### 3. Abstract
- Paper abstract text, standard layout

### 3.5. Why Single-Image Generative Modeling Still Matters
- **Purpose**: Preempt the "why not just use Stable Diffusion / FLUX?" question
- **Key points (aligned with video script Section 1b)**:
  - **The mosaic example**: Show reference mosaic → ask large models to apply its style → they produce *a* mosaic but not *this* mosaic (wrong tiles, invented grout, drifted palette)
  - **Why large models fail here**: They condition on the reference via cross-attention — they *see* it but don't *sample from* it. They still generate through their internet-scale prior ("knows what mosaic means generically")
  - **Our method**: Samples directly from the patch distribution of the reference — output is literally composed of patches from the input (traceable back to source)
  - **The general principle**: Any time your "dataset" is a single observation — Mars rover panorama, hyperspectral satellite scan, rare histology slide, unique painted canvas — the whole internet is the wrong prior. The right prior is the patches of the image in front of you.
  - **Complementary to large models**: Not adversarial — can be combined (e.g., FLUX + our patch prior for inpainting/outpainting). Position as a lightweight, private, faithful alternative when internal statistics matter.
- **Figure idea**:
  - Left: Reference mosaic image
  - Middle: ChatGPT / large model attempts (looks like *a* mosaic, not *this* mosaic)
  - Right: Our result (tiles, grout, colors all traceable to source)
  - Caption: "Large models *see* the reference. We *sample* from it."
- **Tone**: Dramatic — set up the failure of large models first, then resolve with our approach

### 4. Method — Closed-Form Denoiser + Why It Works Here

#### 4a. The Narrative / Conflict Setup
- **The known result**: The "closed-form" (or "memorization") denoiser is well-studied in diffusion theory — it's the optimal denoiser when you simply memorize your training set. For large datasets (ImageNet: N large, D large), it's:
  - Computationally intractable (N×D attention-like computation, massive memory)
  - Theoretically interesting but practically useless
  - Associated with *memorization* — seen as the failure mode, not a feature
- **The twist**: For patches from a single image, everything changes:
  - D is small (patch dimensionality, e.g. 7×7×3 = 147)
  - N is manageable (thousands of patches, not millions of images)
  - → The closed-form denoiser becomes **computable and practical**
- **No memorization at the image level**: 
  - Each patch prediction is a weighted average of training patches (yes, "memorized")
  - But when stitched back into a full image, the *combination* of overlapping patches creates novel global structure
  - This aligns with the argument that diffusion model generalization arises from **locality** — local patch statistics compose into globally novel images
- **Presentation idea**: 
  - Visual showing ImageNet-scale (huge N, huge D) → ✗ intractable
  - Then single-image patches (small N, small D) → ✓ fast and exact
  - Then: "memorized patches" → "novel images" (showing diverse outputs that don't exist in the input)

#### 4b. Method Flow — Animated Pipeline Diagram
- **Animation idea**: Step-by-step reveal of the pipeline
  1. Input image appears
  2. Patches extracted (zoom-in effect, patches highlighted on image)
  3. Patch dataset visualized as a collection
  4. Noisy patch → closed-form denoiser formula → clean patch (weights lighting up)
  5. Coarse-to-fine: small image generated first, then progressively upsampled
  6. Final output appears
- Could be CSS/JS animation triggered on scroll, or a looping MP4/GIF
- Fallback: static method figure for no-JS / slow connections

### 5. Acceleration Techniques — The "Efficient" Part
- **Motivation**: Closed-form denoiser involves attention-like computation (N² cost over all patches) — naive approach doesn't scale to high resolution
- **Content**:
  - Diagram/GIF showing the bottleneck: patch-level attention matrix growing with resolution
  - Then show the 3 acceleration strategies stacking:
    1. **Fused attention kernels (FlashAttention)** — GPU-efficient exact computation
    2. **Latent space diffusion (VAE)** — compress patches before denoising, reduce N
    3. **Approximate nearest neighbors (ANN)** — skip far-away patches, reduce N² → N·k
  - Final result: megapixel in 1s, gigapixel in minutes
- **Presentation options**:
  - Animated bar chart: resolution scaling (256px → 1K → 4K → gigapixel) with time for naive vs accelerated
  - Or: pipeline diagram where each acceleration "unlocks" the next resolution tier
  - Reference figure: `figures/vae-acceleration` from paper
- **Placement**: After method, before results — bridges "how it works" to "look what it can do at scale"

### 6. Results Gallery
- **TBD** — order and content to be decided later
- Possible subsections: unconditional generation, high-res, stylization, applications, comparisons
- Will fill in once figures/animations are ready

### 7. Comparison with Baselines
- Side-by-side visual comparison (ours vs SinDDM, SinFusion, etc.)
- Speed/quality table:
  | Method | Training Time | Inference Time | SIFID ↓ |
  |--------|--------------|----------------|---------|
  | SinDDM | 10 hrs | 18.5s | 0.089 |
  | Ours | **0** | **1s** | **0.054** |

### 8. Video Presentation
- Embedded YouTube video (5-min presentation when ready)

### 9. BibTeX
- Copy-to-clipboard citation block

---

## Sections REMOVED from Template (can add back later)
- "More Works" floating dropdown
- Video carousel (second carousel)
- Poster embed section
- Image carousel (replaced by structured results gallery)

---

## Animated Elements Plan

### Animation 1: Training Time Comparison (Teaser)
- **Type**: CSS animation + JS (triggered on page load)
- **Concept**: 
  - Two cards side by side
  - Card 1 "Trained Methods": Shows a loading spinner / progress bar crawling, text "Training... 10 hours", grayed out results
  - Card 2 "Ours (Training-Free)": Immediately shows a checkmark, results pop in with a fade, text "Ready in 0s → Generate in 1s"
  - Could use a counter animation: 0:00:00 counting up for trained, while ours shows instant results
- **Fallback**: Static comparison image

### Animation 2: Method Pipeline (Method Section)
- **Type**: Scroll-triggered CSS/JS animation or looping video
- **Concept**:
  - Stage 1: Single image slides in
  - Stage 2: Grid overlay appears, patches "pop out"
  - Stage 3: Formula appears, patches flow through denoiser
  - Stage 4: Coarse image forms, then refines step by step
  - Stage 5: Final diverse outputs fan out
- **Implementation options**:
  - Pure CSS with `@keyframes` + Intersection Observer for scroll trigger
  - Lottie animation (if we want smooth vector animation)
  - Pre-rendered MP4 (simplest, most compatible)
- **Fallback**: Static method diagram image

### Animation 3: Coarse-to-Fine Generation (Optional)
- **Type**: Looping GIF/video
- **Concept**: Show the generation process from noise → coarse → fine → final
- Good for demonstrating how global structure emerges first

---

## Engineering Implementation Plan

### Directory Structure

```
efficient-SID/
├── index.html                    # Main page — assembles sections, minimal logic
├── docs/
│   └── plan.md                   # This file
├── static/
│   ├── css/
│   │   ├── bulma.min.css         # Framework (don't touch)
│   │   ├── base.css              # Global variables, typography, utilities
│   │   ├── layout.css            # Section layout, grid systems, responsive
│   │   ├── components.css        # Reusable: buttons, cards, badges, tables
│   │   ├── animations.css        # All @keyframes, transitions, scroll-triggered states
│   │   └── sections/             # Per-section overrides (only if needed)
│   │       ├── teaser.css
│   │       ├── method.css
│   │       └── acceleration.css
│   ├── js/
│   │   ├── main.js               # Entry point: imports, Intersection Observer setup
│   │   ├── animations.js         # Teaser counter, scroll reveals, animation triggers
│   │   ├── utils.js              # copyBibTeX, scrollToTop, lazy loading
│   │   └── vendor/               # Third-party (fontawesome, etc.) — don't touch
│   │       ├── fontawesome.all.min.js
│   │       └── ...
│   ├── images/
│   │   ├── teaser/               # Teaser section assets
│   │   ├── motivation/           # "Why it matters" comparison figure
│   │   ├── method/               # Pipeline diagrams, insight figure
│   │   ├── acceleration/         # Scaling charts, VAE diagram
│   │   ├── results/              # Gallery images (subdirs per category)
│   │   ├── comparison/           # Baseline comparison figures
│   │   └── social_preview.png    # OG image for social sharing
│   └── videos/
│       ├── method_pipeline.mp4   # Animated pipeline (fallback for CSS anim)
│       ├── coarse_to_fine.mp4    # Generation process video
│       └── ...
└── index.html.bak                # Old template (delete once done)
```

### Architecture Principles

1. **Separation of concerns**
   - HTML = structure + content only (no inline styles beyond placeholders)
   - CSS = split by purpose (base/layout/components/animations), not by section
   - JS = minimal, progressive enhancement only (site works without JS)

2. **Easy to add/remove sections**
   - Each section in `index.html` is a self-contained `<section>` block with a clear comment header
   - To add a section: copy a section block, add content, optionally add section-specific CSS
   - To remove: delete the `<section>` block — nothing else breaks

3. **Image management**
   - Images grouped by section in subdirectories (not flat)
   - Naming convention: `{section}/{descriptive-name}.{ext}` (e.g., `teaser/diverse-outputs.webp`)
   - Always provide both WebP + PNG/JPG fallback via `<picture>` element
   - Lazy loading (`loading="lazy"`) for everything below the fold

4. **CSS methodology**
   - BEM-like naming for custom components: `.teaser-card__header`, `.accel-card__icon`
   - CSS custom properties (variables) in `base.css` for theming — change colors in one place
   - No `!important` in custom CSS (only in vendor overrides if unavoidable)
   - Media queries at bottom of each CSS file, grouped by breakpoint

5. **Animation strategy**
   - CSS `@keyframes` for simple loops and transitions
   - Intersection Observer (in `animations.js`) for scroll-triggered reveals
   - Pre-rendered MP4/WebM for complex animations (method pipeline, coarse-to-fine)
   - All animations respect `prefers-reduced-motion` media query
   - Static fallback images always present (animations are progressive enhancement)

6. **No build step** (keep it simple)
   - No webpack, no bundler, no npm
   - Just serve static files (GitHub Pages, any static host)
   - Concatenate CSS via `<link>` tags in order (base → layout → components → animations → sections)
   - If it ever needs a build step later, the file structure is already modular enough to plug into one

### Implementation Order

```
Step 1: Scaffold file structure
  └── Create dirs, split existing index.css into base/layout/components/animations

Step 2: Write index.html skeleton
  └── All sections with semantic markup, placeholder divs for figures
  └── Link all CSS/JS files in correct order
  └── Verify it renders correctly with just text + placeholders

Step 3: Style pass
  └── base.css: variables, typography, resets
  └── layout.css: section spacing, grid, responsive breakpoints
  └── components.css: cards, badges, table, buttons

Step 4: Teaser animation
  └── animations.css: @keyframes for progress bar, counter
  └── animations.js: time counter, Intersection Observer for triggering

Step 5: Section-by-section content
  └── Drop in real figures as they become available
  └── Replace placeholders with <picture> elements
  └── Each section independently testable

Step 6: Polish + deploy
  └── Responsive testing
  └── Performance audit (Lighthouse)
  └── Final deploy to GitHub Pages
```

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build system | None (static) | Simplicity, GitHub Pages, no deps to rot |
| CSS framework | Bulma (keep) | Already there, good grid, light |
| JS framework | None (vanilla) | Only need Observer + small utils |
| Animations | CSS + MP4 hybrid | CSS for simple, video for complex pipeline |
| Image format | WebP primary, PNG fallback | Best size/quality, universal support |
| Font | Inter (keep) | Clean, academic, already loaded |

---

## Implementation Phases

### Phase 1: Content & Structure ← START HERE
- [ ] Fill in all text content (title, authors, abstract, links)
- [ ] Set up correct HTML structure (remove unused sections)
- [ ] Add placeholder images with correct paths
- [ ] Style adjustments (colors, fonts)

### Phase 2: Static Figures
- [ ] Export teaser figure (PNG)
- [ ] Export method diagram (PNG)
- [ ] Export result grids (PNG)
- [ ] Export comparison figures (PNG)
- [ ] Add all images to static/images/

### Phase 3: Animations
- [ ] Implement training-time comparison animation (CSS/JS)
- [ ] Implement method pipeline animation (decide format)
- [ ] Add scroll-triggered reveals for sections
- [ ] Test on mobile

### Phase 4: Polish
- [ ] Responsive design check
- [ ] Performance optimization (lazy loading, compressed images)
- [ ] SEO metadata filled in
- [ ] Social preview image (1200x630)
- [ ] Deploy & test live

---

## Technical Notes
- Framework: Static HTML + Bulma CSS + vanilla JS
- No build step — just serve static files (GitHub Pages)
- Animations: CSS @keyframes + Intersection Observer + MP4 for complex ones
- Images: WebP with PNG fallback, lazy loading below fold
- All animations respect `prefers-reduced-motion`
- Site fully functional without JavaScript (progressive enhancement)
