/* =========================================================
   PATH-VIDEO-BG.JS
   =========================================================
   Separate from bg-hover.js (which handles nav-triggered
   background IMAGES). This handles background VIDEO specific
   to the 4 specialization cards on index.html: hovering a card
   fades in its own looping muted video; leaving the card fades
   back to the default (no video) state.

   Include on index.html only, alongside bg-hover.css/js.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll("[data-bg-video]");
    if (!cards.length) return; // safety check for pages without path cards

    // Build the <video> element and insert it into the layer stack
    const video = document.createElement("video");
    video.className = "path-bg-video";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "none"; // don't download anything until a card is hovered

    document.body.prepend(video);

    let hideTimeout = null;

    function playCardVideo(src) {
        clearTimeout(hideTimeout);

        // Only reload the source if it's actually different — avoids
        // restarting the same video from 0:00 on rapid re-hover.
        if (!video.currentSrc.endsWith(src)) {
            video.src = src;
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                // Autoplay can be blocked (rare for muted video, but be safe)
                console.warn("Background video playback was blocked.");
            });
        }

        video.classList.add("active");
    }

    function stopCardVideo() {
        video.classList.remove("active");

        // Wait for the fade-out transition to finish before actually
        // pausing/clearing, so the video doesn't visibly freeze mid-fade.
        hideTimeout = setTimeout(() => {
            video.pause();
        }, 500);
    }

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => playCardVideo(card.dataset.bgVideo));
        card.addEventListener("mouseleave", stopCardVideo);
    });

});