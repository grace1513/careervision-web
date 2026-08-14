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

    // TEMP DEBUG: confirms this script actually loaded and ran.
    console.log("quiz.js: DOMContentLoaded fired, script is running.");

    /* ---------------------------------------------------
       1. QUESTION BANK
    --------------------------------------------------- */

    const QUESTION_BANK = [
        {
            category: "Interests",
            question: "Which activity sounds the most enjoyable to you?",
            options: [
                { text: "Optimizing code to run faster on limited hardware", track: "lowLevel" },
                { text: "Designing an immersive 3D world users can walk through", track: "arvr" },
                { text: "Building a website from front-end to back-end", track: "fullstack" },
                { text: "Teaching a computer to recognize patterns in data", track: "ml" }
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
            category: "Motivation",
            question: "What motivates you most in software engineering?",
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

    const TOTAL_TIME_SECONDS = 10 * 10; // 10 questions, 10 seconds each

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
    const answersContainer = document.getElementById("answers-container");

    const prevBtn = document.getElementById("previous-button");
    const nextBtn = document.getElementById("next-button");

    const timeoutMessage = document.getElementById("timeout-message");
    const quizCard = document.getElementById("quiz-card");

    const quizCompleteSection = document.getElementById("quiz-complete");
    const viewResultsBtn = document.getElementById("view-results");

    if (!startBtn || !quizContainer) {
        // TEMP DEBUG: makes it obvious on-screen if quiz.js can't find
        // the elements it needs — remove once confirmed working.
        const missing = [];
        if (!introSection) missing.push("#quiz-introduction");
        if (!startBtn) missing.push("#start-quiz");
        if (!quizContainer) missing.push("#quiz-container");
        if (!currentQEl) missing.push("#current-question");
        if (!totalQEl) missing.push("#total-questions");
        if (!progressBar) missing.push("#progress-bar");
        if (!categoryEl) missing.push("#question-category");
        if (!questionTextEl) missing.push("#question-text");
        if (!answersContainer) missing.push("#answers-container");
        if (!prevBtn) missing.push("#previous-button");
        if (!nextBtn) missing.push("#next-button");
        if (!timeoutMessage) missing.push("#timeout-message");
        if (!quizCard) missing.push("#quiz-card");
        if (!quizCompleteSection) missing.push("#quiz-complete");
        if (!viewResultsBtn) missing.push("#view-results");

        if (missing.length) {
            alert("quiz.js can't find these elements: " + missing.join(", "));
        } else {
            alert("quiz.js loaded but startBtn/quizContainer check still failed unexpectedly.");
        }
        return;
    }

    console.log("quiz.js: all elements found, start button listener attaching now.");

    /* ---------------------------------------------------
       5. START
    --------------------------------------------------- */

    totalQEl.textContent = QUESTION_BANK.length;

    startBtn.addEventListener("click", () => {
        try {
            console.log("Start button clicked.");
            introSection.classList.add("hidden");
            quizContainer.classList.remove("hidden");

            if (typeof startCountdown !== "function") {
                alert("startCountdown() is not defined — js/timer.js did not load. Check the file path/name.");
                return;
            }

            // startCountdown / stopCountdown come from timer.js, loaded
            // alongside this file. handleTimeExpired runs when it hits 0.
            startCountdown(TOTAL_TIME_SECONDS, handleTimeExpired);

            renderQuestion();
        } catch (err) {
            // TEMP DEBUG: surfaces the real error directly on screen.
            alert("Error starting quiz: " + err.message);
            console.error(err);
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

        currentQEl.textContent = currentIndex + 1;
        categoryEl.textContent = q.category;
        questionTextEl.textContent = q.question;
        progressBar.style.width = `${((currentIndex + 1) / QUESTION_BANK.length) * 100}%`;

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

        prevBtn.disabled = currentIndex === 0;
        nextBtn.textContent = ""; // rebuild below so the arrow icon survives
        nextBtn.append(currentIndex === QUESTION_BANK.length - 1 ? "See Results " : "Next ");
        const arrowIcon = document.createElement("i");
        arrowIcon.className = "ph ph-arrow-right";
        nextBtn.appendChild(arrowIcon);
        nextBtn.disabled = answers[currentIndex] === null;
    }

    /* ---------------------------------------------------
       8. HANDLE AN ANSWER SELECTION
    --------------------------------------------------- */

    function selectAnswer(track) {
        answers[currentIndex] = track;
        playSelectSound();

        [...answersContainer.children].forEach((btn) => {
            btn.classList.toggle("selected", btn.textContent === trackOptionText(track));
        });

        nextBtn.disabled = false;
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

        sessionStorage.setItem("careervision_scores", JSON.stringify(scores));
        sessionStorage.setItem("careervision_top_track", topTrack);

        quizContainer.classList.add("hidden");
        quizCompleteSection.classList.remove("hidden");
    }

    viewResultsBtn.addEventListener("click", () => {
        window.location.href = "results.html";
    });

});