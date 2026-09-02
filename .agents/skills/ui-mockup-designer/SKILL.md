---
name: ui-mockup-designer
description: Design and generate interactive, high-fidelity UI demo mockups, wireframes, and prototypes for web applications, dashboards, landing pages, and mobile screens.
---

# UI Mockup Designer Skill

A skill for generating visually polished, realistic, and production-ready UI demo mockups and interactive prototypes.

## 1. Summary
This skill guides the design and generation of functional UI mockups for web applications, dashboards, landing pages, and mobile screens. It defaults to self-contained, responsive HTML with Tailwind CSS and Lucide icons so users can preview the interface directly in any web browser.

---

## 2. When to Use
Use this skill when the user requests:
- Designing or drafting a UI mockup, wireframe, or prototype.
- Creating screen layouts for dashboards, admin panels, e-commerce, SaaS, or mobile apps.
- Prototyping a landing page, form flow, modal, or complex UI component.
- Visualizing user interface concepts or converting requirement specs into mockups.

---

## 3. Core Principles
1. **Deliver self-contained, runnable code:** Default to a complete, standalone HTML file using the Tailwind CSS CDN script, Google Fonts (e.g., Inter), and SVG or Lucide icons.
2. **Use realistic, domain-specific data:** Avoid generic "Lorem Ipsum" or "Text 1". Use realistic names, dates, financial amounts, product details, and metrics.
3. **Prioritize visual hierarchy and contrast:** Use cohesive color palettes (neutral slate/zinc backgrounds, distinct brand primary colors, and semantic status colors for success, warning, and error).
4. **Design for responsiveness:** Ensure layouts adapt smoothly to desktop, tablet, and mobile viewport sizes with flexbox and grid utilities.
5. **Include interactive micro-states:** Provide hover states, active states, badges, tooltips, and sensible transitions to make the mockup feel alive.

---

## 4. Workflow Steps

### Step 1: Analyze Requirements
- **Identify the product type:** Dashboard, SaaS portal, e-commerce, mobile app, or landing page.
- **Determine target audience:** Primary user actions and core workflow goals.
- **Clarify theme preference:** Dark mode, light mode, or clean neutral, along with brand identity.

### Step 2: Structure the Layout
- **Top navigation or sidebar:** Logo, navigation links, search bar, notifications, and user avatar.
- **Main content area:** Page title, breadcrumbs, action buttons, summary stat cards, and primary data tables or charts.
- **Secondary panels:** Filters, contextual drawers, details sidebar, or modal overlays where appropriate.

### Step 3: Select Styling and Typography
- **Typography:** Clean sans-serif fonts such as Inter, Roboto, or system sans.
- **Spacing:** Consistent padding and margin scales (e.g., `p-4`, `p-6`, `gap-4`, `gap-6`).
- **Card styling:** Subtle borders (`border border-slate-200` or `border-slate-800`), rounded corners (`rounded-xl` or `rounded-2xl`), and gentle box shadows.

### Step 4: Generate the Mockup Code
- Provide clean, semantic HTML5 structure.
- Embed Tailwind CSS via CDN script in the `<head>` tag.
- Include Lucide icon CDN or inline SVGs for crisp iconography.
- Group related sections with descriptive comments for easy inspection and modification.

### Step 5: Offer Variations or Extensions
- Suggest next steps such as converting to React/Next.js components, adding dark mode toggles, or implementing multi-step flow screens.

---

## 5. Gotchas & Best Practices
- **Avoid external asset dependencies:** Do not link to external images that may break or expire. Use SVG placeholders, Unsplash source URLs with reliable dimensions, or CSS-styled avatar placeholders with initials.
- **Avoid cluttered layouts:** Give elements breathing room with adequate whitespace. Do not overcrowd dashboards.
- **Verify accessibility:** Ensure proper text contrast ratios between background and foreground colors.
- **Maintain responsive containers:** Wrap main sections in `max-w` containers with `mx-auto` and responsive horizontal padding.
