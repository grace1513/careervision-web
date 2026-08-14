/* =========================================================
   BG-HOVER.JS
   =========================================================
   Injects two stacked background layers at the start of
   <body>, then listens for mouseenter/mouseleave on any
   element carrying a data-bg="Images/xyz.jpg" attribute —
   nav links, cards, whatever — and crossfades the page
   background to that image. Reverts to no image (falls back
   to your normal --color-primary background) on mouseleave.

   Include on every page: <link> bg-hover.css + <script> this
   file, then add data-bg="Images/your-file.jpg" to any
   element you want to trigger a background change.
========================================================= */

/* =========================================================
   BG-HOVER.JS
   =========================================================
   Two behaviors layered together:

   1. AUTO-CYCLE (default state): two images crossfade back
      and forth automatically every CYCLE_INTERVAL_MS, running
      continuously on every page that includes this script.

   2. HOVER OVERRIDE: hovering any [data-bg="Images/xyz.jpg"]
      element (nav links, etc.) pauses the auto-cycle and shows
      that specific image instead. Auto-cycling resumes when the
      mouse leaves.

   The path-card videos (path-video-bg.js) sit on their own
   higher layer and simply cover this whole system visually
   while a card is hovered — no coordination needed between
   the two files for that part.

   Include on every page: <link> bg-hover.css + <script> this
   file. No markup required for the auto-cycle to work; add
   data-bg="Images/your-file.jpg" to any element for the hover
   override behavior.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       1. SET UP THE CROSSFADE LAYERS
    --------------------------------------------------- */

    const layerA = document.createElement("div");
    layerA.className = "bg-hover-layer";

    const layerB = document.createElement("div");
    layerB.className = "bg-hover-layer";

    const overlay = document.createElement("div");
    overlay.className = "bg-hover-overlay";

    document.body.prepend(overlay);
    document.body.prepend(layerB);
    document.body.prepend(layerA);

    let activeLayer = layerA;
    let idleLayer = layerB;

    function showBackground(imageUrl) {
        idleLayer.style.backgroundImage = `url("${imageUrl}")`;
        idleLayer.classList.add("active");
        activeLayer.classList.remove("active");

        // Swap which layer is "active" vs "idle" for next time
        const temp = activeLayer;
        activeLayer = idleLayer;
        idleLayer = temp;
    }

    /* ---------------------------------------------------
       2. AUTO-CYCLE (the default, always-on background)
       PLACEHOLDER: swap these two paths for your real images.
    --------------------------------------------------- */

    const DEFAULT_IMAGES = [
        "Images/default-bg-1.jpg",
        "Images/default-bg-2.jpg"
    ];
    const CYCLE_INTERVAL_MS = 8000; // how often the two images swap

    let cycleIndex = 0;
    let cycleTimerId = null;

    function startCycle() {
        // Show the current image immediately, then keep swapping on a timer
        showBackground(DEFAULT_IMAGES[cycleIndex]);

        clearInterval(cycleTimerId); // never stack multiple intervals
        cycleTimerId = setInterval(() => {
            cycleIndex = (cycleIndex + 1) % DEFAULT_IMAGES.length;
            showBackground(DEFAULT_IMAGES[cycleIndex]);
        }, CYCLE_INTERVAL_MS);
    }

    function pauseCycle() {
        clearInterval(cycleTimerId);
        cycleTimerId = null;
    }

    /* ---------------------------------------------------
       3. HOVER OVERRIDE (nav links, or any [data-bg] element)
       Pauses the auto-cycle, shows the hovered image, then
       resumes cycling once the mouse leaves.
    --------------------------------------------------- */

    const triggers = document.querySelectorAll("[data-bg]");
    triggers.forEach((el) => {

        el.addEventListener("mouseenter", () => {
            pauseCycle();
            showBackground(el.dataset.bg);
        });

        el.addEventListener("mouseleave", () => {
            startCycle(); // resume auto-cycling from where it left off
        });

    });

    // Kick off the auto-cycle as soon as the page loads
    startCycle();

});