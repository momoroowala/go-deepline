# Performance Optimization - Based on 3perf.com/talks/web-perf-101/

This is a STATIC single-file HTML site (no bundler, no webpack). Apply relevant optimizations only.

## 1. CSS: Critical CSS Approach
- Extract the CSS needed for above-the-fold content (hero section, nav) and keep it inline in <style> in <head>
- Move ALL remaining CSS (service cards, case studies, tools, about, footer, animations) into a separate file: `styles.css`
- Load styles.css with the deferred pattern:
  ```html
  <link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
  ```
- This means the page renders the hero INSTANTLY while remaining styles load in background

## 2. CSS: Minify Non-Critical CSS
- Remove all unnecessary whitespace, newlines, and comments from the extracted styles.css
- Remove duplicate CSS rules (there are likely many from multiple rounds of edits)
- Remove unused CSS selectors that no longer match any HTML elements

## 3. JavaScript: Defer All Scripts  
- ALL <script> tags should have `defer` attribute (NOT async, because order matters for our animations)
- Move all inline <script> blocks to the end of <body> OR into a deferred external file `scripts.js`
- This prevents JS from blocking HTML parsing and first paint

## 4. JavaScript: IntersectionObserver for Lazy Animations
- Wrap ALL animation code in IntersectionObserver callbacks
- Animations should ONLY start when their section scrolls into view
- Animations should PAUSE when scrolled out of view (stop running infinite animations offscreen)
- This is the single biggest perf win for this site since there are 10+ infinite CSS animations running simultaneously

## 5. CSS: Only Animate Compositor Properties
- Audit all CSS animations. Only `transform` and `opacity` should be animated
- Replace any animations on `width`, `height`, `margin`, `top`, `left`, `right`, `bottom` with `transform: translate/scale` equivalents
- Add `will-change: transform` ONLY to elements that actually animate (not everything)
- This keeps animations on the GPU compositor thread, preventing jank

## 6. HTML: Preload Critical Resources
- Add `<link rel="preload">` for the hero background gradient and any fonts
- Add `loading="lazy"` and `decoding="async"` to the Mo headshot image
- Preconnect to external domains: `<link rel="preconnect" href="https://tools.deeplineop.ai">`

## 7. CSS: prefers-reduced-motion
- Add a `@media (prefers-reduced-motion: reduce)` block that disables ALL CSS animations
- Users who prefer reduced motion should see a static version of the site

## 8. JavaScript: Debounce and Passive Listeners  
- All scroll event listeners should use `{ passive: true }`
- Debounce any scroll-based calculations with requestAnimationFrame
- Remove any redundant scroll listeners

## 9. HTML: Minify the HTML
- Remove unnecessary whitespace between tags
- Remove HTML comments
- Keep the file readable enough but strip obvious bloat

## 10. Reduce DOM Complexity
- Remove unnecessary wrapper divs that add nothing
- Simplify deeply nested structures where possible

## IMPORTANT CONSTRAINTS:
- This is a SINGLE index.html file being split into index.html + styles.css + scripts.js
- The site must look and function IDENTICALLY after optimization
- Test by opening index.html locally — everything must work
- Do NOT break any animations, interactions, or layouts
- The mo-headshot.png image must still load correctly

## AFTER ALL CHANGES:
- Verify the site renders correctly
- git add -A && git commit -m "perf: critical CSS split, deferred scripts, lazy animations, compositor-only transforms"
