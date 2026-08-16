/* =========================================================
   QUIZ.JS
   =========================================================
   CareerVision Quiz

   Quiz outcomes:
   1. COMPLETE - all questions answered
   2. PARTIAL  - some questions answered when time expires
   3. NONE     - no questions answered when time expires

   The quiz remains 1 minute long.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       1. QUESTION BANK
    --------------------------------------------------- */

    const QUESTION_BANK = [

        {
            type: "hotspot",
            category: "Interests",
            question: "Click the zone on the map that excites you most.",
            zones: [
                {
                    track: "lowLevel",
                    cx: 150,
                    cy: 130,
                    label: "Systems & Hardware"
                },
                {
                    track: "arvr",
                    cx: 450,
                    cy: 130,
                    label: "Immersive Worlds"
                },
                {
                    track: "fullstack",
                    cx: 150,
                    cy: 330,
                    label: "Web Applications"
                },
                {
                    track: "ml",
                    cx: 450,
                    cy: 330,
                    label: "Data & Intelligence"
                }
            ]
        },

        {
            category: "Project Preference",
            question: "Pick a project you'd love to build:",
            options: [
                {
                    text: "A VR training simulator",
                    track: "arvr"
                },
                {
                    text: "A full e-commerce platform",
                    track: "fullstack"
                },
                {
                    text: "A recommendation engine",
                    track: "ml"
                },
                {
                    text: "A tiny operating system kernel",
                    track: "lowLevel"
                }
            ]
        },

        {
            category: "Tools & Technologies",
            question: "Which tool excites you most?",
            options: [
                {
                    text: "A web framework like React",
                    track: "fullstack"
                },
                {
                    text: "A neural network library like PyTorch",
                    track: "ml"
                },
                {
                    text: "A debugger stepping through assembly",
                    track: "lowLevel"
                },
                {
                    text: "A 3D engine like Unity",
                    track: "arvr"
                }
            ]
        },

        {
            category: "Work Style",
            question: "What's your ideal work environment?",
            options: [
                {
                    text: "Running experiments and tuning models",
                    track: "ml"
                },
                {
                    text: "Deep in hardware manuals and memory maps",
                    track: "lowLevel"
                },
                {
                    text: "Sketching spatial interactions and prototypes",
                    track: "arvr"
                },
                {
                    text: "Juggling front-end design and back-end APIs",
                    track: "fullstack"
                }
            ]
        },

        {
            category: "Academic Interest",
            question: "Which course sounds most exciting?",
            options: [
                {
                    text: "Computer Graphics",
                    track: "arvr"
                },
                {
                    text: "Operating Systems",
                    track: "lowLevel"
                },
                {
                    text: "Machine Learning Fundamentals",
                    track: "ml"
                },
                {
                    text: "Web Application Development",
                    track: "fullstack"
                }
            ]
        },

        {
            category: "Career Goals",
            question: "What's your dream job title?",
            options: [
                {
                    text: "ML Engineer",
                    track: "ml"
                },
                {
                    text: "Full-Stack Developer",
                    track: "fullstack"
                },
                {
                    text: "AR/VR Developer",
                    track: "arvr"
                },
                {
                    text: "Systems / Embedded Engineer",
                    track: "lowLevel"
                }
            ]
        },

        {
            category: "Problem Solving",
            question:
                "When you hit a tough bug, which explanation is most satisfying?",
            options: [
                {
                    text: "It traces back to a memory address / pointer issue",
                    track: "lowLevel"
                },
                {
                    text: "It's a data or model training issue",
                    track: "ml"
                },
                {
                    text: "It's a rendering or interaction glitch in 3D space",
                    track: "arvr"
                },
                {
                    text: "It's an API or database mismatch",
                    track: "fullstack"
                }
            ]
        },

        {
            category: "Learning Style",
            question: "Which tutorial would you click on first?",
            options: [
                {
                    text: "\"Build your first REST API\"",
                    track: "fullstack"
                },
                {
                    text: "\"Intro to convolutional neural networks\"",
                    track: "ml"
                },
                {
                    text: "\"Writing a bootloader from scratch\"",
                    track: "lowLevel"
                },
                {
                    text: "\"Building your first VR scene in Unity\"",
                    track: "arvr"
                }
            ]
        },

        {
            type: "video",
            category: "Motivation",
            question:
                "Watch the clip below. When it pauses, choose what draws you in most.",

            videoSrc: "Video/path-fullstack.mp4",

            pauseAt: 3,

            options: [
                {
                    text:
                        "Squeezing every bit of performance out of a system",
                    track: "lowLevel"
                },
                {
                    text:
                        "Creating experiences people can step inside",
                    track: "arvr"
                },
                {
                    text:
                        "Shipping a product real users interact with daily",
                    track: "fullstack"
                },
                {
                    text:
                        "Discovering patterns hidden in data",
                    track: "ml"
                }
            ]
        },

        {
            category: "Future Outlook",
            question:
                "Five years from now, what would make you proudest?",
            options: [
                {
                    text:
                        "Having shipped a widely-used web application",
                    track: "fullstack"
                },
                {
                    text:
                        "Having trained a model that solves a real problem",
                    track: "ml"
                },
                {
                    text:
                        "Having built a VR/AR experience people love",
                    track: "arvr"
                },
                {
                    text:
                        "Having contributed to an OS or embedded system",
                    track: "lowLevel"
                }
            ]
        }

    ];


    /* ---------------------------------------------------
       2. QUIZ SETTINGS
    --------------------------------------------------- */

    // KEEP THE QUIZ AT ONE MINUTE
    const TOTAL_TIME_SECONDS = 60;

    // Fast-answer threshold
    const FAST_ANSWER_MS = 6000;

    // Bonus points for fast answers
    const BASE_BONUS_POINTS = 10;


    const TRACK_LABELS = {

        lowLevel: "Low-Level Programming",

        arvr: "AR / VR",

        fullstack: "Full-Stack Web Development",

        ml: "Machine Learning"

    };


    /* ---------------------------------------------------
       3. STATE
    --------------------------------------------------- */

    let currentIndex = 0;

    let answers =
        new Array(QUESTION_BANK.length).fill(null);

    let questionShownAt = 0;

    let currentStreak = 0;

    let bestStreak = 0;

    let speedBonusScore = 0;

    let finished = false;


    /* ---------------------------------------------------
       4. SELECT SOUND
    --------------------------------------------------- */

    const selectSound =
        new Audio(
            "https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3"
        );


    selectSound.addEventListener("ended", () => {

        console.log("Select sound finished playing.");

    });


    function playSelectSound() {

        try {

            selectSound.currentTime = 0;

            const playPromise =
                selectSound.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {});

            }

        } catch (err) {

            console.warn(
                "Select sound unavailable:",
                err
            );

        }

    }


    /* ---------------------------------------------------
       5. DOM REFERENCES
    --------------------------------------------------- */

    const introSection =
        document.getElementById(
            "quiz-introduction"
        );

    const startBtn =
        document.getElementById(
            "start-quiz"
        );

    const quizContainer =
        document.getElementById(
            "quiz-container"
        );

    const currentQEl =
        document.getElementById(
            "current-question"
        );

    const totalQEl =
        document.getElementById(
            "total-questions"
        );

    const progressBar =
        document.getElementById(
            "progress-bar"
        );

    const categoryEl =
        document.getElementById(
            "question-category"
        );

    const questionTextEl =
        document.getElementById(
            "question-text"
        );

    const questionMedia =
        document.getElementById(
            "question-media"
        );

    const answersContainer =
        document.getElementById(
            "answers-container"
        );

    const prevBtn =
        document.getElementById(
            "previous-button"
        );

    const nextBtn =
        document.getElementById(
            "next-button"
        );

    const timeoutMessage =
        document.getElementById(
            "timeout-message"
        );

    const quizCard =
        document.getElementById(
            "quiz-card"
        );

    const quizCompleteSection =
        document.getElementById(
            "quiz-complete"
        );

    const viewResultsBtn =
        document.getElementById(
            "view-results"
        );


    /* ---------------------------------------------------
       6. SAFETY CHECK
    --------------------------------------------------- */

    if (!startBtn || !quizContainer) {

        const missing = [];

        if (!introSection)
            missing.push("#quiz-introduction");

        if (!startBtn)
            missing.push("#start-quiz");

        if (!quizContainer)
            missing.push("#quiz-container");

        if (!currentQEl)
            missing.push("#current-question");

        if (!totalQEl)
            missing.push("#total-questions");

        if (!progressBar)
            missing.push("#progress-bar");

        if (!categoryEl)
            missing.push("#question-category");

        if (!questionTextEl)
            missing.push("#question-text");

        if (!questionMedia)
            missing.push("#question-media");

        if (!answersContainer)
            missing.push("#answers-container");

        if (!prevBtn)
            missing.push("#previous-button");

        if (!nextBtn)
            missing.push("#next-button");

        if (!timeoutMessage)
            missing.push("#timeout-message");

        if (!quizCard)
            missing.push("#quiz-card");

        if (!quizCompleteSection)
            missing.push("#quiz-complete");

        if (!viewResultsBtn)
            missing.push("#view-results");


        console.error(
            "quiz.js can't find:",
            missing.join(", ")
        );

        return;

    }


    /* ---------------------------------------------------
       7. INITIAL SETUP
    --------------------------------------------------- */

    totalQEl.textContent =
        QUESTION_BANK.length;


    /* ---------------------------------------------------
       8. START QUIZ
    --------------------------------------------------- */

    startBtn.addEventListener(
        "click",
        () => {

            try {

                introSection.classList.add(
                    "hidden"
                );

                quizContainer.classList.remove(
                    "hidden"
                );


                // Reset scoring
                currentIndex = 0;

                answers =
                    new Array(
                        QUESTION_BANK.length
                    ).fill(null);

                currentStreak = 0;

                bestStreak = 0;

                speedBonusScore = 0;

                finished = false;


                // Remove old completion data
                sessionStorage.removeItem(
                    "careervision_completion_status"
                );

                sessionStorage.removeItem(
                    "careervision_answered_count"
                );


                if (
                    typeof startCountdown !==
                    "function"
                ) {

                    console.error(
                        "startCountdown() is not defined."
                    );

                    return;

                }


                startCountdown(
                    TOTAL_TIME_SECONDS,
                    handleTimeExpired
                );


                renderQuestion();


            } catch (err) {

                console.error(
                    "Error starting quiz:",
                    err
                );

            }

        }
    );


    /* ===================================================
       9. TIME EXPIRED
    =================================================== */

    function handleTimeExpired() {

        const answeredCount =
            answers.filter(
                (answer) => answer !== null
            ).length;


        let completionStatus;


        // -----------------------------------------------
        // CASE 1: NOTHING ANSWERED
        // -----------------------------------------------

        if (answeredCount === 0) {

            completionStatus = "none";

            const heading =
                timeoutMessage.querySelector("h2");

            const paragraph =
                timeoutMessage.querySelector("p");


            if (heading) {

                heading.textContent =
                    "Time's Up!";

            }


            if (paragraph) {

                paragraph.textContent =
                    "You did not answer any questions. Your results cannot be meaningfully calculated. We recommend retaking the assessment.";

            }

        }


        // -----------------------------------------------
        // CASE 2: SOME ANSWERS
        // -----------------------------------------------

        else if (
            answeredCount <
            QUESTION_BANK.length
        ) {

            completionStatus = "partial";

            const heading =
                timeoutMessage.querySelector("h2");

            const paragraph =
                timeoutMessage.querySelector("p");


            if (heading) {

                heading.textContent =
                    "Time's Up!";

            }


            if (paragraph) {

                paragraph.textContent =
                    `You answered ${answeredCount} out of ${QUESTION_BANK.length} questions. Your results will be based on the answers you provided.`;

            }

        }


        // -----------------------------------------------
        // CASE 3: EVERYTHING ANSWERED
        // -----------------------------------------------

        else {

            completionStatus = "complete";

            const heading =
                timeoutMessage.querySelector("h2");

            const paragraph =
                timeoutMessage.querySelector("p");


            if (heading) {

                heading.textContent =
                    "Assessment Complete!";

            }


            if (paragraph) {

                paragraph.textContent =
                    "You answered all the questions. Your results are ready.";

            }

        }


        // Save status
        sessionStorage.setItem(
            "careervision_completion_status",
            completionStatus
        );


        sessionStorage.setItem(
            "careervision_answered_count",
            String(answeredCount)
        );


        // Lock quiz
        timeoutMessage.classList.remove(
            "hidden"
        );

        quizCard.classList.add(
            "quiz-locked"
        );


        // Finish after short message
        setTimeout(
            finishQuiz,
            1800
        );

    }


    /* ===================================================
       10. RENDER QUESTION
    =================================================== */

    function renderQuestion() {

        const q =
            QUESTION_BANK[currentIndex];


        questionShownAt =
            Date.now();


        currentQEl.textContent =
            currentIndex + 1;


        categoryEl.textContent =
            q.category;


        questionTextEl.textContent =
            q.question;


        progressBar.style.width =
            `${(
                (currentIndex + 1) /
                QUESTION_BANK.length
            ) * 100}%`;


        if (q.type === "hotspot") {

            renderHotspotQuestion(q);

        }

        else if (q.type === "video") {

            renderVideoQuestion(q);

        }

        else {

            renderChoiceQuestion(q);

        }


        // Previous
        prevBtn.disabled =
            currentIndex === 0;


        // Next button
        nextBtn.textContent = "";


        nextBtn.append(
            currentIndex ===
            QUESTION_BANK.length - 1
                ? "See Results "
                : "Next "
        );


        const arrowIcon =
            document.createElement("i");

        arrowIcon.className =
            "ph ph-arrow-right";


        nextBtn.appendChild(
            arrowIcon
        );


        // Disable until answer selected
        nextBtn.disabled =
            answers[currentIndex] === null;

    }


    /* ===================================================
       11. STANDARD MULTIPLE CHOICE
    =================================================== */

    function renderChoiceQuestion(q) {

        questionMedia.classList.add(
            "hidden"
        );

        questionMedia.innerHTML = "";


        answersContainer.classList.remove(
            "hidden"
        );

        answersContainer.innerHTML = "";


        q.options.forEach(
            (option) => {

                const btn =
                    document.createElement(
                        "button"
                    );


                btn.type = "button";

                btn.className =
                    "answer-option";

                btn.textContent =
                    option.text;


                if (
                    answers[currentIndex] ===
                    option.track
                ) {

                    btn.classList.add(
                        "selected"
                    );

                }


                btn.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            option.track
                        );

                    }
                );


                answersContainer.appendChild(
                    btn
                );

            }
        );

    }


    /* ===================================================
       12. HOTSPOT QUESTION
    =================================================== */

    function renderHotspotQuestion(q) {

        answersContainer.innerHTML = "";

        answersContainer.classList.add(
            "hidden"
        );


        questionMedia.classList.remove(
            "hidden"
        );


        questionMedia.innerHTML =
            buildHotspotSVG(q);


        const zoneEls =
            questionMedia.querySelectorAll(
                ".hotspot-zone"
            );


        zoneEls.forEach(
            (zoneEl) => {

                const track =
                    zoneEl.dataset.track;


                if (
                    answers[currentIndex] ===
                    track
                ) {

                    zoneEl.classList.add(
                        "selected"
                    );

                }


                zoneEl.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            track
                        );


                        zoneEls.forEach(
                            (z) => {

                                z.classList.toggle(
                                    "selected",
                                    z.dataset.track ===
                                    track
                                );

                            }
                        );

                    }
                );

            }
        );

    }


    function buildHotspotSVG(q) {

        const zoneMarkup =
            q.zones.map(
                (zone) => `

                    <g
                        class="hotspot-zone"
                        data-track="${zone.track}"
                        tabindex="0"
                        role="button"
                        aria-label="${zone.label}"
                    >

                        <circle
                            class="hotspot-ring"
                            cx="${zone.cx}"
                            cy="${zone.cy}"
                            r="55"
                        ></circle>

                        ${hotspotIcon(
                            zone.track,
                            zone.cx,
                            zone.cy
                        )}

                        <text
                            class="hotspot-label"
                            x="${zone.cx}"
                            y="${zone.cy + 85}"
                            text-anchor="middle"
                        >
                            ${zone.label}
                        </text>

                    </g>

                `
            ).join("");


        return `

            <svg
                viewBox="0 0 600 460"
                class="hotspot-svg"
                role="img"
                aria-label="Career interest map — click a zone"
            >

                ${zoneMarkup}

            </svg>

        `;

    }


    function hotspotIcon(
        track,
        cx,
        cy
    ) {

        switch (track) {

            case "lowLevel":

                return `

                    <rect
                        x="${cx - 18}"
                        y="${cy - 18}"
                        width="36"
                        height="36"
                        rx="4"
                        class="hotspot-icon-shape"
                    ></rect>

                    ${[-12, 0, 12].map(
                        (o) => `

                            <line
                                x1="${cx + o}"
                                y1="${cy - 26}"
                                x2="${cx + o}"
                                y2="${cy - 18}"
                                class="hotspot-icon-line"
                            ></line>

                            <line
                                x1="${cx + o}"
                                y1="${cy + 18}"
                                x2="${cx + o}"
                                y2="${cy + 26}"
                                class="hotspot-icon-line"
                            ></line>

                        `
                    ).join("")}

                `;


            case "arvr":

                return `

                    <rect
                        x="${cx - 22}"
                        y="${cy - 10}"
                        width="44"
                        height="24"
                        rx="10"
                        class="hotspot-icon-shape"
                    ></rect>

                    <circle
                        cx="${cx - 10}"
                        cy="${cy + 2}"
                        r="5"
                        class="hotspot-icon-lens"
                    ></circle>

                    <circle
                        cx="${cx + 10}"
                        cy="${cy + 2}"
                        r="5"
                        class="hotspot-icon-lens"
                    ></circle>

                `;


            case "fullstack":

                return `

                    <rect
                        x="${cx - 22}"
                        y="${cy - 16}"
                        width="44"
                        height="32"
                        rx="3"
                        class="hotspot-icon-shape"
                    ></rect>

                    <line
                        x1="${cx - 22}"
                        y1="${cy - 6}"
                        x2="${cx + 22}"
                        y2="${cy - 6}"
                        class="hotspot-icon-line"
                    ></line>

                `;


            case "ml":

                return `

                    <circle
                        cx="${cx}"
                        cy="${cy - 16}"
                        r="5"
                        class="hotspot-icon-lens"
                    ></circle>

                    <circle
                        cx="${cx - 16}"
                        cy="${cy + 12}"
                        r="5"
                        class="hotspot-icon-lens"
                    ></circle>

                    <circle
                        cx="${cx + 16}"
                        cy="${cy + 12}"
                        r="5"
                        class="hotspot-icon-lens"
                    ></circle>

                    <line
                        x1="${cx}"
                        y1="${cy - 16}"
                        x2="${cx - 16}"
                        y2="${cy + 12}"
                        class="hotspot-icon-line"
                    ></line>

                    <line
                        x1="${cx}"
                        y1="${cy - 16}"
                        x2="${cx + 16}"
                        y2="${cy + 12}"
                        class="hotspot-icon-line"
                    ></line>

                    <line
                        x1="${cx - 16}"
                        y1="${cy + 12}"
                        x2="${cx + 16}"
                        y2="${cy + 12}"
                        class="hotspot-icon-line"
                    ></line>

                `;


            default:

                return "";

        }

    }


    /* ===================================================
       13. VIDEO QUESTION
    =================================================== */

    function renderVideoQuestion(q) {

        questionMedia.classList.remove(
            "hidden"
        );

        questionMedia.innerHTML = "";


        answersContainer.classList.add(
            "hidden"
        );

        answersContainer.innerHTML = "";


        const video =
            document.createElement(
                "video"
            );


        video.src =
            q.videoSrc;

        video.controls = true;

        video.className =
            "scenario-video";


        video.setAttribute(
            "aria-label",
            "Scenario video — watch until it pauses"
        );


        let revealed = false;


        video.addEventListener(
            "timeupdate",
            () => {

                if (
                    !revealed &&
                    video.currentTime >=
                    q.pauseAt
                ) {

                    video.pause();

                    revealed = true;

                    revealVideoOptions(q);

                }

            }
        );


        questionMedia.appendChild(
            video
        );


        // Returning to an already answered video
        if (
            answers[currentIndex] !== null
        ) {

            revealed = true;

            revealVideoOptions(q);

        }

    }


    function revealVideoOptions(q) {

        answersContainer.classList.remove(
            "hidden"
        );

        answersContainer.innerHTML = "";


        q.options.forEach(
            (option) => {

                const btn =
                    document.createElement(
                        "button"
                    );


                btn.type = "button";

                btn.className =
                    "answer-option";

                btn.textContent =
                    option.text;


                if (
                    answers[currentIndex] ===
                    option.track
                ) {

                    btn.classList.add(
                        "selected"
                    );

                }


                btn.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            option.track
                        );

                    }
                );


                answersContainer.appendChild(
                    btn
                );

            }
        );

    }


    /* ===================================================
       14. ANSWER SELECTION
    =================================================== */

    function selectAnswer(track) {

        const isFirstAnswer =
            answers[currentIndex] === null;


        answers[currentIndex] =
            track;


        playSelectSound();


        // Speed bonus
        if (isFirstAnswer) {

            const elapsed =
                Date.now() -
                questionShownAt;


            const isFast =
                elapsed <= FAST_ANSWER_MS;


            if (isFast) {

                currentStreak += 1;


                bestStreak =
                    Math.max(
                        bestStreak,
                        currentStreak
                    );


                const multiplier =
                    getStreakMultiplier(
                        currentStreak
                    );


                speedBonusScore +=
                    Math.round(
                        BASE_BONUS_POINTS *
                        multiplier
                    );

            } else {

                currentStreak = 0;

            }

        }


        const q =
            QUESTION_BANK[currentIndex];


        if (q.type !== "hotspot") {

            [
                ...answersContainer.children
            ].forEach(
                (btn) => {

                    btn.classList.toggle(
                        "selected",
                        btn.textContent ===
                        trackOptionText(track)
                    );

                }
            );

        }


        nextBtn.disabled = false;

    }


    function getStreakMultiplier(streak) {

        if (streak >= 5) {

            return 2.0;

        }

        if (streak >= 3) {

            return 1.5;

        }

        return 1.2;

    }


    function trackOptionText(track) {

        const q =
            QUESTION_BANK[currentIndex];


        if (!q.options) {

            return "";

        }


        const match =
            q.options.find(
                (opt) =>
                    opt.track === track
            );


        return match
            ? match.text
            : "";

    }


    /* ===================================================
       15. NAVIGATION
    =================================================== */

    prevBtn.addEventListener(
        "click",
        () => {

            if (currentIndex === 0) {

                return;

            }


            currentIndex -= 1;

            renderQuestion();

        }
    );


    nextBtn.addEventListener(
        "click",
        () => {

            if (
                currentIndex ===
                QUESTION_BANK.length - 1
            ) {

                finishQuiz();

            } else {

                currentIndex += 1;

                renderQuestion();

            }

        }
    );


    /* ===================================================
       16. FINISH QUIZ
    =================================================== */

    function finishQuiz() {

        if (finished) {

            return;

        }


        finished = true;


        stopCountdown();


        // Count answered questions
        const answeredCount =
            answers.filter(
                (answer) => answer !== null
            ).length;


        // Determine completion status
        let completionStatus;


        if (answeredCount === 0) {

            completionStatus = "none";

        }

        else if (
            answeredCount <
            QUESTION_BANK.length
        ) {

            completionStatus = "partial";

        }

        else {

            completionStatus = "complete";

        }


        // Save completion information
        sessionStorage.setItem(
            "careervision_completion_status",
            completionStatus
        );


        sessionStorage.setItem(
            "careervision_answered_count",
            String(answeredCount)
        );


        // Complete progress
        progressBar.style.width =
            "100%";


        /* -----------------------------------------------
           CALCULATE TRACK SCORES
        ------------------------------------------------ */

        const scores = {

            lowLevel: 0,

            arvr: 0,

            fullstack: 0,

            ml: 0

        };


        answers.forEach(
            (track) => {

                if (track) {

                    scores[track] += 1;

                }

            }
        );


        /* -----------------------------------------------
           FIND TOP TRACK
        ------------------------------------------------ */

        let topTrack = null;


        // If nothing was answered, there is NO recommendation
        if (answeredCount === 0) {

            topTrack = null;

        }

        else {

            topTrack =
                Object.keys(scores).reduce(
                    (best, key) => {

                        return scores[key] >
                            scores[best]
                            ? key
                            : best;

                    },
                    Object.keys(scores)[0]
                );

        }


        console.log(
            "Final scores:",
            scores
        );


        console.log(
            "Answered:",
            answeredCount,
            "/",
            QUESTION_BANK.length
        );


        console.log(
            "Completion status:",
            completionStatus
        );


        console.log(
            "Top track:",
            topTrack
                ? TRACK_LABELS[topTrack]
                : "No recommendation"
        );


        console.log(
            "Speed bonus:",
            speedBonusScore
        );


        console.log(
            "Best streak:",
            bestStreak
        );


        /* -----------------------------------------------
           SAVE RESULTS
        ------------------------------------------------ */

        sessionStorage.setItem(
            "careervision_scores",
            JSON.stringify(scores)
        );


        // Remove old top-track value if there isn't one
        if (topTrack) {

            sessionStorage.setItem(
                "careervision_top_track",
                topTrack
            );

        }

        else {

            sessionStorage.removeItem(
                "careervision_top_track"
            );

        }


        sessionStorage.setItem(
            "careervision_speed_bonus",
            String(speedBonusScore)
        );


        sessionStorage.setItem(
            "careervision_best_streak",
            String(bestStreak)
        );


        /* -----------------------------------------------
           SHOW COMPLETION SCREEN
        ------------------------------------------------ */

        quizContainer.classList.add(
            "hidden"
        );


        quizCompleteSection.classList.remove(
            "hidden"
        );


        renderCompletionMessage(
            completionStatus,
            answeredCount
        );


        renderSpeedStats();

    }


    /* ===================================================
       17. COMPLETION SCREEN MESSAGE
    =================================================== */

    function renderCompletionMessage(
        status,
        answeredCount
    ) {

        const heading =
            quizCompleteSection.querySelector(
                "h2"
            );


        const paragraph =
            quizCompleteSection.querySelector(
                "p"
            );


        if (status === "none") {

            if (heading) {

                heading.textContent =
                    "Assessment Incomplete";

            }


            if (paragraph) {

                paragraph.textContent =
                    "You did not answer any questions. Please retake the assessment so CareerVision can identify a specialization that matches your interests.";

            }

        }

        else if (status === "partial") {

            if (heading) {

                heading.textContent =
                    "Time's Up!";

            }


            if (paragraph) {

                paragraph.textContent =
                    `You answered ${answeredCount} out of ${QUESTION_BANK.length} questions. Your results will be based on the answers you provided.`;

            }

        }

        else {

            if (heading) {

                heading.textContent =
                    "Assessment Complete!";

            }


            if (paragraph) {

                paragraph.textContent =
                    "Your answers have been analysed. Let's discover your recommended specialization.";

            }

        }

    }


    /* ===================================================
       18. SPEED STATISTICS
    =================================================== */

    function renderSpeedStats() {

        const existing =
            quizCompleteSection.querySelector(
                ".speed-stats"
            );


        if (existing) {

            existing.remove();

        }


        const statsEl =
            document.createElement(
                "div"
            );


        statsEl.className =
            "speed-stats";


        statsEl.innerHTML = `

            <div class="speed-stat">

                <i class="ph ph-lightning"></i>

                <span>
                    ${speedBonusScore}
                    Speed Bonus Points
                </span>

            </div>


            <div class="speed-stat">

                <i class="ph ph-fire"></i>

                <span>
                    Best Streak:
                    ${bestStreak}
                </span>

            </div>

        `;


        const heading =
            quizCompleteSection.querySelector(
                "h2"
            );


        if (heading) {

            heading.insertAdjacentElement(
                "afterend",
                statsEl
            );

        }

        else {

            quizCompleteSection.appendChild(
                statsEl
            );

        }

    }


    /* ===================================================
       19. VIEW RESULTS
    =================================================== */

    viewResultsBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "results.html";

        }
    );

});