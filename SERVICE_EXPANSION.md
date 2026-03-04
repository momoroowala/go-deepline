# Service Expansion - Implementation Guide

## OVERVIEW
Expand the Deepline Operations homepage to balance between:
1. **Revenue recovery / customer analytics** (existing strength)
2. **Task automation audits** (new $500 tier)  
3. **Operational tools** (auto quoting, truck logistics, dashboards)

The site currently focuses ONLY on customer churn/revenue recovery. We need to broaden it to show we also do operational automation for distributors.

## FILE: index.html (single-page site, everything is in one file)

---

## CHANGE 1: Add New Service Cards to the Services Section

The services section currently has 4 cards focused only on revenue recovery. We need to ADD 2-3 new service cards AND restructure the existing ones slightly. The services grid should become 3 columns (for 6 cards) or keep 2 columns with 6 cards.

### NEW SERVICE CARD: Operations & Task Automation Audit ($500)
- **Icon:** clipboard/checklist icon
- **Title:** "Operations & Task Automation Audit"
- **Price badge:** "$500 one-time" (green badge, similar to the "free-badge" style)
- **Description:** "We walk through your daily operations and identify the 5-10 tasks burning the most hours. You get a prioritized report showing exactly what to automate first and the expected time savings."
- **Features list:**
  - Full workflow audit of quoting, ordering, and fulfillment processes
  - Time-cost analysis of manual tasks (hours wasted per week)
  - Prioritized automation roadmap with ROI estimates
  - Tool recommendations matched to your tech stack
  - 30-day action plan you can start immediately
- **Preview mockup:** A simple audit report preview showing tasks like "Manual Quote Generation: 12 hrs/week → 1 hr/week" with progress bars or before/after comparisons
- **CTA link:** "Get Your Audit →"

### NEW SERVICE CARD: Auto-Quoting System
- **Icon:** calculator/dollar icon
- **Title:** "Automated Quoting & Pricing"
- **Description:** "Stop spending hours on quotes. Our system pulls your pricing rules, customer history, and inventory levels to generate accurate quotes in seconds. Handles tiered pricing, volume discounts, and customer-specific rates."
- **Features list:**
  - Customer-specific pricing with historical discount logic
  - Real-time inventory check during quote generation
  - Automatic margin protection and floor price enforcement
  - Quote-to-order conversion tracking
  - Integration with QuickBooks and existing systems
- **Preview mockup:** Keep the existing quoting interface animation (it's already great) or enhance it
- **CTA link:** "See How It Works →"

### NEW SERVICE CARD: Truck Logistics & Route Planning
- **Icon:** truck/map icon
- **Title:** "Delivery Route Optimization"
- **Description:** "Reduce fuel costs and delivery times. Our route planning tools optimize your fleet's daily routes based on order priority, location clusters, and time windows. Most distributors save 15-25% on fuel within 60 days."
- **Features list:**
  - Daily route optimization for your delivery fleet
  - Priority-based delivery scheduling (VIP accounts first)
  - Fuel cost tracking and savings reporting
  - Delivery time window management
  - Real-time route adjustments for same-day orders
- **Preview mockup:** Keep the existing route map animation (it's already excellent)
- **CTA link:** "Optimize Routes →"

### NEW SERVICE CARD: Warehouse & Sales Dashboard
- **Icon:** bar chart/monitor icon  
- **Title:** "Operations Command Center"
- **Description:** "One dashboard for everything. See warehouse throughput, sales pipeline, delivery status, and customer health in real time. Built for COOs who need answers without digging through spreadsheets."
- **Features list:**
  - Real-time warehouse pick/pack/ship metrics
  - Sales rep performance and pipeline tracking
  - Delivery status and on-time performance
  - Inventory levels and reorder alerts
  - Customer health scores and at-risk alerts
- **Preview mockup:** Use the existing COO dashboard animation (already built in CSS)
- **CTA link:** "See the Dashboard →"

### Restructure Existing Cards
Keep the existing 4 cards (Customer Data Diagnostic, Re-engagement Campaigns, Revenue Intelligence Dashboard, Full Revenue Recovery Retainer) but they should coexist with the new cards. 

Organize the 6-8 service cards into two groups with headings:
- **"Revenue Recovery"** (existing 4 cards, maybe condense to 3)
  - Customer Data Diagnostic (keep)
  - Re-engagement Campaigns (keep)
  - Revenue Intelligence Dashboard + Full Retainer (combine into one premium card)
- **"Operations & Automation"** (new cards)
  - Operations & Task Automation Audit ($500)
  - Automated Quoting & Pricing
  - Delivery Route Optimization
  - Operations Command Center

Use a sub-heading or tab-like layout to separate the two groups. Or just use section headers within the services section.

---

## CHANGE 2: Update Case Studies to Balance Themes

Currently all 3 case studies are about customer reactivation/churn. Update them to cover:

1. **Case Study 1: Keep** "Food Distributor" customer reactivation story (existing, it's good)
2. **Case Study 2: Replace** with a task automation story:
   - **Tag:** "Task Automation"
   - **Title:** "Electrical Supply Distributor"
   - **Story:** "A 30-employee electrical supply distributor was spending 14 hours per week on manual quoting alone. After implementing automated pricing with customer-specific rules and inventory checks, quote generation dropped to under 2 hours per week. Reps redirected that time to calling dormant accounts, generating $340K in recovered revenue in 6 months."
3. **Case Study 3: Replace** with an operations/dashboard story:
   - **Tag:** "Operations Visibility"  
   - **Title:** "HVAC Parts Distributor"
   - **Story:** "An HVAC parts distributor had zero visibility into which trucks were profitable and which routes were losing money. Our operations dashboard revealed 3 routes running at negative margin. Route optimization and customer re-clustering saved $89K annually in fuel and labor costs while improving on-time delivery from 78% to 96%."

---

## CHANGE 3: Update the Problems Section

The 3 problem cards currently focus only on customer churn. Broaden them:

1. **Keep** "Customers Disappear Without Warning" (good)
2. **Change** "Your Data Is Trapped in QuickBooks" → "Your Team Is Drowning in Manual Work"
   - New copy: "Quoting takes hours. Route planning is guesswork. Your best people spend more time on spreadsheets than on customers. Every manual process is revenue you're not earning."
3. **Change** "You're Reacting, Not Preventing" → "You Can't See What's Actually Happening"
   - New copy: "No real-time view of operations. No early warning when customers slip. No way to know which routes are profitable. You're making decisions based on last month's numbers, not today's reality."

---

## CHANGE 4: Update Hero Subtitle

Current: "Most distributors lose 15-25% of their customers every year..."
New: "Most distributors lose 15-25% of their customers every year. The ones who survive are automating everything from quoting to route planning to customer recovery. We build those systems."

---

## CHANGE 5: Update Trust Badges

Add 1-2 new trust badges related to automation:
- "90% Less Manual Work" / "Average task automation reduces manual hours by 90%"
- "15-25% Fuel Savings" / "Route optimization delivers measurable savings in 60 days"

---

## CHANGE 6: Update the Stats Ticker

Add automation-related stats to the scrolling ticker:
- "14 hours/week average time spent on manual quoting for mid-size distributors"
- "15-25% fuel savings from route optimization (Fleet Management Association)"
- "90% of distributor operations tasks can be automated with existing tools"

---

## DESIGN RULES
- Match existing design system exactly (colors, fonts, animations, card styles)
- Service cards should follow the same structure: icon, title, description, features list, preview mockup, CTA link
- New preview mockups should use the existing dark background style (linear-gradient #0f172a to #1e293b)
- Keep all existing CSS classes and animations, add new ones as needed
- The $500 audit card should have a visible price badge to anchor pricing
- DO NOT break any existing functionality or animations

## AFTER ALL CHANGES
- Verify the file renders correctly (it's a static HTML file, just open in browser)
- git add -A && git commit -m "feat: expand services - task automation audit, auto quoting, route planning, operations dashboard"
- DO NOT push
