/* =========================================================
   RESULTS.JS
   =========================================================
   1. Reads careervision_scores / careervision_top_track /
      careervision_student from sessionStorage (written by quiz.js)
   2. Converts raw scores (out of 10 questions) into percentages
   3. Populates the recommendation card, score breakdown bars,
      explanation, skills, careers, and resources sections
   4. Draws a radar ("spider") chart on #results-chart using
      the raw Canvas 2D API — no charting library
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const QUESTION_COUNT = 10; // must match QUESTION_BANK.length in quiz.js

    const TRACK_LABELS = {
        lowLevel: "Low-Level Programming",
        fullstack: "Full-Stack Web Development",
        arvr: "AR / VR",
        ml: "Machine Learning"
    };

    /* ---------------------------------------------------
       1. PER-TRACK CONTENT
       Everything shown on the page is driven from here —
       one object per specialization.
    --------------------------------------------------- */

    const TRACK_CONTENT = {

        lowLevel: {
            summary: "Your responses show a strong pull toward working close to the hardware — performance, memory, and how systems actually run under the hood. Low-Level Programming matches these instincts well.",
            explanation: [
                "Your answers point toward a fascination with how software actually runs — memory layout, performance, and the boundary between code and hardware.",
                "That mindset is exactly what Low-Level Programming rewards: writing lean, efficient code for operating systems, embedded devices, and performance-critical applications."
            ],
            skills: [
                { icon: "ph-cpu", title: "Systems Programming", text: "Get comfortable with C/C++ and how programs use memory and the CPU." },
                { icon: "ph-terminal-window", title: "Operating Systems", text: "Understand processes, scheduling, and how an OS manages hardware." },
                { icon: "ph-bug", title: "Debugging Tools", text: "Learn debuggers and profilers to trace issues at the instruction level." },
                { icon: "ph-git-branch", title: "Version Control", text: "Learn Git and collaborative software development workflows." }
            ],
            careers: [
                { icon: "ph-cpu", title: "Systems Engineer", text: "Build and optimize the software that other software runs on." },
                { icon: "ph-chip", title: "Embedded Developer", text: "Write firmware and software for hardware-constrained devices." },
                { icon: "ph-rocket", title: "Performance Engineer", text: "Squeeze maximum efficiency out of critical systems." }
            ],
            resources: [
                { icon: "ph-book-open", title: "C Programming Fundamentals", text: "Build a solid foundation in memory-safe, efficient code." },
                { icon: "ph-cpu", title: "Operating Systems Concepts", text: "Study how processes, memory, and I/O actually work." },
                { icon: "ph-git-branch", title: "Git and GitHub", text: "Learn how to manage projects and collaborate with other developers." }
            ]
        },

        arvr: {
            summary: "Your responses show a strong pull toward building immersive, spatial experiences. AR/VR matches your interest in interaction and 3D design particularly well.",
            explanation: [
                "Your answers reflect excitement about spatial computing — designing experiences people can step inside rather than just look at.",
                "AR/VR development draws on 3D graphics, interaction design, and real-time rendering, which aligns closely with what stood out in your responses."
            ],
            skills: [
                { icon: "ph-cube", title: "3D Fundamentals", text: "Learn 3D math, modeling basics, and spatial reasoning." },
                { icon: "ph-vr-cardboard", title: "Game/AR Engines", text: "Get hands-on with engines like Unity or Unreal." },
                { icon: "ph-hand-tap", title: "Interaction Design", text: "Design intuitive input and interaction for immersive spaces." },
                { icon: "ph-git-branch", title: "Version Control", text: "Learn Git and collaborative software development workflows." }
            ],
            careers: [
                { icon: "ph-vr-cardboard", title: "AR/VR Developer", text: "Build immersive applications and experiences." },
                { icon: "ph-cube", title: "3D/Graphics Engineer", text: "Work on rendering, shaders, and real-time graphics." },
                { icon: "ph-rocket", title: "Interaction Designer", text: "Shape how people move through and use spatial interfaces." }
            ],
            resources: [
                { icon: "ph-book-open", title: "Intro to Unity", text: "Build your first interactive 3D scenes." },
                { icon: "ph-cube", title: "3D Math for Games", text: "Vectors, matrices, and transforms for spatial computing." },
                { icon: "ph-git-branch", title: "Git and GitHub", text: "Learn how to manage projects and collaborate with other developers." }
            ]
        },

        fullstack: {
            summary: "Your responses show a strong interest in building complete applications and creating practical solutions that people can use. Full-Stack Web Development matches these interests particularly well.",
            explanation: [
                "Your answers indicate that you enjoy creating practical solutions, working with users, and combining different technologies to build complete applications.",
                "These characteristics are strongly aligned with Full-Stack Web Development, where developers work across both front-end and back-end technologies."
            ],
            skills: [
                { icon: "ph-code", title: "Programming", text: "Strengthen your programming fundamentals and problem-solving abilities." },
                { icon: "ph-database", title: "Databases", text: "Learn how applications store, retrieve, and manage information." },
                { icon: "ph-globe", title: "Web Technologies", text: "Develop strong front-end and back-end development skills." },
                { icon: "ph-git-branch", title: "Version Control", text: "Learn Git and collaborative software development workflows." }
            ],
            careers: [
                { icon: "ph-browser", title: "Full-Stack Developer", text: "Build complete web applications across front-end and back-end systems." },
                { icon: "ph-code", title: "Web Application Developer", text: "Design and develop interactive web applications for businesses and users." },
                { icon: "ph-rocket", title: "Software Engineer", text: "Create scalable software solutions using modern development technologies." }
            ],
            resources: [
                { icon: "ph-book-open", title: "Web Development Fundamentals", text: "Strengthen your HTML, CSS, and JavaScript foundations." },
                { icon: "ph-git-branch", title: "Git and GitHub", text: "Learn how to manage projects and collaborate with other developers." },
                { icon: "ph-database", title: "Backend Development", text: "Explore APIs, databases, servers, and backend programming." }
            ]
        },

        ml: {
            summary: "Your responses show a strong interest in data, patterns, and building systems that learn. Machine Learning matches these instincts particularly well.",
            explanation: [
                "Your answers point toward curiosity about data — finding patterns, testing hypotheses, and building systems that improve from experience.",
                "That curiosity is at the core of Machine Learning, where you'll work with data pipelines, models, and evaluation to solve real-world problems."
            ],
            skills: [
                { icon: "ph-brain", title: "Math Foundations", text: "Build comfort with statistics, linear algebra, and probability." },
                { icon: "ph-chart-line", title: "Data Analysis", text: "Learn to clean, explore, and draw insight from real datasets." },
                { icon: "ph-robot", title: "ML Frameworks", text: "Get hands-on with tools like PyTorch or scikit-learn." },
                { icon: "ph-git-branch", title: "Version Control", text: "Learn Git and collaborative software development workflows." }
            ],
            careers: [
                { icon: "ph-brain", title: "ML Engineer", text: "Design and deploy models that learn from data." },
                { icon: "ph-chart-line", title: "Data Scientist", text: "Extract insight and build predictive models from data." },
                { icon: "ph-rocket", title: "AI Research Engineer", text: "Push the boundaries of what learning systems can do." }
            ],
            resources: [
                { icon: "ph-book-open", title: "Machine Learning Fundamentals", text: "Build intuition for how models learn from data." },
                { icon: "ph-chart-line", title: "Python for Data Science", text: "Learn the core tools of the ML/data ecosystem." },
                { icon: "ph-git-branch", title: "Git and GitHub", text: "Learn how to manage projects and collaborate with other developers." }
            ]
        }

    };

    /* ---------------------------------------------------
       2. LOAD DATA FROM SESSIONSTORAGE
       If there's no quiz data (someone opened this page
       directly), send them back to take the assessment.
    --------------------------------------------------- */

    let scores, topTrack, student;

    try {
        scores = JSON.parse(sessionStorage.getItem("careervision_scores"));
        topTrack = sessionStorage.getItem("careervision_top_track");
        student = JSON.parse(sessionStorage.getItem("careervision_student") || "null");
    } catch (err) {
        console.error("Could not parse stored results:", err);
    }

    if (!scores || !topTrack || !TRACK_CONTENT[topTrack]) {
        window.location.href = "quiz.html";
        return;
    }

    // Convert raw counts (out of QUESTION_COUNT) into percentages
    const percentages = {};
    Object.keys(scores).forEach((track) => {
        percentages[track] = Math.round((scores[track] / QUESTION_COUNT) * 100);
    });

    /* ---------------------------------------------------
       3. POPULATE THE RECOMMENDATION CARD
    --------------------------------------------------- */

    const content = TRACK_CONTENT[topTrack];

    document.getElementById("recommended-path").textContent = TRACK_LABELS[topTrack];
    document.getElementById("match-score").textContent = `${percentages[topTrack]}%`;
    document.getElementById("recommendation-summary").textContent = content.summary;

    if (student && student.fullName) {
        const heroHeading = document.querySelector(".results-hero h1");
        if (heroHeading) {
            heroHeading.textContent = `${student.fullName.split(" ")[0]}, Here's Your Path`;
        }
    }

    /* ---------------------------------------------------
       4. SCORE BREAKDOWN BARS
       Maps each track to its two element IDs in the HTML.
    --------------------------------------------------- */

    const SCORE_ELEMENT_IDS = {
        lowLevel: { text: "low-level-score", bar: "low-level-bar" },
        fullstack: { text: "full-stack-score", bar: "full-stack-bar" },
        arvr: { text: "arvr-score", bar: "arvr-bar" },
        ml: { text: "machine-learning-score", bar: "machine-learning-bar" }
    };

    Object.keys(SCORE_ELEMENT_IDS).forEach((track) => {
        const { text, bar } = SCORE_ELEMENT_IDS[track];
        const textEl = document.getElementById(text);
        const barEl = document.getElementById(bar);

        if (textEl) textEl.textContent = `${percentages[track]}%`;

        if (barEl) {
            // Start at 0% and animate to the real value on the next frame,
            // so the CSS transition (already on .score-progress-fill) plays.
            barEl.style.width = "0%";
            requestAnimationFrame(() => {
                barEl.style.width = `${percentages[track]}%`;
            });
        }
    });

    /* ---------------------------------------------------
       5. EXPLANATION
    --------------------------------------------------- */

    const explanationEl = document.getElementById("recommendation-explanation");
    if (explanationEl) {
        explanationEl.innerHTML = "";
        content.explanation.forEach((paragraph) => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            explanationEl.appendChild(p);
        });
    }

    /* ---------------------------------------------------
       6. SKILLS / CAREERS / RESOURCES CARDS
       Generic renderer since all three follow the same
       icon + title + text card shape.
    --------------------------------------------------- */

    function renderCards(containerId, items, cardClass) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";
        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = cardClass;
            card.innerHTML = `
                <i class="ph ${item.icon}" aria-hidden="true"></i>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            `;
            container.appendChild(card);
        });
    }

    renderCards("skills-container", content.skills, "skill-card");
    renderCards("careers-container", content.careers, "career-card");
    renderCards("resources-container", content.resources, "resource-card");

    /* =========================================================
       7. PURE CANVAS RENDERING ENGINE (Stage 3, Step C)
       =========================================================
       Draws a radar/spider chart on #results-chart showing all
       four specialization scores at once. No charting library —
       just the 2D Canvas API: arcs, paths, gradients, and text.
    ========================================================= */

    function renderResultsChart() {
        const canvas = document.getElementById("results-chart");
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return; // canvas not supported in this environment
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const maxRadius = Math.min(width, height) / 2 - 60;

        const axes = ["fullstack", "ml", "arvr", "lowLevel"]; // clockwise order around the chart
        const axisCount = axes.length;
        const ringLevels = [0.2, 0.4, 0.6, 0.8, 1.0]; // 20% increments

        ctx.clearRect(0, 0, width, height);

        // Helper: angle for axis index (start at top, go clockwise)
        function angleForIndex(i) {
            return (Math.PI * 2 * i) / axisCount - Math.PI / 2;
        }

        // Helper: x/y for a given axis index at a given 0–1 fraction of maxRadius
        function pointFor(i, fraction) {
            const angle = angleForIndex(i);
            return {
                x: centerX + Math.cos(angle) * maxRadius * fraction,
                y: centerY + Math.sin(angle) * maxRadius * fraction
            };
        }

        // --- Background rings (grid) ---
        ctx.strokeStyle = "rgba(45, 90, 74, 0.15)";
        ctx.lineWidth = 1;
        ringLevels.forEach((level) => {
            ctx.beginPath();
            for (let i = 0; i <= axisCount; i++) {
                const p = pointFor(i % axisCount, level);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        });

        // --- Axis lines + labels ---
        ctx.strokeStyle = "rgba(45, 90, 74, 0.3)";
        ctx.fillStyle = "#333";
        ctx.font = "13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        axes.forEach((track, i) => {
            const outer = pointFor(i, 1);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(outer.x, outer.y);
            ctx.stroke();

            // Push the label slightly further out than the axis line ends
            const labelPoint = pointFor(i, 1.18);
            ctx.fillText(TRACK_LABELS[track], labelPoint.x, labelPoint.y);
        });

        // --- Data polygon (the actual scores) ---
        ctx.beginPath();
        axes.forEach((track, i) => {
            const fraction = percentages[track] / 100;
            const p = pointFor(i, fraction);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        // Gradient fill using the site's accent color
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0, "rgba(201, 226, 14, 0.45)");
        gradient.addColorStop(1, "rgba(45, 90, 74, 0.25)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = "#2D5A4A";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // --- Vertex dots (highlight the top track) ---
        axes.forEach((track, i) => {
            const fraction = percentages[track] / 100;
            const p = pointFor(i, fraction);
            const isTop = track === topTrack;

            ctx.beginPath();
            ctx.arc(p.x, p.y, isTop ? 7 : 5, 0, Math.PI * 2);
            ctx.fillStyle = isTop ? "#C9E20E" : "#2D5A4A";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();
        });

        // --- Center label for the top track ---
        ctx.font = "bold 14px Quicksand, sans-serif";
        ctx.fillStyle = "#2D5A4A";
    }

    renderResultsChart();

    // Redraw if the canvas's on-screen size changes (e.g. window resize
    // on a responsive layout) — canvas content doesn't auto-scale itself.
    window.addEventListener("resize", () => {
        renderResultsChart();
    });

});