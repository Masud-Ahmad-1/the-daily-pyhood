/* ==========================================================================
   DAILY PROPHET - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const body = document.body;
    const dateField = document.getElementById("wizard-date");
    const connectionStatus = document.getElementById("connection-status");
    
    // Audio toggles and sound elements
    const btnSound = document.getElementById("btn-sound");
    const soundPage = document.getElementById("sound-page");
    const soundMagic = document.getElementById("sound-magic");
    
    // Spells
    const spellButtons = {
        lumos: document.getElementById("spell-lumos"),
        nox: document.getElementById("spell-nox"),
        confundo: document.getElementById("spell-confundo"),
        finite: document.getElementById("spell-finite")
    };
    
    // Wanted Poster
    const wantedInput = document.getElementById("wanted-input");
    const wantedNameDisplay = document.getElementById("wanted-name-display");
    const btnRevelio = document.getElementById("btn-revelio");
    const wantedPoster = document.getElementById("wanted-poster");
    
    // Secret section
    const secretBox = document.getElementById("secret-box");
    const btnRevelioAlt = document.getElementById("spell-revealo-alt");

    // State Variables
    let soundEnabled = true;
    let particleThrottle = false;
    let activeSpell = "finite";

    // 1. Dynamic Wizarding Date Generator
    function generateWizardingDate() {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const dayName = days[now.getDay()];
        const dateNum = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();

        // Optional: Adding magical years or comments
        let wizardYearSuffix = "";
        if (year % 3 === 0) wizardYearSuffix = " (Year of the Dragon)";
        else if (year % 3 === 1) wizardYearSuffix = " (Year of the Phoenix)";
        else wizardYearSuffix = " (Year of the Hippogriff)";

        return `${dayName}, ${dateNum} ${monthName} ${year}${wizardYearSuffix}`;
    }
    dateField.textContent = generateWizardingDate();

    // 2. Audio Control System
    // Load sound settings
    if (localStorage.getItem("soundEnabled") !== null) {
        soundEnabled = localStorage.getItem("soundEnabled") === "true";
        updateSoundButtonUI();
    }

    btnSound.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem("soundEnabled", soundEnabled);
        updateSoundButtonUI();
        playSound(soundPage); // page flip sound on click
    });

    function updateSoundButtonUI() {
        if (soundEnabled) {
            btnSound.innerHTML = `<span class="icon">🔊</span> Sound: ON`;
            btnSound.classList.remove("muted");
        } else {
            btnSound.innerHTML = `<span class="icon">🔇</span> Sound: OFF`;
            btnSound.classList.add("muted");
        }
    }

    function playSound(audioElement) {
        if (!soundEnabled || !audioElement) return;
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log("Sound play prevented: ", err));
    }

    // 3. Wand Particle Sparks System
    // Track cursor movement for Lumos position and particle spawning
    window.addEventListener("mousemove", (e) => {
        // Track coordinate properties for CSS Lumos radial gradient
        body.style.setProperty("--cursor-x", `${e.clientX}px`);
        body.style.setProperty("--cursor-y", `${e.clientY}px`);

        if (particleThrottle) return;
        particleThrottle = true;
        
        createSparkle(e.clientX, e.clientY);

        setTimeout(() => {
            particleThrottle = false;
        }, 15); // limit particles to avoid lag
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        
        // Random offset for organic floating spark trail
        const offset = 8;
        const randomX = (Math.random() - 0.5) * offset;
        const randomY = (Math.random() - 0.5) * offset;
        
        sparkle.style.left = `${x + randomX}px`;
        sparkle.style.top = `${y + randomY}px`;

        // Vary sparkle colors depending on active spell
        if (activeSpell === "lumos") {
            sparkle.style.background = "#fff9c4";
            sparkle.style.boxShadow = "0 0 12px #fffde7, 0 0 22px #ffe082";
        } else if (activeSpell === "nox") {
            sparkle.style.background = "#b2dfdb";
            sparkle.style.boxShadow = "0 0 12px #80cbc4, 0 0 22px #004d40";
        } else if (activeSpell === "confundo") {
            sparkle.style.background = "#e1bee7";
            sparkle.style.boxShadow = "0 0 12px #ce93d8, 0 0 22px #4a148c";
        } else {
            // Default gold
            sparkle.style.background = "#ffe082";
            sparkle.style.boxShadow = "0 0 10px #ffb300, 0 0 20px #ffa000";
        }

        // Random size
        const size = Math.random() * 6 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        document.getElementById("spark-container").appendChild(sparkle);

        // Remove from DOM after animation completes
        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
        });
    }

    // 4. Spell Selection & Application
    Object.keys(spellButtons).forEach(spell => {
        spellButtons[spell].addEventListener("click", () => {
            castSpell(spell);
        });
    });

    function castSpell(spellName) {
        // Reset all classes
        body.classList.remove("lumos-active", "nox-active", "confundo-active");
        Object.values(spellButtons).forEach(btn => btn.classList.remove("active"));
        
        activeSpell = spellName;

        if (spellName !== "finite") {
            body.classList.add(`${spellName}-active`);
            spellButtons[spellName].classList.add("active");
            playSound(soundMagic);
            
            // Log spellcast to browser console with magical styling
            console.log(`%c✨ Cast Spell: ${spellName.toUpperCase()}!`, "color: #b59449; font-size: 14px; font-weight: bold;");
        } else {
            spellButtons.finite.classList.add("active");
            playSound(soundPage); // Soft sound for cancelling
            console.log(`%c✨ Finite Incantatem: Spells dissolved.`, "color: #888; font-size: 14px;");
        }

        // Connection flashes to show magic fluctuation
        connectionStatus.textContent = spellName === "finite" ? "Active" : `Magic Active (${spellName.toUpperCase()})`;
        connectionStatus.style.color = spellName === "finite" ? "#2e7d32" : "#b59449";
    }

    // 5. Wanted Poster Interactive Input
    wantedInput.addEventListener("input", (e) => {
        const text = e.target.value.trim().toUpperCase();
        if (text === "") {
            wantedNameDisplay.textContent = "SIRIUS BLACK";
        } else {
            wantedNameDisplay.textContent = text;
        }
    });

    // 6. Revelio Spell Handlers (Reveals secret info and un-grays wanted photo)
    btnRevelio.addEventListener("click", () => {
        triggerRevelioWantedEffect();
    });

    function triggerRevelioWantedEffect() {
        playSound(soundMagic);
        
        // Temporarily reveal full-color photo and add magical aura
        const wantedImg = wantedPoster.querySelector(".portrait-photo");
        wantedPoster.style.borderColor = "var(--accent-gold)";
        wantedPoster.style.boxShadow = "0 0 25px var(--accent-gold)";
        
        // Remove grayscale / sepia and add color
        wantedImg.style.filter = "none";
        wantedImg.style.mixBlendMode = "normal";

        // Create heavy sparks burst centered on the image
        const imgRect = wantedImg.getBoundingClientRect();
        const centerX = imgRect.left + imgRect.width / 2;
        const centerY = imgRect.top + imgRect.height / 2;
        
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const burstX = centerX + (Math.random() - 0.5) * imgRect.width;
                const burstY = centerY + (Math.random() - 0.5) * imgRect.height;
                createSparkle(burstX, burstY);
            }, i * 20);
        }

        // Restore newspaper static look after 4 seconds
        setTimeout(() => {
            wantedPoster.style.borderColor = "var(--border-color)";
            wantedPoster.style.boxShadow = "3px 3px 15px rgba(0,0,0,0.1)";
            wantedImg.style.mixBlendMode = "multiply";
            
            if (body.classList.contains("nox-active")) {
                wantedImg.style.filter = "grayscale(1) sepia(0.2) invert(0.85) brightness(1.2) contrast(1.2)";
                wantedImg.style.mixBlendMode = "normal";
            } else {
                wantedImg.style.filter = "grayscale(1) sepia(0.15) contrast(1.25) brightness(0.95)";
            }
        }, 4000);
    }

    // Secret Section Unlocking
    function unlockSecretSection() {
        if (secretBox.classList.contains("locked")) {
            playSound(soundMagic);
            secretBox.classList.remove("locked");
            secretBox.classList.add("unlocked");
            
            // Spark burst over the secret widget
            const rect = secretBox.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                createSparkle(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height);
            }
        }
    }

    secretBox.querySelector(".lock-icon").addEventListener("click", () => {
        unlockSecretSection();
    });

    btnRevelioAlt.addEventListener("click", () => {
        unlockSecretSection();
    });

    // Fun Console Easter Egg
    console.log(
        "%cTHE DAILY PROPHET %c- Web Edition%c\n\n\"I solemnly swear that I am up to no good.\"",
        "font-family: 'Cinzel Decorative', serif; font-size: 20px; font-weight: bold; color: #b59449;",
        "font-size: 12px; font-style: italic; color: #888;",
        "font-family: monospace; font-size: 12px; color: #8b5a2b;"
    );
});
