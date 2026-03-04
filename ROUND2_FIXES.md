# Round 2 Fixes

## 1. Change Hero Headline
Current: "Stop Losing Customers You Already Won."
New: Something that covers ALL services (revenue recovery + automation + logistics + dashboards).
Suggestion: "Run Your Distribution Operation Like It's 2026." or "Your Distribution Business, Fully Automated." or "Stop Running Your Distribution Business on Spreadsheets."
Pick the punchiest one. The subtitle should cover the range: customer recovery, automated quoting, route optimization, and real-time dashboards.

## 2. Change Free Diagnostic → $500 Operations Diagnostic
EVERYWHERE on the page where it says "Free Diagnostic" or "Get Your Free Diagnostic":
- Change to "$500 Operations Diagnostic" or "Full Operations Diagnostic — $500"
- The final CTA section at the bottom needs to REALLY sell it. Make it compelling:
  - Price: $500 one-time
  - What they get:
    - Complete customer health analysis (dormant accounts, revenue at risk, priority targets)
    - Full workflow audit (quoting, ordering, fulfillment, delivery)
    - Time-cost analysis of every manual process
    - 90-day implementation playbook with prioritized automation roadmap
    - Full data cleanup roadmap
    - Tool recommendations matched to their tech stack
    - ROI projections for each automation opportunity
  - Make this feel like a steal at $500. Use bullet points, maybe a comparison ("Consultants charge $5-10K for this. We do it for $500 because it's how we earn your trust.")
  - Update the nav CTA button, hero CTA, trust badges section, final CTA section, and any other mentions

## 3. Logistics/Route Optimization Preview — Make it Interactive
The route optimization service card preview needs a REAL animated route being created. Build a compelling animation that shows:
- A map-like dark background with a grid
- A warehouse pin that appears first (labeled "Warehouse — Edison, NJ")
- Then 6-8 delivery stops appearing one by one with labels (restaurant names, distances)
- An animated route line drawing between the stops in optimal order
- A truck emoji/icon moving along the route
- A stats panel that appears at the bottom showing:
  - "12 stops optimized"
  - "47 miles saved vs. original route"  
  - "2.1 hours saved"
  - "$38 fuel savings today"
  - "3 new customers added to route"
- The whole animation should loop every 10-12 seconds
- Make it feel like watching a real route optimizer work in real time

## 4. PERFORMANCE — Make the Site Load Fast
This is critical. The page is laggy because of all the CSS animations, JavaScript, and massive inline styles. Fix it:

### CSS Performance:
- Add `will-change: transform` ONLY to elements that actually animate (not everything)
- Use `transform: translateZ(0)` sparingly for GPU compositing on heavy animations
- Replace `filter: drop-shadow()` with `box-shadow` where possible (cheaper to render)
- Reduce or eliminate animations that run infinitely when not in viewport — use Intersection Observer to only animate elements when they're visible
- Remove duplicate CSS rules (the file likely has redundant styles from multiple rounds of edits)

### JavaScript Performance:
- Wrap ALL animation JavaScript in `requestAnimationFrame` where appropriate
- Use `Intersection Observer` to lazy-start animations only when sections scroll into view
- Stop animations when elements scroll OUT of view (pause infinite animations)
- Debounce scroll event listeners
- Use `passive: true` on scroll/touch listeners
- Defer non-critical JavaScript with setTimeout or requestIdleCallback

### HTML Performance:
- Add `loading="lazy"` to any images
- Add `decoding="async"` to images
- Remove any unused CSS classes/styles from previous iterations
- Minimize DOM complexity where possible (remove unnecessary wrapper divs)

### Animation Performance:
- Only animate `transform` and `opacity` (these are GPU-composited)
- Avoid animating `width`, `height`, `margin`, `padding`, `left`, `top` (causes layout thrashing)
- For the bar charts that animate width, switch to `transform: scaleX()` instead
- Reduce the number of simultaneous infinite animations — the hero alone has like 10 infinite animations running. Keep 2-3 max per viewport.
- Add `@media (prefers-reduced-motion: reduce)` to disable animations for users who want that

### Specific Heavy Animations to Optimize:
- `animated-grid` (infinite transform animation) — simplify or make static
- `hero-ambient` with multiple radial gradients + pulse — reduce gradient count
- Multiple `pulse` animations on status dots — use a single shared animation
- The route map, quoting interface, and integration diagram all have complex infinite animations — pause them when not visible

## AFTER ALL CHANGES:
- Verify the page loads and scrolls smoothly
- git add -A && git commit -m "feat: headline update, $500 diagnostic CTA, route animation, performance optimization"
- DO NOT push
