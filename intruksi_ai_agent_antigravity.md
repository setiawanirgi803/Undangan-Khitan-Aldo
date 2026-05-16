# AI Agent Instruction: Professional & High-Performance Website Development

## 1. Role & Core Objective
You are an expert Frontend Developer, UI/UX Designer, and Performance Optimization Specialist. Your objective is to build a professional, modern, visually stunning, and ultra-high-performance website for **Irgi Setiawan** using the **Antigravity** framework/methodology. 

The website must feel premium, load instantly, and feature seamless animations that reflect the "antigravity" concept (lightness, fluid motion, and floating elements) without sacrificing speed.

---

## 2. Professional Profile Data (Irgi Setiawan)
*Use the following data as the source of truth for all content, copy, and sections.*

### **Personal Info**
* **Name:** Irgi Setiawan
* **Title:** Full-Stack Software Engineer & Cloud Architect
* **Location:** Jakarta, Indonesia
* **Tagline:** "Building high-performance, scalable digital experiences that defy conventional engineering limits."
* **Bio:** A forward-thinking software engineer with 5+ years of experience specializing in ultra-fast web architectures, cloud infrastructure, and modern interactive user experiences. Passionate about optimization, clean code, and pushing the boundaries of web performance.

### **Core Expertise & Services**
1.  **High-Performance Web Apps:** Building blazing-fast, SEO-optimized progressive web applications.
2.  **Cloud & DevOps Architecture:** Scaling infrastructure on AWS/GCP with zero-downtime deployment pipelines.
3.  **UI/UX Engineering:** Transforming complex workflows into elegant, fluid, and interactive digital interfaces.

### **Technical Skills**
* **Languages:** JavaScript (ES6+), TypeScript, Python, Go, HTML5/CSS3
* **Frameworks & Libraries:** React, Next.js, Antigravity, Tailwind CSS, Node.js
* **Cloud & Tools:** AWS, Docker, Kubernetes, GitHub Actions, Vercel, Supabase

### **Featured Projects (Dummy Data)**
1.  **AeroDash (Cloud Analytics Platform)**
    * *Description:* A real-time cloud monitoring dashboard featuring fluid micro-interactions and zero-lag data rendering.
    * *Tech Stack:* Next.js, Antigravity UI, WebSockets, Tailwind CSS.
2.  **Vortex eCommerce**
    * *Description:* A headless commerce engine optimized for a sub-0.5s Core Web Vitals Largest Contentful Paint (LCP).
    * *Tech Stack:* React, Go, GraphQL, Edge Functions.

---

## 3. Visual Identity & Modern UI Design System
To achieve a **professional and modern** aesthetic, implement the following design tokens:

* **Color Palette (Deep & Modern Tech):**
    * `Background`: Deep Obsidian (`#0B0F19`) paired with soft, dark slate cards (`#161F30`).
    * `Primary Accent`: Vibrant Electric Indigo (`#6366F1`) or Cyan (`#06B6D4`) to symbolize energy and innovation.
    * `Text`: Crisp Off-White (`#F8FAFC`) for headings, Muted Gray (`#94A3B8`) for body text.
* **Typography:**
    * Headings: Clean, geometric sans-serif (e.g., *Plus Jakarta Sans* or *Inter*). Bold and authoritative weights.
    * Body: Highly legible sans-serif with generous line-height (`1.6`) for optimal readability.
* **Layout & Components:**
    * Use a clean, spacious, linear structure. Avoid cluttered grid systems or over-designed hero layouts.
    * Incorporate the **Antigravity theme**: Subtle floating effects (`transform: translateY(-4px)` on hover), gentle backdrop-filter blurs (`backdrop-filter: blur(12px)`), and smooth ease-in-out transitions.
    * Use explicit visual callouts (e.g., a thick left border on section headings: `border-left: 4px solid var(--primary); padding-left: 12px;`) instead of standard underlines.

---

## 4. Ultra-High Performance & Code Optimization Engineering
The website **must** achieve perfect or near-perfect performance scores (95+ on Google Lighthouse / Core Web Vitals). Follow these rules strictly during generation:

1.  **Layout & Layout Shift Prevention:**
    * Always include `*, *::before, *::after { box-sizing: border-box; }` in the global CSS styles to prevent calculation discrepancies.
    * Ensure all images, icons, and interactive elements have explicit aspect ratios or `width`/`height` attributes defined to eliminate Cumulative Layout Shift (CLS).
2.  **Asset & Media Optimization:**
    * Do not link to heavy external resources, external stylesheets, unoptimized third-party scripts, or tracking pixels.
    * If icons are needed, use light, inline SVG code directly rather than importing heavy font icon bundles.
3.  **Animation Control:**
    * Keep animations purely CSS-driven. Do not use JavaScript-heavy animation libraries.
    * Only animate performance-optimized properties: `transform` and `opacity`. Never animate layout-triggering properties like `height`, `width`, `top`, or `margin`.
4.  **Semantic HTML & Flow:**
    * Keep the DOM tree shallow and clean. Avoid deeply nested generic wrapper `<div>` elements.
    * Allow standard content flows to handle layout transitions smoothly across screen sizes.

---

## 5. Execution Steps for the AI Agent
1.  **Step 1:** Generate the semantic boilerplate HTML structure containing sections for: Header/Hero, About Me, Core Services, Featured Projects, Skills Matrix, and Contact.
2.  **Step 2:** Write the unified, modern CSS configuration utilizing the specified Deep Tech color palette, responsive typography system, and Antigravity micro-interactions.
3.  **Step 3:** Inject the professional profile copy and structured dummy data seamlessly into their respective sections.
4.  **Step 4:** Conduct a self-review of the code to ensure strict adherence to the performance and layout guidelines mentioned in Section 4.
