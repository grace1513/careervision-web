/* =========================================================
   TIMER.JS
   =========================================================
   CareerVision Quiz Countdown Timer

   - Starts from the time supplied by quiz.js
   - Updates #time-remaining every second
   - Adds warning/danger states to #quiz-timer
   - Plays a tick sound during the final 30 seconds
   - Calls the supplied function when the timer reaches 0
========================================================= */

let countdownId = null;
let secondsLeft = 0;

const WARNING_THRESHOLD = 120; // 2 minutes
const DANGER_THRESHOLD = 30;   // 30 seconds

const tickSound = new Audio(
    "https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3"
);


/* ---------------------------------------------------------
   PLAY TICK SOUND
--------------------------------------------------------- */

function playTick() {

    try {

        tickSound.currentTime = 0;

        const playPromise = tickSound.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                // Audio may be blocked by the browser.
            });
        }

    } catch (error) {

        console.warn(
            "Timer tick sound unavailable:",
            error
        );

    }

}


/* ---------------------------------------------------------
   FORMAT TIME
--------------------------------------------------------- */

function formatTime(totalSeconds) {

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* ---------------------------------------------------------
   UPDATE TIMER DISPLAY
--------------------------------------------------------- */

function updateTimerDisplay() {

    const timerWrapper =
        document.getElementById("quiz-timer");

    const timerDisplay =
        document.getElementById("time-remaining");


    if (!timerWrapper || !timerDisplay) {
        return;
    }


    timerDisplay.textContent =
        formatTime(secondsLeft);


    /* Remove previous states */

    timerWrapper.classList.remove(
        "warning",
        "danger"
    );


    /* Add the appropriate state */

    if (secondsLeft <= DANGER_THRESHOLD) {

        timerWrapper.classList.add("danger");

    } else if (secondsLeft <= WARNING_THRESHOLD) {

        timerWrapper.classList.add("warning");

    }

}


/* ---------------------------------------------------------
   START COUNTDOWN
--------------------------------------------------------- */

/**
 * Starts or restarts the countdown.
 *
 * @param {number} totalSeconds
 * @param {function} onExpire
 */

function startCountdown(totalSeconds, onExpire) {

    /* Clear an existing timer first */

    clearInterval(countdownId);


    /* Set starting time */

    secondsLeft = totalSeconds;


    /* Immediately display starting time */

    updateTimerDisplay();


    /* Start countdown */

    countdownId = setInterval(() => {

        secondsLeft -= 1;


        updateTimerDisplay();


        /* Tick sound during final 30 seconds */

        if (
            secondsLeft <= DANGER_THRESHOLD &&
            secondsLeft > 0
        ) {

            playTick();

        }


        /* Timer finished */

        if (secondsLeft <= 0) {

            clearInterval(countdownId);

            countdownId = null;

            secondsLeft = 0;

            updateTimerDisplay();


            if (typeof onExpire === "function") {

                onExpire();

            }

        }

    }, 1000);

}


/* ---------------------------------------------------------
   STOP COUNTDOWN
--------------------------------------------------------- */

function stopCountdown() {

    clearInterval(countdownId);

    countdownId = null;

}