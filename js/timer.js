/* =========================================================
   TIMER.JS
   =========================================================
   Standalone countdown timer for the quiz page. Exposes two
   global functions that quiz.js calls into:

     startCountdown(totalSeconds, onTick, onExpire)
     stopCountdown()

   Handles its own DOM updates (#time-remaining text,
   .warning/.danger classes on #quiz-timer) and its own
   media event (a tick sound in the final seconds).
========================================================= */

let countdownId = null;
let secondsLeft = 0;

const WARNING_THRESHOLD = 120; // 2:00 remaining
const DANGER_THRESHOLD = 30;   // 0:30 remaining

const tickSound = new Audio("https://cdn.jsdelivr.net/gh/anars/blank-audio/1-second-of-silence.mp3");

function playTick() {
    try {
        tickSound.currentTime = 0;
        const playPromise = tickSound.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => { /* autoplay may be blocked, ignore */ });
        }
    } catch (err) {
        console.warn("Tick sound unavailable:", err);
    }
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    const wrapper = document.getElementById("quiz-timer");
    const display = document.getElementById("time-remaining");
    if (!display || !wrapper) return;

    display.textContent = formatTime(secondsLeft);
    wrapper.classList.toggle("danger", secondsLeft <= DANGER_THRESHOLD);
    wrapper.classList.toggle("warning", secondsLeft > DANGER_THRESHOLD && secondsLeft <= WARNING_THRESHOLD);
}

/**
 * Starts (or restarts) the countdown.
 * @param {number} totalSeconds - starting time, e.g. 600 for 10:00
 * @param {function} onExpire - called once when the timer hits 0
 */
function startCountdown(totalSeconds, onExpire) {
    clearInterval(countdownId);
    secondsLeft = totalSeconds;
    updateTimerDisplay();

    countdownId = setInterval(() => {
        secondsLeft -= 1;
        updateTimerDisplay();

        if (secondsLeft <= DANGER_THRESHOLD && secondsLeft > 0 && secondsLeft % 5 === 0) {
            playTick();
        }

        if (secondsLeft <= 0) {
            clearInterval(countdownId);
            countdownId = null;
            if (typeof onExpire === "function") onExpire();
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownId);
    countdownId = null;
}