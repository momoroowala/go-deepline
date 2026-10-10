/* =====================================================================
   AI Ops Scorecard: content + rules. EDIT THIS FILE to change wording,
   options, examples, weights or assumptions. No code changes needed.

   Tokens you can use in any string:
     {first} {company} {noun} {clients} {unit} {tools} {crm} {accounting}
     {team} {hours} {cost} {perPerson}
   Every client example below refers to a real Deepline build. Don't add
   numbers that aren't confirmed.
   ===================================================================== */
window.SCORECARD = {
  calendly: 'https://calendly.com/mo-deeplineop/30min',

  /* ---------- assumptions (shown to the visitor in the report) ---------- */
  assumptions: {
    defaultHourlyCost: 45,          // loaded $/hr default; visitor can change it
    weeksPerYear: 52,
    // share of the manual hours you entered that a well-designed system typically takes back
    recoverable: {                 // [low, high], picked by data status
      connected: [0.35, 0.65],
      partial:   [0.30, 0.60],
      siloed:    [0.25, 0.50],
    },
    integratedAiDiscount: 0.75,     // if they already run integrated AI, scale the range down
    roiNote: 'We scope every engagement to return 10–30x the setup fee. That is the target we design against, not a guarantee. Results vary by business.',
  },

  /* ---------- question options ---------- */
  teamSizes: [
    { id: '1-5', label: '1–5 people', mid: 4 },
    { id: '6-15', label: '6–15 people', mid: 10 },
    { id: '16-50', label: '16–50 people', mid: 30 },
    { id: '51-200', label: '51–200 people', mid: 110 },
    { id: '200+', label: '200+ people', mid: 250 },
  ],
  revenueBands: [
    { id: '<1m', label: 'Under $1M' },
    { id: '1-5m', label: '$1M–$5M' },
    { id: '5-20m', label: '$5M–$20M' },
    { id: '20-50m', label: '$20M–$50M' },
    { id: '50m+', label: '$50M+' },
    { id: 'na', label: 'Prefer not to say' },
  ],
  tools: [
    { id: 'email', label: 'Gmail / Outlook' },
    { id: 'accounting', label: 'QuickBooks / Xero' },
    { id: 'crm', label: 'A CRM (HubSpot, GoHighLevel, Salesforce…)' },
    { id: 'shopify', label: 'Shopify' },
    { id: 'chat', label: 'Slack / Teams' },
    { id: 'drive', label: 'Google Drive' },
    { id: 'sheets', label: 'Spreadsheets for everything' },
    { id: 'other', label: 'Other' },
  ],
  sopLevels: [
    { v: 1, label: 'In people\u2019s heads', hint: 'Almost nothing is written down' },
    { v: 2, label: 'A few notes', hint: 'Scattered docs, mostly out of date' },
    { v: 3, label: 'Some SOPs', hint: 'Key processes written, not all followed' },
    { v: 4, label: 'Mostly documented', hint: 'Most workflows have a current SOP' },
    { v: 5, label: 'Fully documented', hint: 'SOPs are current and the team uses them' },
  ],
  dataStatus: [
    { id: 'siloed', label: 'Siloed', hint: 'Tools don\u2019t talk; we re-type data between them' },
    { id: 'partial', label: 'Partly connected', hint: 'A few integrations, lots of exports' },
    { id: 'connected', label: 'Connected', hint: 'Core systems share data automatically' },
  ],
  aiUse: [
    { id: 'none', label: 'None yet' },
    { id: 'adhoc', label: 'ChatGPT, ad-hoc', hint: 'People use it on the side' },
    { id: 'some', label: 'Some automations', hint: 'Zapier, a few workflows' },
    { id: 'integrated', label: 'Integrated', hint: 'AI is wired into core systems' },
  ],

  /* ---------- real builds used as examples ---------- */
  examples: {
    ivy_outreach: 'What this looked like at AbuvThePar ($50M+ Amazon operator): we built Ivy\u2019s call queue, and weekly outreach went from 400 to 1,050 touches, with calls up from 30 to 250, on the same team.',
    ivy_po: 'What this looked like at AbuvThePar: Ivy\u2019s PO intake and review took purchase orders from 6 to 25\u201335 a week, with no headcount added.',
    ivy_invoice: 'What this looked like at AbuvThePar: reviewed purchase orders flow straight into drafted Xero invoices inside Ivy, one platform instead of spreadsheets.',
    ivy_kpi: 'What this looked like at AbuvThePar: Ivy sends the owner a weekly KPI recap, pulled from the same system the team works in.',
    ivy_assistant: 'What this looked like at AbuvThePar: the team works with a drafts-only AI assistant inside Ivy. It drafts, and a person approves.',
    ivy_inbox: 'What this looked like at AbuvThePar: Ivy runs the offers inbox in the same platform as the call queue, PO intake and invoicing, so nothing lives in scattered threads.',
    b2b_orders: 'What this looked like at Bean2Bean Coffee Co.: we built Gmail order intake (466 order-related emails processed in 30 days) feeding a review dashboard that learns from every edit, then QuickBooks.',
    b2b_pricebook: 'What this looked like at Bean2Bean Coffee Co.: price-book checks caught 35 errors, recovering about $1.8K a year in underbilling.',
    b2b_portal: 'What this looked like at Bean2Bean Coffee Co.: 82 wholesale accounts set up on a client portal with \u201cFill my usual order\u201d, synced to QuickBooks.',
    b2b_revenue: 'What this looked like at Bean2Bean Coffee Co.: we built a customer revenue dashboard with cross-sell and account-activation breakdowns, so the team knows exactly who to call.',
    ko_collateral: 'What this looked like at KO Alliance: we built the sponsorship engine (pitch decks, contracts, ICP lead lists and a partnership-plan generator), and the Plantiva sponsorship closed.',
    nc_content: 'What this looked like at NutraChurn: automated SEO article and backlink pipelines that keep publishing without a content team.',
    nc_report: 'What this looked like at NutraChurn: an automated owner report lands every week, with no one assembling it by hand.',
  },

  /* ---------- industries ----------
     noun: what we call their business · clients: who they serve · unit: the work item
     context: one line on what matters in this industry
     guardrail: the industry-specific guardrail for the Design phase
     sinks: options for "biggest time sinks" (pick up to 3). Each maps to a leak:
       leak  = how we name the problem   fix = what we'd build   ex = example key
       tools = which of their tools it touches (for personalization)            */
  // "Other" industry: used when someone types their own industry (e.g. "funeral home").
  // Tokens: {aIndustry} = "a funeral home", {industry} = "funeral home".
  otherIndustryContext: 'As {aIndustry}, {company} has its own workflows, but the leaks we find in almost every business are the same three: work re-typed between tools, follow-ups that depend on memory, and numbers nobody sees until month-end. The Teardown is where we map how they show up at {company}.',

  // Typed-in time sinks ("Something else"). The first rule whose pattern matches the text wins; the last is the default.
  // {sink} = exactly what they typed.
  customSinkRules: [
    { match: 'schedul|calendar|booking|appointment|dispatch|meeting|reschedul', fix: 'Requests for \u201c{sink}\u201d land in one queue with suggested times and drafted confirmations, synced to your calendar, so nobody coordinates it by hand.', ex: 'ivy_assistant' },
    { match: 'invoic|billing|bill\\b|payment|collect|chas|receivabl|deposit', fix: 'Invoices and payment reminders for \u201c{sink}\u201d generated from the job record in {accounting}, sent on a schedule, with a person approving anything unusual.', ex: 'ivy_invoice' },
    { match: 'email|inbox|call|phone|voicemail|text|messag|question|inquir', fix: 'A drafts-only assistant that takes the incoming side of \u201c{sink}\u201d: it sorts the calls, messages and questions, drafts each reply from your SOPs and queues it for your approval.', ex: 'ivy_inbox' },
    { match: 'report|dashboard|kpi|numbers|metric|forecast', fix: 'One live dashboard for \u201c{sink}\u201d, plus a weekly recap written for the owner, so nobody rebuilds the numbers by hand.', ex: 'ivy_kpi' },
    { match: 'paperwork|form|document|contract|permit|certificate|data entry|entering|re-?typ|intake|order|purchase|records?\\b', fix: 'The paperwork behind \u201c{sink}\u201d parsed once into a structured record and pushed to the right tool, with the checks your process requires.', ex: 'b2b_orders' },
    { match: 'follow|lead|quote|estimate|proposal|outreach|sales|prospect', fix: 'Every \u201c{sink}\u201d item becomes tracked work with an owner, a next step and a drafted follow-up, so nothing depends on memory.', ex: 'ivy_outreach' },
    { match: 'coordinat|handoff|hand-off|vendor|supplier|partner|famil|track|logistic', fix: 'One shared tracker for \u201c{sink}\u201d: every party, date and next step in one place, with drafted updates going out on schedule and a person approving each one.', ex: 'ivy_assistant' },
    { match: '', fix: 'We map \u201c{sink}\u201d step by step in the Teardown. The usual fix: capture each request once as a structured record, let an AI employee trained on your SOPs draft the repetitive parts, and keep a person approving anything that goes out, all wired into {tools}.', ex: 'ivy_assistant' },
  ],

  // If two leaks in one report point at the same example, the second uses its alternate (or shows none).
  exampleAlternates: {
    ivy_outreach: 'b2b_revenue', b2b_orders: 'ivy_po', ivy_assistant: 'ivy_inbox', ivy_kpi: 'nc_report',
    ivy_inbox: 'ivy_assistant', b2b_revenue: 'ivy_kpi', ivy_invoice: 'b2b_pricebook', b2b_pricebook: 'ivy_invoice',
    nc_report: 'ivy_kpi', nc_content: 'ko_collateral', ko_collateral: 'nc_content', ivy_po: 'b2b_orders', b2b_portal: 'b2b_orders',
  },

  industries: {
    agency: {
      label: 'Agency', noun: 'agency', clients: 'clients', unit: 'client work',
      context: 'For agencies, margin dies in the hours between the work: reporting, proposals, status updates and onboarding that clients never see but always pay for in slower delivery.',
      guardrail: 'Client-facing copy is checked against each client\u2019s brand rules, and an account lead approves it before anything goes out.',
      sinks: [
        { id: 'reporting', label: 'Client reporting', leak: 'Rebuilding client reports by hand every cycle', fix: 'A reporting pipeline that pulls each client\u2019s numbers into a branded report and drafts the commentary, so an account manager edits instead of assembling.', ex: 'nc_report', tools: ['drive', 'sheets', 'chat'] },
        { id: 'proposals', label: 'Proposals & SOWs', leak: 'Proposals and SOWs written from scratch', fix: 'A proposal generator trained on your past wins, pricing rules and case studies. It drafts the proposal and SOW straight from discovery-call notes.', ex: 'ko_collateral', tools: ['drive', 'crm'] },
        { id: 'onboarding', label: 'Client onboarding', leak: 'Onboarding that depends on whoever remembers the steps', fix: 'An onboarding flow where the intake form creates folders, access requests, the kickoff brief and the task list, plus an AI employee that answers \u201cwhere is X?\u201d from your SOPs.', ex: 'ivy_assistant', tools: ['drive', 'chat', 'crm'] },
        { id: 'newbiz', label: 'New-business follow-up', leak: 'Warm leads going cold between calls', fix: 'Every lead in {crm} gets a next step: drafted follow-ups queued daily for a person to approve. Nothing auto-sends.', ex: 'ivy_outreach', tools: ['crm', 'email'] },
        { id: 'status', label: 'Status updates & client email', leak: 'Senior people answering \u2018where are we on this?\u2019 all day', fix: 'A drafts-only inbox assistant that answers status questions from your project data and queues the reply for approval.', ex: 'ivy_inbox', tools: ['email', 'chat'] },
        { id: 'content', label: 'Content & creative production', leak: 'Content production bottlenecked on a few people', fix: 'A content pipeline that produces briefs, first drafts and ad variations, each checked against the client\u2019s brand rules before review.', ex: 'nc_content', tools: ['drive'] },
        { id: 'billing', label: 'Retainer billing & overages', leak: 'Retainer and overage billing that slips through', fix: 'Invoices generated from project and time data and reconciled in {accounting}, with unbilled hours flagged weekly.', ex: 'ivy_invoice', tools: ['accounting', 'sheets'] },
      ],
    },
    realestate: {
      label: 'Real estate / property management', noun: 'brokerage', clients: 'buyers, sellers and tenants', unit: 'deals',
      context: 'In real estate, speed-to-lead and consistent follow-up decide who gets the listing. Most teams lose deals in the gap between the first inquiry and the third touch.',
      guardrail: 'Nothing goes to a client without an agent\u2019s OK, and listing copy is checked for fair-housing-safe language before it\u2019s approved.',
      sinks: [
        { id: 'leads', label: 'Lead follow-up', leak: 'Leads waiting hours for a first reply, then getting one follow-up', fix: 'Speed-to-lead: every portal, sign-call and website lead lands in {crm} with a drafted reply ready for an agent within minutes, plus a follow-up cadence until they book or opt out.', ex: 'ivy_outreach', tools: ['crm', 'email', 'sheets'] },
        { id: 'listing', label: 'Listing marketing', leak: 'Every listing\u2019s marketing kit built by hand', fix: 'A listing kit generator that takes the listing sheet and photos and produces the description, social posts, email blast and flyer copy in your brand voice.', ex: 'nc_content', tools: ['drive'] },
        { id: 'paperwork', label: 'Transaction paperwork', leak: 'Transaction deadlines tracked in someone\u2019s head', fix: 'A transaction tracker: contract dates parsed into a timeline, checklists and reminders for every party, and missing documents flagged before closing.', ex: 'b2b_orders', tools: ['email', 'drive', 'sheets'] },
        { id: 'showings', label: 'Showings & scheduling', leak: 'Agents playing calendar ping-pong', fix: 'A scheduling assistant that proposes showing times from agents\u2019 calendars and drafts the confirmations and reminders.', ex: 'ivy_assistant', tools: ['email', 'crm'] },
        { id: 'sphere', label: 'Past-client & sphere nurture', leak: 'Your past clients hearing from you once a year', fix: 'A sphere engine that drafts home anniversaries, market updates and referral asks per contact from {crm}.', ex: 'b2b_revenue', tools: ['crm', 'sheets'] },
        { id: 'maintenance', label: 'Tenant & maintenance requests', leak: 'Maintenance requests scattered across texts and email', fix: 'Requests parsed into tickets, with vendor-dispatch drafts and owner updates generated automatically.', ex: 'b2b_orders', tools: ['email', 'sheets'] },
        { id: 'reporting', label: 'Pipeline & agent reporting', leak: 'No live view of pipeline, GCI and agent activity', fix: 'One dashboard for pipeline, GCI, days on market and agent activity, plus a weekly recap to the owner.', ex: 'ivy_kpi', tools: ['crm', 'sheets', 'accounting'] },
      ],
    },
    insurance: {
      label: 'Insurance', noun: 'agency', clients: 'policyholders', unit: 'policies and renewals',
      context: 'In insurance, retention is the business. Renewals, service requests and remarketing quietly consume producer time that should go to new premium.',
      guardrail: 'Drafts only: nothing binds, changes coverage or goes to a carrier without a licensed producer\u2019s review.',
      sinks: [
        { id: 'renewals', label: 'Renewal prep & remarketing', leak: 'Renewals worked at the last minute', fix: 'A renewal pipeline: weeks out, it pulls the policy data, drafts the remarketing email and checklist, and flags at-risk accounts first.', ex: 'b2b_revenue', tools: ['crm', 'sheets', 'email'] },
        { id: 'quoting', label: 'Quoting & applications', leak: 'Producers re-typing the same data into every application', fix: 'An intake form that pre-fills applications and comparison summaries, so producers review instead of re-typing.', ex: 'b2b_orders', tools: ['email', 'sheets'] },
        { id: 'service', label: 'Service requests (COIs, endorsements)', leak: 'COI and endorsement requests eating the service team\u2019s day', fix: 'Requests parsed from email into tickets, each with a drafted response and the right document attached, waiting for approval.', ex: 'ivy_inbox', tools: ['email', 'drive'] },
        { id: 'leads', label: 'New-lead follow-up', leak: 'Quote requests that never get a second touch', fix: 'Every quote request gets a follow-up cadence in {crm}, with drafted messages a producer approves.', ex: 'ivy_outreach', tools: ['crm', 'email'] },
        { id: 'claims', label: 'Claims follow-up', leak: 'Claims status chased by phone', fix: 'A claims tracker that sends status nudges to carriers and drafts updates to policyholders.', ex: 'ivy_assistant', tools: ['email', 'sheets'] },
        { id: 'commissions', label: 'Commission reconciliation', leak: 'Carrier commission statements checked by hand (or not at all)', fix: 'Carrier statements parsed and matched against expected commissions, with mismatches flagged for review.', ex: 'b2b_pricebook', tools: ['accounting', 'sheets'] },
      ],
    },
    accounting: {
      label: 'Accounting / bookkeeping', noun: 'firm', clients: 'clients', unit: 'engagements and closes',
      context: 'In accounting, capacity is the ceiling. Every hour spent chasing documents and recategorizing transactions is an hour of advisory work you can\u2019t sell.',
      guardrail: 'Read-only access to client books until the review queue has proven itself. Every write-back is approved by a person, with a freeze switch.',
      sinks: [
        { id: 'docs', label: 'Chasing client documents', leak: 'Staff chasing the same client documents every month', fix: 'A document-request engine with per-client checklists, scheduled reminders, and uploads filed and logged, so nobody chases by hand.', ex: 'b2b_portal', tools: ['email', 'drive'] },
        { id: 'categorize', label: 'Categorization & cleanup', leak: 'Recategorizing transactions the same way every month', fix: 'A review queue on top of {accounting} bank feeds: it suggests, a person approves, and it learns from every correction.', ex: 'b2b_orders', tools: ['accounting'] },
        { id: 'close', label: 'Month-end close', leak: 'Month-end close that depends on one person\u2019s checklist', fix: 'A close checklist that runs itself: reconciliations queued, variances flagged and the client summary drafted.', ex: 'b2b_pricebook', tools: ['accounting', 'sheets'] },
        { id: 'questions', label: 'Client emails & questions', leak: 'Partners answering routine client questions', fix: 'A drafts-only inbox assistant that answers from the client\u2019s file and your SOPs. A person approves every reply.', ex: 'ivy_inbox', tools: ['email', 'drive'] },
        { id: 'billing', label: 'Billing & collections', leak: 'Your own invoices going out late', fix: 'Engagement billing generated on schedule, with reminders and a weekly AR list.', ex: 'ivy_invoice', tools: ['accounting'] },
        { id: 'reporting', label: 'Client reporting & advisory packs', leak: 'Advisory packs assembled by hand', fix: 'Client dashboards and monthly packs generated from the books, with commentary drafted for review.', ex: 'ivy_kpi', tools: ['accounting', 'sheets'] },
        { id: 'onboarding', label: 'Client onboarding', leak: 'New clients onboarded differently every time', fix: 'A standard onboarding flow plus an AI employee trained on your procedures, which new staff ask before they ask a partner.', ex: 'ivy_assistant', tools: ['drive', 'email'] },
      ],
    },
    homeservices: {
      label: 'Home services / contractors', noun: 'company', clients: 'homeowners', unit: 'jobs',
      context: 'In home services, the company that quotes first and follows up twice usually wins the job, and the money leaks after the job, in unsent invoices and unchased payments.',
      guardrail: 'Quotes can\u2019t go out below your margin floor; a manager approves any exception.',
      sinks: [
        { id: 'quoting', label: 'Quoting & estimates', leak: 'Estimates that take days instead of the same day', fix: 'A quote tool built on your price book: the tech enters the job and gets a margin-checked estimate the same day, synced to {accounting}.', ex: 'b2b_pricebook', tools: ['accounting', 'sheets'] },
        { id: 'scheduling', label: 'Scheduling & dispatch', leak: 'Calls, forms and texts scheduled by hand', fix: 'Every request (call, form or email) lands in one queue with suggested slots and drafted confirmations. No double entry.', ex: 'ivy_outreach', tools: ['email', 'sheets', 'crm'] },
        { id: 'invoicing', label: 'Invoicing & chasing payment', leak: 'Finished jobs waiting to be invoiced, and payments nobody chases', fix: 'An invoice generated the moment a job closes, reminders on a schedule, and a daily list of who owes what.', ex: 'ivy_invoice', tools: ['accounting'] },
        { id: 'unsold', label: 'Following up unsold estimates', leak: 'Open estimates that never get a second call', fix: 'Every open estimate gets a follow-up cadence, with drafted texts and emails for the office to approve.', ex: 'ivy_outreach', tools: ['crm', 'email'] },
        { id: 'plans', label: 'Maintenance plans & seasonal reminders', leak: 'Past customers who never hear from you until something breaks', fix: 'Seasonal tune-up and service-agreement campaigns drafted from your job history.', ex: 'b2b_revenue', tools: ['crm', 'accounting', 'sheets'] },
        { id: 'parts', label: 'Parts & supply ordering', leak: 'Parts ordered job by job, from memory', fix: 'Purchase orders generated from scheduled jobs and stock levels, ready for one-click review.', ex: 'ivy_po', tools: ['accounting', 'sheets'] },
      ],
    },
    ecom: {
      label: 'E-com / DTC', noun: 'brand', clients: 'customers', unit: 'orders',
      context: 'For DTC brands, the cheapest revenue is from customers you already have. Most of it gets lost to slow support, missed reorders and reporting no one has time to read.',
      guardrail: 'Refunds, discounts and anything above a set threshold need a person\u2019s approval. Support replies start as drafts.',
      sinks: [
        { id: 'support', label: 'Customer service inbox', leak: '\u2018Where\u2019s my order?\u2019 eating the support team', fix: 'Drafted replies to order-status, returns and product questions, using live order data from {shopify}. An agent approves each one.', ex: 'ivy_inbox', tools: ['email', 'shopify'] },
        { id: 'inventory', label: 'Inventory & purchase orders', leak: 'Reorders and POs built in spreadsheets', fix: 'PO intake and review: suggested purchase orders from sell-through, reviewed in one queue.', ex: 'ivy_po', tools: ['shopify', 'sheets', 'accounting'] },
        { id: 'content', label: 'Content, ads & SEO', leak: 'Content and creative that can\u2019t keep up with the calendar', fix: 'Pipelines for SEO articles, backlinks and static ads, checked against your brand rules.', ex: 'nc_content', tools: ['drive', 'shopify'] },
        { id: 'reporting', label: 'Reporting across channels', leak: 'Monday reporting stitched together from five dashboards', fix: 'One automated weekly report across store, ads and finance, written for the owner.', ex: 'nc_report', tools: ['shopify', 'accounting', 'sheets'] },
        { id: 'retention', label: 'Retention, win-back & reorders', leak: 'Lapsed customers nobody is working', fix: 'Segmentation by who\u2019s lapsing and who\u2019s growing, plus drafted win-back and reorder campaigns.', ex: 'b2b_revenue', tools: ['shopify', 'crm'] },
        { id: 'wholesale', label: 'Wholesale / B2B orders', leak: 'Wholesale orders arriving as emails and PDFs', fix: 'Email and PDF orders parsed into a review queue, then pushed to {shopify} and {accounting}.', ex: 'b2b_orders', tools: ['email', 'accounting', 'shopify'] },
        { id: 'outreach', label: 'Brand, creator & retail outreach', leak: 'Outreach that depends on someone remembering to follow up', fix: 'An outreach call and email queue with drafted follow-ups and a daily \u201cwho to contact next\u201d list.', ex: 'ivy_outreach', tools: ['crm', 'email', 'sheets'] },
      ],
    },
    distribution: {
      label: 'Distribution / wholesale', noun: 'business', clients: 'accounts', unit: 'orders',
      context: 'In distribution, orders arrive in every format and margin hides in the price book. Most of the leakage is small, repeated and invisible until someone audits it.',
      guardrail: 'Price changes and credits require approval. Price-book drift is flagged, never auto-fixed.',
      sinks: [
        { id: 'orders', label: 'Order entry from email / PDF', leak: 'Orders re-keyed from email and PDFs', fix: 'Order intake that parses email and PDF orders into a review dashboard that learns from every edit, then posts to {accounting}.', ex: 'b2b_orders', tools: ['email', 'accounting'] },
        { id: 'pricing', label: 'Pricing & billing errors', leak: 'Underbilling from price-book drift', fix: 'Price-book checks on every invoice, with drift and billing errors flagged before they go out.', ex: 'b2b_pricebook', tools: ['accounting', 'sheets'] },
        { id: 'reorders', label: 'Reorders & account follow-up', leak: 'Accounts reordering only when they remember to', fix: 'A client portal with \u201cFill my usual order\u201d, plus a list of reorder reminders that are due.', ex: 'b2b_portal', tools: ['accounting', 'email'] },
        { id: 'purchasing', label: 'Purchasing / POs', leak: 'Purchasing run from inboxes and spreadsheets', fix: 'PO intake and review in one queue, with vendor emails parsed and drafted POs ready to approve.', ex: 'ivy_po', tools: ['email', 'sheets', 'accounting'] },
        { id: 'ar', label: 'AR & collections', leak: 'Collections that happen when someone has time', fix: 'Scheduled statements and reminders, plus a daily AR list ranked by risk.', ex: 'ivy_invoice', tools: ['accounting'] },
        { id: 'outreach', label: 'Sales outreach to new accounts', leak: 'Reps without a daily \u2018who to call\u2019 list', fix: 'A call queue that tells reps who to call next and drafts the follow-up.', ex: 'ivy_outreach', tools: ['crm', 'sheets'] },
        { id: 'reporting', label: 'Sales & margin reporting', leak: 'No live view of which accounts are growing or lapsing', fix: 'A customer revenue dashboard with cross-sell and account-activation breakdowns.', ex: 'b2b_revenue', tools: ['accounting', 'sheets'] },
      ],
    },
    professional: {
      label: 'Professional services', noun: 'firm', clients: 'clients', unit: 'engagements',
      context: 'In professional services, you sell expertise but spend hours on intake, scheduling, status emails and billing. That admin caps how many engagements each person can carry.',
      guardrail: 'Confidential client data stays in your accounts. Anything client-facing starts as a draft a professional approves.',
      sinks: [
        { id: 'intake', label: 'Client intake', leak: 'Intake details re-typed from emails and forms', fix: 'Intake that parses emails and forms into a structured client record, with the checks your process requires.', ex: 'b2b_orders', tools: ['email', 'crm'] },
        { id: 'proposals', label: 'Proposals & engagement letters', leak: 'Every proposal rebuilt from an old one', fix: 'A proposal and engagement-letter generator trained on your templates, pricing rules and past wins.', ex: 'ko_collateral', tools: ['drive'] },
        { id: 'scheduling', label: 'Scheduling & reminders', leak: 'Scheduling done by email back-and-forth', fix: 'A scheduling assistant that proposes times and drafts confirmations and prep reminders.', ex: 'ivy_assistant', tools: ['email'] },
        { id: 'billing', label: 'Time capture & billing', leak: 'Billable time lost between the work and the invoice', fix: 'Time pulled from calendars and email into draft invoices in {accounting}, with unbilled work flagged weekly.', ex: 'ivy_invoice', tools: ['accounting', 'email'] },
        { id: 'updates', label: 'Client updates & email', leak: 'Professionals writing routine status emails', fix: 'A drafts-only assistant that writes status updates from your matter or project notes for approval.', ex: 'ivy_inbox', tools: ['email', 'drive'] },
        { id: 'knowledge', label: 'Finding past work & templates', leak: 'Hunting for the last version of everything', fix: 'An AI employee trained on your SOPs and past work that finds the template, precedent or answer in seconds.', ex: 'ivy_assistant', tools: ['drive'] },
        { id: 'bizdev', label: 'Business development follow-up', leak: 'Referral and prospect follow-ups that slip', fix: 'A follow-up queue in {crm}, with drafted touches a person approves.', ex: 'ivy_outreach', tools: ['crm', 'email'] },
      ],
    },
    other: {
      label: 'Other', noun: 'business', clients: 'customers', unit: 'work',
      context: 'Every business has the same three leaks: work re-typed between tools, follow-ups that depend on memory, and numbers nobody sees until month-end.',
      guardrail: 'Anything customer-facing starts as a draft, and financial write-backs need a person\u2019s approval.',
      sinks: [
        { id: 'inbox', label: 'Email & inbox triage', leak: 'The inbox deciding the team\u2019s day', fix: 'Inbox triage into lanes (reply, delegate, decide) with drafted replies waiting for your OK.', ex: 'ivy_inbox', tools: ['email'] },
        { id: 'followup', label: 'Lead & customer follow-up', leak: 'Follow-ups that depend on memory', fix: 'Every lead and request becomes tracked work with an owner, a next step and a drafted follow-up.', ex: 'ivy_outreach', tools: ['crm', 'email'] },
        { id: 'dataentry', label: 'Data entry between tools', leak: 'The same data typed into three tools', fix: 'Emails, PDFs and forms parsed into structured records that flow to the right system.', ex: 'b2b_orders', tools: ['email', 'sheets', 'accounting'] },
        { id: 'invoicing', label: 'Invoicing & payments', leak: 'Invoices and payment chasing done by hand', fix: 'Invoice creation and reconciliation in {accounting}, with reminders on a schedule.', ex: 'ivy_invoice', tools: ['accounting'] },
        { id: 'reporting', label: 'Reporting', leak: 'Reports rebuilt every week', fix: 'One live dashboard and a weekly recap written for the owner.', ex: 'ivy_kpi', tools: ['sheets', 'accounting'] },
        { id: 'content', label: 'Content & marketing', leak: 'Marketing that waits on one busy person', fix: 'Content pipelines that run on your brand rules.', ex: 'nc_content', tools: ['drive'] },
      ],
    },
  },

  /* ---------- rule-based leaks (fill the top 3 when fewer sinks are picked, in this order) ---------- */
  ruleLeaks: [
    { id: 'r_sheets', when: a => a.tools.includes('sheets'), leak: '{company} runs on spreadsheets', fix: 'One source of truth: the spreadsheets that matter become a connected database with a live dashboard, and nobody reconciles versions again.', ex: 'ivy_kpi',
      why: 'You told us spreadsheets run most of the business. Every copy-paste between them is a place for errors and lost hours.' },
    { id: 'r_nocrm', when: a => !a.tools.includes('crm'), leak: '{clients} and leads living in inboxes', fix: 'A lightweight CRM wired to your email: every lead and request becomes tracked work with an owner and a next step.', ex: 'ivy_outreach',
      why: 'You don\u2019t use a CRM, so follow-ups depend on memory and inbox search.' },
    { id: 'r_siloed', when: a => a.data !== 'connected', leak: '{tools} not talking to each other', fix: 'We connect {tools} so data moves once and every report and AI employee works from the same live numbers.', ex: 'b2b_orders',
      why: 'Your data is {dataLabel}, so the same information gets re-typed between tools.' },
    { id: 'r_sop', when: a => a.sop <= 3, leak: 'The playbook lives in people\u2019s heads', fix: 'We document your top workflows as SOPs, then train an AI employee on them, so new hires ask it before they ask you.', ex: 'ivy_assistant',
      why: 'You rated your SOP documentation {sop}/5. Without written SOPs, every handoff and new hire costs time, and AI has nothing reliable to learn from.' },
    { id: 'r_report', when: a => true, leak: 'No live view of the numbers', fix: 'A KPI dashboard that pulls sales, cash, pipeline and ops into one view, plus a weekly recap.', ex: 'ivy_kpi',
      why: 'Without a live dashboard, decisions wait for someone to rebuild the numbers.' },
  ],

  /* ---------- sub-score diagnoses (low <40, mid 40–69, high ≥70) ---------- */
  diagnoses: {
    process: {
      low: '{company}\u2019s playbook mostly lives in people\u2019s heads. Every new hire and every handoff costs you, and AI has nothing reliable to learn from yet.',
      mid: 'Some of {company}\u2019s SOPs are written down, but not the ones that run day-to-day {unit}. That\u2019s the gap an AI employee needs filled first.',
      high: '{company} has documented SOPs, which is rare. That\u2019s exactly the raw material an AI employee trained on your playbook needs.',
    },
    systems: {
      low: 'Your data is siloed{sheetsNote}. Information about your {unit} gets re-typed between tools, so nobody has one live view.',
      mid: 'Your tools are partly connected, but key handoffs still run on exports and copy-paste. That\u2019s where errors and lost hours hide.',
      high: 'Your core systems already share data. That makes {company} fast to build on: we can wire AI into live data from day one.',
    },
    automation: {
      none: 'No AI in the workflow yet. That\u2019s fine: it means we design it right the first time instead of untangling ad-hoc prompts.',
      adhoc: 'ChatGPT on the side helps individuals, but it isn\u2019t connected to {tools}, so the work still gets copied in and out by hand.',
      some: 'You have some automations running. The next step is connecting them into one system with guardrails, instead of a patchwork of zaps.',
      integrated: 'AI is already wired into your systems. The opportunity now is depth: more of your SOPs running through it, with tighter guardrails.',
    },
    leverage: {
      low: '{hours} hours a week of manual admin across a team of {team} works out to about {perPerson} hours per person, every week. That\u2019s capacity you\u2019re paying for and not getting.',
      mid: 'About {perPerson} hours per person each week go to manual admin. That\u2019s manageable today, and the first thing to break when volume grows.',
      high: 'Manual admin is light, at about {perPerson} hours per person each week. Your leverage now comes from growth work, not cleanup.',
    },
  },

  scoreBands: [
    { min: 0, label: 'Running on effort', line: 'The business works because people push it. The upside from a designed system is large.' },
    { min: 40, label: 'Foundations in place', line: 'Some structure is there. The right system would turn it into real leverage.' },
    { min: 60, label: 'Ready to scale', line: 'Solid foundations. Integration and AI employees are the next multiplier.' },
    { min: 80, label: 'Ahead of the curve', line: 'You\u2019re ahead of most operators. The gains now are in depth and guardrails.' },
  ],
};
