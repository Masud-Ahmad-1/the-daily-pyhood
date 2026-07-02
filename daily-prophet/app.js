/* ==========================================================================
   DAILY PROPHET - INDEX PAGE LOGIC
   Uses shared magic-engine.js for sound, spells, and particles.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ---- Initialize Shared Magic Engine ----
    DailyProphetMagic.init();

    // ---- DOM Elements (index-page specific) ----
    const dateField = document.getElementById("wizard-date");
    const wantedInput = document.getElementById("wanted-input");
    const wantedNameDisplay = document.getElementById("wanted-name-display");
    const btnRevelio = document.getElementById("btn-revelio");
    const wantedPoster = document.getElementById("wanted-poster");
    const secretBox = document.getElementById("secret-box");
    const btnRevelioAlt = document.getElementById("spell-revealo-alt");

    // ---- 1. Dynamic Wizarding Date ----
    if (dateField) {
        dateField.textContent = DailyProphetMagic.generateWizardingDate();
    }

    // ---- 2. Wanted Poster Interactive Input ----
    if (wantedInput && wantedNameDisplay) {
        wantedInput.addEventListener("input", (e) => {
            const text = e.target.value.trim().toUpperCase();
            wantedNameDisplay.textContent = text === "" ? "SIRIUS BLACK" : text;
        });
    }

    // ---- 3. Revelio Spell on Wanted Poster ----
    if (btnRevelio && wantedPoster) {
        btnRevelio.addEventListener("click", () => triggerRevelioWantedEffect());
    }

    function triggerRevelioWantedEffect() {
        DailyProphetMagic.playSound(document.getElementById("sound-magic"));

        const wantedImg = wantedPoster.querySelector(".portrait-photo");
        if (!wantedImg) return;

        wantedPoster.style.borderColor = "var(--accent-gold)";
        wantedPoster.style.boxShadow = "0 0 25px var(--accent-gold)";
        wantedImg.style.filter = "none";
        wantedImg.style.mixBlendMode = "normal";

        // Spark burst centered on the image
        const imgRect = wantedImg.getBoundingClientRect();
        const centerX = imgRect.left + imgRect.width / 2;
        const centerY = imgRect.top + imgRect.height / 2;
        DailyProphetMagic.burstSparkles(centerX, centerY, 25, imgRect.width, imgRect.height);

        // Restore after 4 seconds
        setTimeout(() => {
            wantedPoster.style.borderColor = "var(--border-color)";
            wantedPoster.style.boxShadow = "3px 3px 15px rgba(0,0,0,0.1)";
            wantedImg.style.mixBlendMode = "multiply";

            const body = document.body;
            if (body.classList.contains("nox-active")) {
                wantedImg.style.filter = "grayscale(1) sepia(0.2) invert(0.85) brightness(1.2) contrast(1.2)";
                wantedImg.style.mixBlendMode = "normal";
            } else {
                wantedImg.style.filter = "grayscale(1) sepia(0.15) contrast(1.25) brightness(0.95)";
            }
        }, 4000);
    }

    // ---- 4. Secret Section Unlocking ----
    function unlockSecretSection() {
        if (!secretBox || !secretBox.classList.contains("locked")) return;
        DailyProphetMagic.playSound(document.getElementById("sound-magic"));
        secretBox.classList.remove("locked");
        secretBox.classList.add("unlocked");

        const rect = secretBox.getBoundingClientRect();
        DailyProphetMagic.burstSparkles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            15, rect.width, rect.height
        );
    }

    const lockIcon = secretBox ? secretBox.querySelector(".lock-icon") : null;
    if (lockIcon) {
        lockIcon.addEventListener("click", unlockSecretSection);
        lockIcon.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                unlockSecretSection();
            }
        });
    }
    if (btnRevelioAlt) {
        btnRevelioAlt.addEventListener("click", unlockSecretSection);
    }

    // ---- Console Easter Egg ----
    console.log(
        "%cTHE DAILY PROPHET %c- Web Edition%c\n\n\"I solemnly swear that I am up to no good.\"",
        "font-family: 'Cinzel Decorative', serif; font-size: 20px; font-weight: bold; color: #b59449;",
        "font-size: 12px; font-style: italic; color: #888;",
        "font-family: monospace; font-size: 12px; color: #8b5a2b;"
    );
});