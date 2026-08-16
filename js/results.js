/* =========================================================
   RESULTS.JS
   =========================================================
   CareerVision Results Page

   Reads quiz data from sessionStorage and dynamically
   displays:
   - Recommended specialization
   - Match percentage
   - Score breakdown
   - Canvas radar chart
   - Explanation
   - Recommended skills
   - Career opportunities
   - Learning resources
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. SETTINGS
    ===================================================== */

    const QUESTION_COUNT = 10;

    const TRACK_LABELS = {
        lowLevel: "Low-Level Programming",
        fullstack: "Full-Stack Web Development",
        arvr: "AR / VR",
        ml: "Machine Learning"
    };


    /* =====================================================
       2. CONTENT FOR EACH SPECIALIZATION
    ===================================================== */

    const TRACK_CONTENT = {

        lowLevel: {

            summary:
                "Your responses show a strong interest in working close to the hardware, understanding performance, memory, and how systems operate under the hood.",

            explanation: [
                "Your answers point toward a fascination with how software actually runs — memory, performance, and the relationship between software and hardware.",

                "Low-Level Programming rewards this mindset through operating systems, embedded systems, performance optimization, and systems programming."
            ],

            skills: [
                {
                    icon: "ph-cpu",
                    title: "Systems Programming",
                    text: "Build your understanding of C/C++ and how programs interact with memory and the CPU."
                },

                {
                    icon: "ph-terminal-window",
                    title: "Operating Systems",
                    text: "Learn about processes, scheduling, memory management, and hardware interaction."
                },

                {
                    icon: "ph-bug",
                    title: "Debugging",
                    text: "Learn how debuggers and profilers can help you understand difficult system-level problems."
                },

                {
                    icon: "ph-git-branch",
                    title: "Version Control",
                    text: "Develop strong Git and collaborative software development habits."
                }
            ],

            careers: [
                {
                    icon: "ph-cpu",
                    title: "Systems Engineer",
                    text: "Build and optimize software that interacts closely with computer systems."
                },

                {
                    icon: "ph-chip",
                    title: "Embedded Developer",
                    text: "Develop software and firmware for hardware-constrained devices."
                },

                {
                    icon: "ph-rocket",
                    title: "Performance Engineer",
                    text: "Improve the efficiency and performance of critical software systems."
                }
            ],

            resources: [
                {
                    icon: "ph-book-open",
                    title: "C Programming Fundamentals",
                    text: "Strengthen your understanding of efficient programming and memory."
                },

                {
                    icon: "ph-cpu",
                    title: "Operating Systems",
                    text: "Explore processes, memory, scheduling, and input/output."
                },

                {
                    icon: "ph-git-branch",
                    title: "Git and GitHub",
                    text: "Practice version control and collaborative development."
                }
            ]
        },


        arvr: {

            summary:
                "Your responses show a strong interest in building immersive and spatial experiences. AR/VR development matches your interest in interaction, creativity, and 3D environments.",

            explanation: [
                "Your answers suggest that you enjoy designing experiences that people can interact with rather than simply viewing on a traditional screen.",

                "AR/VR development combines 3D graphics, interaction design, programming, and real-time rendering."
            ],

            skills: [
                {
                    icon: "ph-cube",
                    title: "3D Fundamentals",
                    text: "Learn vectors, transformations, modeling basics, and spatial reasoning."
                },

                {
                    icon: "ph-vr-cardboard",
                    title: "AR/VR Engines",
                    text: "Gain practical experience with platforms such as Unity or Unreal Engine."
                },

                {
                    icon: "ph-hand-tap",
                    title: "Interaction Design",
                    text: "Learn how to create intuitive interactions for immersive environments."
                },

                {
                    icon: "ph-git-branch",
                    title: "Version Control",
                    text: "Develop strong Git and collaborative development skills."
                }
            ],

            careers: [
                {
                    icon: "ph-vr-cardboard",
                    title: "AR/VR Developer",
                    text: "Build immersive applications and interactive experiences."
                },

                {
                    icon: "ph-cube",
                    title: "3D / Graphics Engineer",
                    text: "Work with rendering, graphics, shaders, and real-time environments."
                },

                {
                    icon: "ph-rocket",
                    title: "Interaction Designer",
                    text: "Design how users interact with spatial and immersive interfaces."
                }
            ],

            resources: [
                {
                    icon: "ph-book-open",
                    title: "Introduction to Unity",
                    text: "Start creating interactive 3D environments."
                },

                {
                    icon: "ph-cube",
                    title: "3D Mathematics",
                    text: "Learn vectors, matrices, transformations, and spatial concepts."
                },

                {
                    icon: "ph-git-branch",
                    title: "Git and GitHub",
                    text: "Learn to manage projects and collaborate effectively."
                }
            ]
        },


        fullstack: {

            summary:
                "Your responses show a strong interest in building complete applications and practical solutions that people can use. Full-Stack Web Development matches these interests particularly well.",

            explanation: [
                "Your answers indicate that you enjoy creating practical solutions and combining different technologies to build complete applications.",

                "Full-Stack Web Development involves working across front-end interfaces, back-end services, databases, APIs, and application logic."
            ],

            skills: [
                {
                    icon: "ph-code",
                    title: "Programming",
                    text: "Strengthen your programming fundamentals and problem-solving abilities."
                },

                {
                    icon: "ph-database",
                    title: "Databases",
                    text: "Learn how applications store, retrieve, and manage information."
                },

                {
                    icon: "ph-globe",
                    title: "Web Technologies",
                    text: "Develop strong front-end and back-end development skills."
                },

                {
                    icon: "ph-git-branch",
                    title: "Version Control",
                    text: "Learn Git and collaborative software development workflows."
                }
            ],

            careers: [
                {
                    icon: "ph-browser",
                    title: "Full-Stack Developer",
                    text: "Build complete web applications across front-end and back-end systems."
                },

                {
                    icon: "ph-code",
                    title: "Web Application Developer",
                    text: "Design and develop interactive applications for businesses and users."
                },

                {
                    icon: "ph-rocket",
                    title: "Software Engineer",
                    text: "Create scalable software solutions using modern development technologies."
                }
            ],

            resources: [
                {
                    icon: "ph-book-open",
                    title: "Web Development Fundamentals",
                    text: "Strengthen your HTML, CSS, and JavaScript foundations."
                },

                {
                    icon: "ph-git-branch",
                    title: "Git and GitHub",
                    text: "Learn how to manage projects and collaborate with other developers."
                },

                {
                    icon: "ph-database",
                    title: "Backend Development",
                    text: "Explore APIs, databases, servers, and backend programming."
                }
            ]
        },


        ml: {

            summary:
                "Your responses show a strong interest in data, patterns, and building systems that learn. Machine Learning matches these interests particularly well.",

            explanation: [
                "Your answers point toward curiosity about data, finding patterns, testing ideas, and building systems that can learn from information.",

                "Machine Learning combines programming, mathematics, statistics, data analysis, and model development to solve real-world problems."
            ],

            skills: [
                {
                    icon: "ph-brain",
                    title: "Mathematics",
                    text: "Build your understanding of statistics, probability, and linear algebra."
                },

                {
                    icon: "ph-chart-line",
                    title: "Data Analysis",
                    text: "Learn how to clean, explore, visualize, and interpret datasets."
                },

                {
                    icon: "ph-robot",
                    title: "ML Frameworks",
                    text: "Gain experience with tools such as scikit-learn and PyTorch."
                },

                {
                    icon: "ph-git-branch",
                    title: "Version Control",
                    text: "Develop strong Git and collaborative software development skills."
                }
            ],

            careers: [
                {
                    icon: "ph-brain",
                    title: "ML Engineer",
                    text: "Design and deploy machine learning models that solve practical problems."
                },

                {
                    icon: "ph-chart-line",
                    title: "Data Scientist",
                    text: "Analyze data and develop predictive models to support decisions."
                },

                {
                    icon: "ph-rocket",
                    title: "AI Research Engineer",
                    text: "Explore new approaches to machine learning and intelligent systems."
                }
            ],

            resources: [
                {
                    icon: "ph-book-open",
                    title: "Machine Learning Fundamentals",
                    text: "Build a strong foundation in how machine learning models work."
                },

                {
                    icon: "ph-chart-line",
                    title: "Python for Data Science",
                    text: "Learn Python tools commonly used for data and machine learning."
                },

                {
                    icon: "ph-git-branch",
                    title: "Git and GitHub",
                    text: "Learn how to manage projects and collaborate with developers."
                }
            ]
        }

    };


    /* =====================================================
       3. LOAD DATA FROM SESSION STORAGE
    ===================================================== */

    let scores = null;
    let topTrack = null;
    let student = null;

    try {

        const storedScores =
            sessionStorage.getItem("careervision_scores");

        const storedTrack =
            sessionStorage.getItem("careervision_top_track");

        const storedStudent =
            sessionStorage.getItem("careervision_student");


        if (storedScores) {
            scores = JSON.parse(storedScores);
        }

        if (storedTrack) {
            topTrack = storedTrack;
        }

        if (storedStudent) {
            student = JSON.parse(storedStudent);
        }

    } catch (error) {

        console.error(
            "Unable to read CareerVision results:",
            error
        );

    }


    /* =====================================================
       4. SAFETY CHECK
    ===================================================== */

    if (
        !scores ||
        !topTrack ||
        !TRACK_CONTENT[topTrack]
    ) {

        console.warn(
            "No quiz results found. Returning to quiz."
        );

        window.location.href = "quiz.html";

        return;

    }


    /* =====================================================
       5. NORMALIZE SCORES
    ===================================================== */

    const normalizedScores = {

        lowLevel: Number(scores.lowLevel) || 0,

        fullstack: Number(scores.fullstack) || 0,

        arvr: Number(scores.arvr) || 0,

        ml: Number(scores.ml) || 0

    };


    /* =====================================================
       6. CALCULATE PERCENTAGES
    ===================================================== */

    const percentages = {};

    Object.keys(normalizedScores).forEach((track) => {

        percentages[track] = Math.round(
            (normalizedScores[track] / QUESTION_COUNT) * 100
        );

    });


    /* =====================================================
       7. GET RECOMMENDATION CONTENT
    ===================================================== */

    const content =
        TRACK_CONTENT[topTrack];


    /* =====================================================
       8. UPDATE RECOMMENDATION
    ===================================================== */

    const recommendedPath =
        document.getElementById("recommended-path");

    const matchScore =
        document.getElementById("match-score");

    const recommendationSummary =
        document.getElementById("recommendation-summary");


    if (recommendedPath) {

        recommendedPath.textContent =
            TRACK_LABELS[topTrack];

    }


    if (matchScore) {

        matchScore.textContent =
            `${percentages[topTrack]}%`;

    }


    if (recommendationSummary) {

        recommendationSummary.textContent =
            content.summary;

    }


    /* =====================================================
       9. PERSONALIZE HERO
    ===================================================== */

    if (
        student &&
        student.fullName
    ) {

        const firstName =
            student.fullName.trim().split(" ")[0];

        const heroHeading =
            document.querySelector(
                ".results-hero h1"
            );


        if (heroHeading && firstName) {

            heroHeading.textContent =
                `${firstName}, Here's Your Path`;

        }

    }


    /* =====================================================
       10. SCORE BREAKDOWN
    ===================================================== */

    const SCORE_ELEMENT_IDS = {

        lowLevel: {
            text: "low-level-score",
            bar: "low-level-bar"
        },

        fullstack: {
            text: "full-stack-score",
            bar: "full-stack-bar"
        },

        arvr: {
            text: "arvr-score",
            bar: "arvr-bar"
        },

        ml: {
            text: "machine-learning-score",
            bar: "machine-learning-bar"
        }

    };


    Object.keys(SCORE_ELEMENT_IDS).forEach((track) => {

        const textElement =
            document.getElementById(
                SCORE_ELEMENT_IDS[track].text
            );

        const barElement =
            document.getElementById(
                SCORE_ELEMENT_IDS[track].bar
            );


        if (textElement) {

            textElement.textContent =
                `${percentages[track]}%`;

        }


        if (barElement) {

            barElement.style.width = "0%";


            requestAnimationFrame(() => {

                barElement.style.width =
                    `${percentages[track]}%`;

            });

        }

    });


    /* =====================================================
       11. EXPLANATION
    ===================================================== */

    const explanationContainer =
        document.getElementById(
            "recommendation-explanation"
        );


    if (explanationContainer) {

        explanationContainer.innerHTML = "";


        content.explanation.forEach((paragraph) => {

            const p =
                document.createElement("p");

            p.textContent =
                paragraph;

            explanationContainer.appendChild(p);

        });

    }


    /* =====================================================
       12. GENERIC CARD RENDERER
    ===================================================== */

    function renderCards(
        containerId,
        items,
        cardClass
    ) {

        const container =
            document.getElementById(containerId);


        if (!container) {
            return;
        }


        container.innerHTML = "";


        items.forEach((item) => {

            const card =
                document.createElement("div");

            card.className =
                cardClass;


            const icon =
                document.createElement("i");

            icon.className =
                `ph ${item.icon}`;

            icon.setAttribute(
                "aria-hidden",
                "true"
            );


            const title =
                document.createElement("h3");

            title.textContent =
                item.title;


            const text =
                document.createElement("p");

            text.textContent =
                item.text;


            card.appendChild(icon);

            card.appendChild(title);

            card.appendChild(text);


            container.appendChild(card);

        });

    }


    /* =====================================================
       13. RENDER CONTENT CARDS
    ===================================================== */

    renderCards(
        "skills-container",
        content.skills,
        "skill-card"
    );


    renderCards(
        "careers-container",
        content.careers,
        "career-card"
    );


    renderCards(
        "resources-container",
        content.resources,
        "resource-card"
    );


    /* =====================================================
       14. SPEED STATISTICS
    ===================================================== */

    const speedBonus =
        Number(
            sessionStorage.getItem(
                "careervision_speed_bonus"
            )
        ) || 0;


    const bestStreak =
        Number(
            sessionStorage.getItem(
                "careervision_best_streak"
            )
        ) || 0;


    const nextStepsCard =
        document.querySelector(
            ".next-steps-card"
        );


    if (
        nextStepsCard &&
        (speedBonus > 0 || bestStreak > 0)
    ) {

        const stats =
            document.createElement("div");

        stats.className =
            "results-speed-stats";


        stats.innerHTML = `
            <div class="speed-stat">
                <i class="ph ph-lightning" aria-hidden="true"></i>
                <strong>${speedBonus}</strong>
                <span>Speed Bonus</span>
            </div>

            <div class="speed-stat">
                <i class="ph ph-fire" aria-hidden="true"></i>
                <strong>${bestStreak}</strong>
                <span>Best Streak</span>
            </div>
        `;


        nextStepsCard.insertBefore(
            stats,
            nextStepsCard.querySelector(
                ".results-actions"
            )
        );

    }


    /* =====================================================
       15. CANVAS RADAR CHART
    ===================================================== */

    function renderResultsChart() {

        const canvas =
            document.getElementById(
                "results-chart"
            );


        if (
            !canvas ||
            !canvas.getContext
        ) {

            return;

        }


        const ctx =
            canvas.getContext("2d");


        if (!ctx) {
            return;
        }


        /* ---------------------------------------------
           Responsive canvas sizing
        --------------------------------------------- */

        const displayWidth =
            canvas.clientWidth || 500;

        const displayHeight =
            canvas.clientHeight || 400;


        const devicePixelRatio =
            window.devicePixelRatio || 1;


        canvas.width =
            displayWidth * devicePixelRatio;

        canvas.height =
            displayHeight * devicePixelRatio;


        ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );


        const width =
            displayWidth;

        const height =
            displayHeight;


        const centerX =
            width / 2;

        const centerY =
            height / 2;


        const maxRadius =
            Math.min(width, height) / 2 - 65;


        const axes = [
            "fullstack",
            "ml",
            "arvr",
            "lowLevel"
        ];


        const axisCount =
            axes.length;


        const ringLevels = [
            0.2,
            0.4,
            0.6,
            0.8,
            1.0
        ];


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* ---------------------------------------------
           Helpers
        --------------------------------------------- */

        function angleForIndex(index) {

            return (
                (Math.PI * 2 * index) /
                axisCount
            ) - Math.PI / 2;

        }


        function pointFor(
            index,
            fraction
        ) {

            const angle =
                angleForIndex(index);


            return {

                x:
                    centerX +
                    Math.cos(angle) *
                    maxRadius *
                    fraction,

                y:
                    centerY +
                    Math.sin(angle) *
                    maxRadius *
                    fraction

            };

        }


        /* ---------------------------------------------
           Background rings
        --------------------------------------------- */

        ctx.strokeStyle =
            "rgba(45, 90, 74, 0.15)";

        ctx.lineWidth = 1;


        ringLevels.forEach((level) => {

            ctx.beginPath();


            for (
                let i = 0;
                i <= axisCount;
                i++
            ) {

                const point =
                    pointFor(
                        i % axisCount,
                        level
                    );


                if (i === 0) {

                    ctx.moveTo(
                        point.x,
                        point.y
                    );

                } else {

                    ctx.lineTo(
                        point.x,
                        point.y
                    );

                }

            }


            ctx.closePath();

            ctx.stroke();

        });


        /* ---------------------------------------------
           Axis lines
        --------------------------------------------- */

        ctx.strokeStyle =
            "rgba(45, 90, 74, 0.25)";

        ctx.lineWidth = 1;


        axes.forEach((track, index) => {

            const point =
                pointFor(
                    index,
                    1
                );


            ctx.beginPath();

            ctx.moveTo(
                centerX,
                centerY
            );

            ctx.lineTo(
                point.x,
                point.y
            );

            ctx.stroke();

        });


        /* ---------------------------------------------
           Axis labels
        --------------------------------------------- */

        ctx.fillStyle =
            "#333";

        ctx.font =
            "12px Inter, sans-serif";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        axes.forEach((track, index) => {

            const labelPoint =
                pointFor(
                    index,
                    1.18
                );


            ctx.fillText(
                TRACK_LABELS[track],
                labelPoint.x,
                labelPoint.y
            );

        });


        /* ---------------------------------------------
           Data polygon
        --------------------------------------------- */

        ctx.beginPath();


        axes.forEach((track, index) => {

            const fraction =
                percentages[track] / 100;


            const point =
                pointFor(
                    index,
                    fraction
                );


            if (index === 0) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        });


        ctx.closePath();


        /* ---------------------------------------------
           Polygon fill
        --------------------------------------------- */

        const gradient =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                maxRadius
            );


        gradient.addColorStop(
            0,
            "rgba(201, 226, 14, 0.45)"
        );


        gradient.addColorStop(
            1,
            "rgba(45, 90, 74, 0.25)"
        );


        ctx.fillStyle =
            gradient;

        ctx.fill();


        /* ---------------------------------------------
           Polygon outline
        --------------------------------------------- */

        ctx.strokeStyle =
            "#2D5A4A";

        ctx.lineWidth =
            2.5;

        ctx.stroke();


        /* ---------------------------------------------
           Score dots
        --------------------------------------------- */

        axes.forEach((track, index) => {

            const fraction =
                percentages[track] / 100;


            const point =
                pointFor(
                    index,
                    fraction
                );


            const isTop =
                track === topTrack;


            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                isTop ? 7 : 5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                isTop
                    ? "#C9E20E"
                    : "#2D5A4A";


            ctx.fill();


            ctx.lineWidth = 2;

            ctx.strokeStyle =
                "#ffffff";

            ctx.stroke();

        });

    }


    /* =====================================================
       16. DRAW CHART
    ===================================================== */

    renderResultsChart();


    /* =====================================================
       17. REDRAW CHART ON RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        renderResultsChart
    );

});