/* =========================================================
   QUIZ.JS
   =========================================================
   Flow:
   - #quiz-introduction shown first, with #start-quiz button
   - Clicking Start hides the intro, reveals #quiz-container,
     and starts the countdown (via timer.js's startCountdown)
   - 10 questions, Previous/Next navigation (#previous-button /
     #next-button), answers kept in state so navigating back
     shows your previous selection
   - On finish (Next on Q10, or timer expires), scores are
     saved to sessionStorage and #quiz-complete is shown with
     a "View My Results" button that navigates to results.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       1. QUESTION BANK
    --------------------------------------------------- */

    const QUESTION_BANK = [
        {
            // INTERACTIVE MEDIA: Image Hotspot / Coordinate Selection.
            // Instead of text buttons, this question renders an SVG
            // "career map" into #question-media. Each zone is an SVG
            // <g> with a data-track attribute; clicking anywhere inside
            // that group (circle, icon, or label) records the answer —
            // this is the "SVG overlay" coordinate-selection approach.
            type: "hotspot",
            category: "Interests",
            question: "Click the zone on the map that excites you most.",
            zones: [
                { track: "lowLevel", cx: 150, cy: 130, label: "Systems & Hardware" },
                { track: "arvr", cx: 450, cy: 130, label: "Immersive Worlds" },
                { track: "fullstack", cx: 150, cy: 330, label: "Web Applications" },
                { track: "ml", cx: 450, cy: 330, label: "Data & Intelligence" }
            ]
        },
        {
            category: "Project Preference",
            question: "Pick a project you'd love to build:",
            options: [
                { text: "A VR training simulator", track: "arvr" },
                { text: "A full e-commerce platform", track: "fullstack" },
                { text: "A recommendation engine", track: "ml" },
                { text: "A tiny operating system kernel", track: "lowLevel" }
            ]
        },
        {
            category: "Tools & Technologies",
            question: "Which tool excites you most?",
            options: [
                { text: "A web framework like React", track: "fullstack" },
                { text: "A neural network library like PyTorch", track: "ml" },
                { text: "A debugger stepping through assembly", track: "lowLevel" },
                { text: "A 3D engine like Unity", track: "arvr" }
            ]
        },
        {
            category: "Work Style",
            question: "What's your ideal work environment?",
            options: [
                { text: "Running experiments and tuning models", track: "ml" },
                { text: "Deep in hardware manuals and memory maps", track: "lowLevel" },
                { text: "Sketching spatial interactions and prototypes", track: "arvr" },
                { text: "Juggling front-end design and back-end APIs", track: "fullstack" }
            ]
        },
        {
            category: "Academic Interest",
            question: "Which course sounds most exciting?",
            options: [
                { text: "Computer Graphics", track: "arvr" },
                { text: "Operating Systems", track: "lowLevel" },
                { text: "Machine Learning Fundamentals", track: "ml" },
                { text: "Web Application Development", track: "fullstack" }
            ]
        },
        {
            category: "Career Goals",
            question: "What's your dream job title?",
            options: [
                { text: "ML Engineer", track: "ml" },
                { text: "Full-Stack Developer", track: "fullstack" },
                { text: "AR/VR Developer", track: "arvr" },
                { text: "Systems / Embedded Engineer", track: "lowLevel" }
            ]
        },
        {
            category: "Problem Solving",
            question: "When you hit a tough bug, which explanation is most satisfying?",
            options: [
                { text: "It traces back to a memory address / pointer issue", track: "lowLevel" },
                { text: "It's a data or model training issue", track: "ml" },
                { text: "It's a rendering or interaction glitch in 3D space", track: "arvr" },
                { text: "It's an API or database mismatch", track: "fullstack" }
            ]
        },
        {
            category: "Learning Style",
            question: "Which tutorial would you click on first?",
            options: [
                { text: "\"Build your first REST API\"", track: "fullstack" },
                { text: "\"Intro to convolutional neural networks\"", track: "ml" },
                { text: "\"Writing a bootloader from scratch\"", track: "lowLevel" },
                { text: "\"Building your first VR scene in Unity\"", track: "arvr" }
            ]
        },
        {
            // INTERACTIVE MEDIA: Video Scenario Question. The video
            // plays until it hits `pauseAt` seconds, at which point a
            // 'timeupdate' listener pauses it and reveals the decision
            // prompt below — the student can't answer until that point
            // is reached (or they scrub/skip to it themselves).
            type: "video",
            category: "Motivation",
            question: "Watch the clip below. When it pauses, choose what draws you in most.",
            videoSrc: "Video/path-fullstack.mp4",
            pauseAt: 3, // seconds — adjust to match your actual clip length
            options: [
                { text: "Squeezing every bit of performance out of a system", track: "lowLevel" },
                { text: "Creating experiences people can step inside", track: "arvr" },
                { text: "Shipping a product real users interact with daily", track: "fullstack" },
                { text: "Discovering patterns hidden in data", track: "ml" }
            ]
        },
        {
            category: "Future Outlook",
            question: "Five years from now, what would make you proudest?",
            options: [
                { text: "Having shipped a widely-used web application", track: "fullstack" },
                { text: "Having trained a model that solves a real problem", track: "ml" },
                { text: "Having built a VR/AR experience people love", track: "arvr" },
                { text: "Having contributed to an OS or embedded system", track: "lowLevel" }
            ]
        }
    ];

    const TOTAL_TIME_SECONDS = 10 * 10;

    // SCORING ENGINE: speed/streak multiplier constants.
    // Answering within FAST_ANSWER_MS of a question appearing counts
    // as "fast" and builds a streak; consecutive fast answers scale
    // the bonus multiplier up. A slow answer resets the streak.
    const FAST_ANSWER_MS = 6000; // 6 seconds
    const BASE_BONUS_POINTS = 10; // points per fast answer before multiplier

    const TRACK_LABELS = {
        lowLevel: "Low-Level Programming",
        arvr: "AR / VR",
        fullstack: "Full-Stack Web Development",
        ml: "Machine Learning"
    };

    /* ---------------------------------------------------
       2. STATE
    --------------------------------------------------- */

    let currentIndex = 0;
    let answers = new Array(QUESTION_BANK.length).fill(null);

    // Speed/streak scoring state
    let questionShownAt = 0;   // timestamp when the current question appeared
    let currentStreak = 0;     // consecutive fast answers in a row
    let bestStreak = 0;        // highest streak reached this attempt
    let speedBonusScore = 0;   // accumulated bonus points from fast answers

    /* ---------------------------------------------------
       3. MEDIA EVENTS — answer-select sound
       (the timer's own tick sound lives in timer.js)
    --------------------------------------------------- */

    const selectSound = new Audio("https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3");

    selectSound.addEventListener("ended", () => {
        console.log("Select sound finished playing.");
    });

    function playSelectSound() {
        try {
            selectSound.currentTime = 0;
            const playPromise = selectSound.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => { /* autoplay may be blocked, ignore */ });
            }
        } catch (err) {
            console.warn("Select sound unavailable:", err);
        }
    }

    /* ---------------------------------------------------
       4. DOM REFERENCES (match quiz.html exactly)
    --------------------------------------------------- */

    const introSection = document.getElementById("quiz-introduction");
    const startBtn = document.getElementById("start-quiz");
    const quizContainer = document.getElementById("quiz-container");

    const currentQEl = document.getElementById("current-question");
    const totalQEl = document.getElementById("total-questions");
    const progressBar = document.getElementById("progress-bar");

    const categoryEl = document.getElementById("question-category");
    const questionTextEl = document.getElementById("question-text");
    const questionMedia = document.getElementById("question-media");
    const answersContainer = document.getElementById("answers-container");

    const prevBtn = document.getElementById("previous-button");
    const nextBtn = document.getElementById("next-button");

    const timeoutMessage = document.getElementById("timeout-message");
    const quizCard = document.getElementById("quiz-card");

    const quizCompleteSection = document.getElementById("quiz-complete");
    const viewResultsBtn = document.getElementById("view-results");

    if (!startBtn || !quizContainer) {
        // Safety check: log what's missing instead of alerting (alert()
        // popups aren't permitted per the assignment's UI feedback rules).
        const missing = [];
        if (!introSection) missing.push("#quiz-introduction");
        if (!startBtn) missing.push("#start-quiz");
        if (!quizContainer) missing.push("#quiz-container");
        if (!currentQEl) missing.push("#current-question");
        if (!totalQEl) missing.push("#total-questions");
        if (!progressBar) missing.push("#progress-bar");
        if (!categoryEl) missing.push("#question-category");
        if (!questionTextEl) missing.push("#question-text");
        if (!questionMedia) missing.push("#question-media");
        if (!answersContainer) missing.push("#answers-container");
        if (!prevBtn) missing.push("#previous-button");
        if (!nextBtn) missing.push("#next-button");
        if (!timeoutMessage) missing.push("#timeout-message");
        if (!quizCard) missing.push("#quiz-card");
        if (!quizCompleteSection) missing.push("#quiz-complete");
        if (!viewResultsBtn) missing.push("#view-results");

        console.error("quiz.js can't find these elements:", missing.join(", ") || "(unknown)");
        return;
    }

    /* ---------------------------------------------------
       5. START
    --------------------------------------------------- */

    totalQEl.textContent = QUESTION_BANK.length;

    startBtn.addEventListener("click", () => {
        try {
            introSection.classList.add("hidden");
            quizContainer.classList.remove("hidden");

            // Reset scoring state in case this isn't the first attempt
            currentStreak = 0;
            bestStreak = 0;
            speedBonusScore = 0;

            if (typeof startCountdown !== "function") {
                console.error("startCountdown() is not defined — js/timer.js did not load.");
                return;
            }

            // startCountdown / stopCountdown come from timer.js, loaded
            // alongside this file. handleTimeExpired runs when it hits 0.
            startCountdown(TOTAL_TIME_SECONDS, handleTimeExpired);

            renderQuestion();
        } catch (err) {
            console.error("Error starting quiz:", err);
        }
    });

    /* ---------------------------------------------------
       6. TIME EXPIRED
       #timeout-message already exists in the HTML (just hidden) —
       reveal it, lock the question card, then finish after a pause.
    --------------------------------------------------- */

    function handleTimeExpired() {
        timeoutMessage.classList.remove("hidden");
        quizCard.classList.add("quiz-locked");

        setTimeout(finishQuiz, 1800);
    }

    /* ---------------------------------------------------
       7. RENDER A QUESTION
    --------------------------------------------------- */

    function renderQuestion() {
        const q = QUESTION_BANK[currentIndex];

        // Start the per-question speed clock the moment it's shown —
        // re-stamped even on revisits, so navigating back and re-answering
        // is judged on THIS viewing's speed, not the original one.
        questionShownAt = Date.now();

        currentQEl.textContent = currentIndex + 1;
        categoryEl.textContent = q.category;
        questionTextEl.textContent = q.question;
        progressBar.style.width = `${((currentIndex + 1) / QUESTION_BANK.length) * 100}%`;

        if (q.type === "hotspot") {
            renderHotspotQuestion(q);
        } else if (q.type === "video") {
            renderVideoQuestion(q);
        } else {
            renderChoiceQuestion(q);
        }

        prevBtn.disabled = currentIndex === 0;
        nextBtn.textContent = ""; // rebuild below so the arrow icon survives
        nextBtn.append(currentIndex === QUESTION_BANK.length - 1 ? "See Results " : "Next ");
        const arrowIcon = document.createElement("i");
        arrowIcon.className = "ph ph-arrow-right";
        nextBtn.appendChild(arrowIcon);
        nextBtn.disabled = answers[currentIndex] === null;
    }

    /* ---------------------------------------------------
       7a. RENDER A STANDARD MULTIPLE-CHOICE QUESTION
    --------------------------------------------------- */

    function renderChoiceQuestion(q) {
        questionMedia.classList.add("hidden");
        questionMedia.innerHTML = "";
        answersContainer.classList.remove("hidden");

        answersContainer.innerHTML = "";
        q.options.forEach((option) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "answer-option";
            btn.textContent = option.text;

            if (answers[currentIndex] === option.track) {
                btn.classList.add("selected");
            }

            btn.addEventListener("click", () => selectAnswer(option.track));
            answersContainer.appendChild(btn);
        });
    }

    /* ---------------------------------------------------
       7b. RENDER AN IMAGE HOTSPOT / SVG COORDINATE QUESTION
       Builds an inline SVG with one clickable <g> per zone.
       Uses a viewBox (not fixed pixels) so it scales responsively
       inside its container — real "coordinate selection" via SVG
       overlay, no external image file needed.
    --------------------------------------------------- */

    function renderHotspotQuestion(q) {
        answersContainer.innerHTML = "";
        answersContainer.classList.add("hidden"); // this question type doesn't use the button list

        questionMedia.classList.remove("hidden");
        questionMedia.innerHTML = buildHotspotSVG(q);

        // Wire up click handling on each zone group
        const zoneEls = questionMedia.querySelectorAll(".hotspot-zone");
        zoneEls.forEach((zoneEl) => {
            const track = zoneEl.dataset.track;

            if (answers[currentIndex] === track) {
                zoneEl.classList.add("selected");
            }

            zoneEl.addEventListener("click", () => {
                selectAnswer(track);
                zoneEls.forEach((z) => z.classList.toggle("selected", z.dataset.track === track));
            });
        });
    }

    // Builds the raw SVG markup string for the hotspot question.
    // Each zone is a circle + a simple hand-drawn icon (no external
    // image assets) + a text label, grouped so the whole thing is
    // one clickable target per specialization.
    function buildHotspotSVG(q) {
        const zoneMarkup = q.zones.map((zone) => `
            <g class="hotspot-zone" data-track="${zone.track}" tabindex="0" role="button" aria-label="${zone.label}">
                <circle class="hotspot-ring" cx="${zone.cx}" cy="${zone.cy}" r="55"></circle>
                ${hotspotIcon(zone.track, zone.cx, zone.cy)}
                <text class="hotspot-label" x="${zone.cx}" y="${zone.cy + 85}" text-anchor="middle">${zone.label}</text>
            </g>
        `).join("");

        return `
            <svg viewBox="0 0 600 460" class="hotspot-svg" role="img" aria-label="Career interest map — click a zone">
                ${zoneMarkup}
            </svg>
        `;
    }

    // Tiny hand-drawn vector icon per track, built from basic SVG
    // shapes only (no image files, no icon font — this needs to work
    // inside dynamically-generated SVG markup).
    function hotspotIcon(track, cx, cy) {
        switch (track) {
            case "lowLevel": // a little chip with pins
                return `
                    <rect x="${cx - 18}" y="${cy - 18}" width="36" height="36" rx="4" class="hotspot-icon-shape"></rect>
                    ${[-12, 0, 12].map((o) => `
                        <line x1="${cx + o}" y1="${cy - 26}" x2="${cx + o}" y2="${cy - 18}" class="hotspot-icon-line"></line>
                        <line x1="${cx + o}" y1="${cy + 18}" x2="${cx + o}" y2="${cy + 26}" class="hotspot-icon-line"></line>
                    `).join("")}
                `;
            case "arvr": // a headset shape
                return `
                    <rect x="${cx - 22}" y="${cy - 10}" width="44" height="24" rx="10" class="hotspot-icon-shape"></rect>
                    <circle cx="${cx - 10}" cy="${cy + 2}" r="5" class="hotspot-icon-lens"></circle>
                    <circle cx="${cx + 10}" cy="${cy + 2}" r="5" class="hotspot-icon-lens"></circle>
                `;
            case "fullstack": // a browser window
                return `
                    <rect x="${cx - 22}" y="${cy - 16}" width="44" height="32" rx="3" class="hotspot-icon-shape"></rect>
                    <line x1="${cx - 22}" y1="${cy - 6}" x2="${cx + 22}" y2="${cy - 6}" class="hotspot-icon-line"></line>
                `;
            case "ml": // three connected nodes
                return `
                    <circle cx="${cx}" cy="${cy - 16}" r="5" class="hotspot-icon-lens"></circle>
                    <circle cx="${cx - 16}" cy="${cy + 12}" r="5" class="hotspot-icon-lens"></circle>
                    <circle cx="${cx + 16}" cy="${cy + 12}" r="5" class="hotspot-icon-lens"></circle>
                    <line x1="${cx}" y1="${cy - 16}" x2="${cx - 16}" y2="${cy + 12}" class="hotspot-icon-line"></line>
                    <line x1="${cx}" y1="${cy - 16}" x2="${cx + 16}" y2="${cy + 12}" class="hotspot-icon-line"></line>
                    <line x1="${cx - 16}" y1="${cy + 12}" x2="${cx + 16}" y2="${cy + 12}" class="hotspot-icon-line"></line>
                `;
            default:
                return "";
        }
    }

    /* ---------------------------------------------------
       7c. RENDER A VIDEO SCENARIO QUESTION
       Plays a video; a 'timeupdate' listener watches for it
       reaching `pauseAt` seconds, then pauses playback and
       reveals the decision options below. The student can't
       answer before that point is reached (Next stays disabled
       via the normal answers[currentIndex] === null check).
    --------------------------------------------------- */

    function renderVideoQuestion(q) {
        questionMedia.classList.remove("hidden");
        questionMedia.innerHTML = "";

        answersContainer.classList.add("hidden"); // revealed once the pause point is hit
        answersContainer.innerHTML = "";

        const video = document.createElement("video");
        video.src = q.videoSrc;
        video.controls = true;
        video.className = "scenario-video";
        video.setAttribute("aria-label", "Scenario video — watch until it pauses");

        let revealed = false;

        // The core requirement: a timeupdate listener that catches the
        // video crossing the pauseAt timestamp and pauses it there.
        video.addEventListener("timeupdate", () => {
            if (!revealed && video.currentTime >= q.pauseAt) {
                video.pause();
                revealed = true;
                revealVideoOptions(q);
            }
        });

        questionMedia.appendChild(video);

        // If the student already answered this question before (came
        // back via Previous), show the options immediately rather than
        // making them re-watch to the pause point.
        if (answers[currentIndex] !== null) {
            revealed = true;
            revealVideoOptions(q);
        }
    }

    function revealVideoOptions(q) {
        answersContainer.classList.remove("hidden");
        answersContainer.innerHTML = "";

        q.options.forEach((option) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "answer-option";
            btn.textContent = option.text;

            if (answers[currentIndex] === option.track) {
                btn.classList.add("selected");
            }

            btn.addEventListener("click", () => selectAnswer(option.track));
            answersContainer.appendChild(btn);
        });
    }

    /* ---------------------------------------------------
       8. HANDLE AN ANSWER SELECTION
    --------------------------------------------------- */

    function selectAnswer(track) {
        const isFirstAnswer = answers[currentIndex] === null;
        answers[currentIndex] = track;
        playSelectSound();

        // SCORING ENGINE: only score speed/streak on the first time this
        // question is answered — re-clicking after navigating back
        // shouldn't let someone farm streak bonuses by re-selecting fast.
        if (isFirstAnswer) {
            const elapsed = Date.now() - questionShownAt;
            const isFast = elapsed <= FAST_ANSWER_MS;

            if (isFast) {
                currentStreak += 1;
                bestStreak = Math.max(bestStreak, currentStreak);
                const multiplier = getStreakMultiplier(currentStreak);
                speedBonusScore += Math.round(BASE_BONUS_POINTS * multiplier);
            } else {
                currentStreak = 0; // slow answer breaks the streak, no bonus
            }
        }

        const q = QUESTION_BANK[currentIndex];
        if (q.type !== "hotspot") {
            [...answersContainer.children].forEach((btn) => {
                btn.classList.toggle("selected", btn.textContent === trackOptionText(track));
            });
        }
        // Hotspot zone highlighting is handled directly in
        // renderHotspotQuestion's click listener, since zones are
        // identified by data-track rather than button text.

        nextBtn.disabled = false;
    }

    // Tiered multiplier: the longer the streak of fast answers, the
    // bigger the bonus — a simple dynamic scoring curve using plain
    // JS logic, no external library.
    function getStreakMultiplier(streak) {
        if (streak >= 5) return 2.0;
        if (streak >= 3) return 1.5;
        return 1.2; // streak of 1–2: still fast, smaller bonus
    }

    function trackOptionText(track) {
        const q = QUESTION_BANK[currentIndex];
        const match = q.options.find((opt) => opt.track === track);
        return match ? match.text : "";
    }

    /* ---------------------------------------------------
       9. NAVIGATION
    --------------------------------------------------- */

    prevBtn.addEventListener("click", () => {
        if (currentIndex === 0) return;
        currentIndex -= 1;
        renderQuestion();
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex === QUESTION_BANK.length - 1) {
            finishQuiz();
        } else {
            currentIndex += 1;
            renderQuestion();
        }
    });

    /* ---------------------------------------------------
       10. FINISH
       Shows the #quiz-complete screen instead of redirecting
       immediately — #view-results is what actually navigates
       to results.html, once the student is ready.
    --------------------------------------------------- */

    let finished = false;

    function finishQuiz() {
        if (finished) return; // guards against double-invocation (timeout + Next both calling this)
        finished = true;

        stopCountdown();
        progressBar.style.width = "100%";

        const scores = { lowLevel: 0, arvr: 0, fullstack: 0, ml: 0 };
        answers.forEach((track) => {
            if (track) scores[track] += 1;
        });

        const topTrack = Object.keys(scores).reduce((best, key) =>
            scores[key] > scores[best] ? key : best
        , Object.keys(scores)[0]);

        console.log("Final scores:", scores, "Top track:", topTrack, TRACK_LABELS[topTrack]);
        console.log("Speed bonus:", speedBonusScore, "Best streak:", bestStreak);

        sessionStorage.setItem("careervision_scores", JSON.stringify(scores));
        sessionStorage.setItem("careervision_top_track", topTrack);
        sessionStorage.setItem("careervision_speed_bonus", String(speedBonusScore));
        sessionStorage.setItem("careervision_best_streak", String(bestStreak));

        quizContainer.classList.add("hidden");
        quizCompleteSection.classList.remove("hidden");

        renderSpeedStats();
    }

    // Injects a small stats readout into the completion screen —
    // built in JS rather than requiring a quiz.html edit, so this
    // feature works even against your existing markup.
    function renderSpeedStats() {
        const existing = quizCompleteSection.querySelector(".speed-stats");
        if (existing) existing.remove(); // avoid duplicating on repeat calls

        const statsEl = document.createElement("div");
        statsEl.className = "speed-stats";
        statsEl.innerHTML = `
            <div class="speed-stat">
                <i class="ph ph-lightning"></i>
                <span>${speedBonusScore} Speed Bonus Points</span>
            </div>
            <div class="speed-stat">
                <i class="ph ph-fire"></i>
                <span>Best Streak: ${bestStreak}</span>
            </div>
        `;

        const heading = quizCompleteSection.querySelector("h2");
        if (heading) {
            heading.insertAdjacentElement("afterend", statsEl);
        } else {
            quizCompleteSection.appendChild(statsEl);
        }
    }

    viewResultsBtn.addEventListener("click", () => {
        window.location.href = "results.html";
    });

});