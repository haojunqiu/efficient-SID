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
Subsections with image grids or carousels:

#### 6a. Unconditional Generation
- Input image → 4-6 diverse outputs (grid layout)
- Multiple examples (different textures, scenes)

#### 6b. High-Resolution Generation
- Megapixel examples (with zoom-in crops to show detail)
- Gigapixel example (maybe interactive zoom?)

#### 6c. Text-Guided Stylization
- Input + text prompt → stylized output
- Examples: "Van Gogh", "watercolor", etc.

#### 6d. Applications (compact grid)
- Symmetrization, retargeting, structural analogies, tiling
- Before/after side-by-side

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
- Framework: Static HTML + Bulma CSS + vanilla JS (from template)
- No build step needed — just serve static files
- Animations: prefer CSS + Intersection Observer (lightweight, no dependencies)
- Images: use WebP with PNG fallback for quality + size
- Videos: MP4 (H.264) for compatibility
