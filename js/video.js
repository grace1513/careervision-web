/* =========================================================
   VIDEO.JS
   =========================================================
   Click-to-play video: shows a static thumbnail + play button
   until clicked, then swaps in a real YouTube iframe with
   autoplay. Keeps the page fast (no iframe loaded until the
   user actually wants to watch) and satisfies the "media
   events" requirement — listens for the iframe's own load.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.querySelector(".video-wrapper");
    if (!wrapper) return;

    const playBtn = wrapper.querySelector(".video-play-btn");
    const thumbnail = wrapper.querySelector(".video-thumbnail");
    const videoId = wrapper.dataset.videoId;

    if (!playBtn || !videoId) return;

    playBtn.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.title = "CareerVision walkthrough video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        iframe.addEventListener("load", () => {
            console.log("Video iframe loaded and playing.");
        });

        // Swap thumbnail + button out for the real player
        wrapper.innerHTML = "";
        wrapper.appendChild(iframe);
    });

});