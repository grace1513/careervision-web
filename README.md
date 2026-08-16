# CareerVision — BSE Specialisation Advisor

An interactive web application that helps incoming Bachelor of Software Engineering students discover which specialisation best fits their interests, strengths, and career goals — **Low-Level Programming**, **AR/VR**, **Full-Stack Web Development**, or **Machine Learning** — through a personalised, timed assessment.

🔗 **Live site:** https://grace1513.github.io/careervision-web/

📦 **Repository:** https://github.com/grace1513/careervision-web

🎥 **Video Walkthrough:** [https://1drv.ms/v/c/AD9C5FB908132B2D/IQA_5WC1zKpKQqHYFI_XLshGAcJ5dcgC5da2a4vyzYKX-2c?e=2Hly2H]

---

## Overview

CareerVision guides a student through four stages:

1. **Landing Page** — introduces the tool and collects preliminary student details (name, institutional email, student ID, phone number) via a real-time validated registration form.
2. **Quiz Page** — a 10-question interactive assessment with a live countdown timer, progress bar, and two interactive media question types (an SVG image-hotspot question and a video-scenario question).
3. **Results Page** — a personalised recommendation with a category score breakdown, a Canvas-rendered radar chart, and curated skills/careers/learning-resource suggestions.
4. **Contact & Feedback Page** — author details, project links, and a validated contact form.

---

## Features

- **Real-time form validation** — regex-based validation on name, institutional email, student ID, and phone number, with live `.is-valid` / `.is-invalid` state toggling and inline error messages (no `alert()` popups).
- **Interactive quiz** — 10 questions, a live `setInterval`/`clearInterval` countdown timer with two-stage visual warnings, and full timeout handling (locks the quiz, shows a warning, auto-submits).
- **Interactive media questions**:
  - *Image Hotspot* — an inline SVG "career map" with four clickable zones (coordinate/SVG-overlay selection).
  - *Video Scenario* — an embedded HTML5 video that auto-pauses at a set timestamp via a `timeupdate` listener, then reveals a decision prompt.
- **Speed/streak scoring engine** — fast, consecutive answers build a streak that scales a dynamic bonus-point multiplier, tracked and displayed separately from the specialisation scores.
- **HTML5 Canvas radar chart** — the Results page renders a dynamic spider/radar chart of the four specialisation scores using the raw Canvas 2D API (no charting library).
- **Hover/auto-cycling background system** — a shared background layer that auto-cycles between two images by default, overridden by nav-hover images, and by live Canvas/video animations on the specialisation cards.
- **Fully responsive** — tested across mobile, tablet, and desktop breakpoints on all four pages.

---

## Tech Stack

- **HTML5** — semantic, accessible markup across 4 pages
- **CSS3** — custom properties (design tokens), Flexbox/Grid layouts, responsive breakpoints, no CSS framework
- **JavaScript (ES6+)** — vanilla JS throughout; no frameworks or external libraries
- **Canvas 2D API** — hand-built radar chart, used natively (no Chart.js or similar)
- [Google Fonts](https://fonts.google.com/) (Quicksand, Inter, JetBrains Mono) and [Phosphor Icons](https://phosphoricons.com/) — see `Sources_and_Attributions.pdf` for full licensing details

---

## Project Structure

```
careervision-web/
├── index.html              # Landing page + registration form
├── quiz.html                # Interactive quiz
├── results.html             # Results + Canvas radar chart
├── contact.html              # Contact & feedback page
│
├── css/
│   ├── variables.css        # Design tokens (colors, fonts, type scale)
│   ├── home.css              # Shared header/footer + landing page styles
│   ├── quiz.css               # Quiz page styles
│   ├── results.css           # Results page styles
│   ├── contact.css            # Contact page styles
│   ├── bg-hover.css          # Hover / auto-cycling background system
│   └── hotspot.css              # Image hotspot + video scenario + speed-stat styles
│
├── js/
│   ├── validation.js          # Registration form validation
│   ├── quiz.js                  # Quiz logic, question rendering, scoring engine
│   ├── timer.js                 # Countdown timer module
│   ├── results.js               # Results page population + Canvas chart renderer
│   ├── contact.js               # Contact form validation
│   ├── bg-hover.js             # Background hover/auto-cycle system
│   └── video.js                  # Click-to-play homepage video
│
├── Images/                     # Background images (sourced from Pexels)
├── Video/                      # Path-card background videos (created in Canva)
│
├── Sources_and_Attributions.pdf # Full asset attributions + AI usage disclosure
└── README.md
```

---

## Running Locally

1. Clone the repo:
   ```
   git clone https://github.com/grace1513/careervision-web.git
   ```
2. Open the folder in VS Code (or your editor of choice).
3. Serve it with a local server — e.g. the VS Code **Live Server** extension — and open `index.html`.
   (Opening the HTML file directly via `file://` may block some features like `sessionStorage`.)

---

## Video Walkthrough

A 10–15 minute screen recording covering a full feature demonstration of all four pages, plus a code walkthrough of the form validation logic, dynamic DOM updates, Canvas rendering, and timer implementation, is available here:

👉 **[https://1drv.ms/v/c/AD9C5FB908132B2D/IQA_5WC1zKpKQqHYFI_XLshGAcJ5dcgC5da2a4vyzYKX-2c?e=2Hly2H]**


---

## Assessment Context

This project was built for the **BSE Specialisation Advisor** assessment, following the required four-stage process:

- **Stage 1** — Scenario selection & wireframes
- **Stage 2** — HTML/CSS multi-page layout
- **Stage 3** — Core JS logic: form validation, timer, interactive media, Canvas rendering
- **Stage 4** — GitHub Pages deployment & video walkthrough

---

## Author

**Grace UMWIZA** — Student ID: 1406691762
BSE Specialisation Advisor Assessment — African Leadership College

---

## Attributions & AI Usage

Full asset sourcing (fonts, icons, images, video) and an AI usage disclosure are documented in [`Sources_and_Attributions.pdf`](./Sources_and_Attributions.pdf).