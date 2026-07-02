/* ==========================================================================
   DAILY PROPHET - SHARED MAGIC ENGINE
   Sound system, spell system, and particle sparkle effects.
   Used by both index.html (app.js) and article.html (article.js).
   ========================================================================== */

const DailyProphetMagic = (() => {
    "use strict";

    // ---- State ----
    let soundEnabled = true;
    let particleThrottle = false;
    let activeSpell = "finite";

    // ---- DOM References (lazy-init on mount) ----
    let body = null;
    let btnSound = null;
    let soundPage = null;
    let soundMagic = null;
    let spellButtons = {};
    let connectionStatus = null;
    let sparkContainer = null;

    // ---- Sparkle Colors per Spell ----
    const SPELL_COLORS = {
        lumos:  { bg: "#fff9c4", shadow: "0 0 12px #fffde7, 0 0 22px #ffe082" },
        nox:    { bg: "#b2dfdb", shadow: "0 0 12px #80cbc4, 0 0 22px #004d40" },
        confundo:{ bg: "#e1bee7", shadow: "0 0 12px #ce93d8, 0 0 22px #4a148c" },
        finite: { bg: "#ffe082", shadow: "0 0 10px #ffb300, 0 0 20px #ffa000" }
    };

    // ---- Sound System ----
    function initSound() {
        btnSound = document.getElementById("btn-sound");
        soundPage = document.getElementById("sound-page");
        soundMagic = document.getElementById("sound-magic");

        if (!btnSound) return;

        // Restore preference
        const saved = localStorage.getItem("dp_soundEnabled");
        if (saved !== null) {
            soundEnabled = saved === "true";
            updateSoundButtonUI();
        }

        btnSound.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem("dp_soundEnabled", soundEnabled);
            updateSoundButtonUI();
            playSound(soundPage);
        });
    }

    function updateSoundButtonUI() {
        if (!btnSound) return;
        if (soundEnabled) {
            btnSound.innerHTML = '<span class="icon">\uD83D\uDD0A</span> Sound: ON';
            btnSound.classList.remove("muted");
        } else {
            btnSound.innerHTML = '<span class="icon">\uD83D\uDD07</span> Sound: OFF';
            btnSound.classList.add("muted");
        }
    }

    function playSound(audioEl) {
        if (!soundEnabled || !audioEl) return;
        audioEl.currentTime = 0;
        audioEl.play().catch(() => { /* autoplay blocked — silent fallback */ });
    }

    // ---- Sparkle / Particle System ----
    function initSparkles() {
        body = document.body;
        sparkContainer = document.getElementById("spark-container");
        if (!sparkContainer) return;

        window.addEventListener("mousemove", (e) => {
            // Track for CSS Lumos radial gradient
            body.style.setProperty("--cursor-x", `${e.clientX}px`);
            body.style.setProperty("--cursor-y", `${e.clientY}px`);

            if (particleThrottle) return;
            particleThrottle = true;
            createSparkle(e.clientX, e.clientY);
            setTimeout(() => { particleThrottle = false; }, 15);
        });
    }

    function createSparkle(x, y) {
        if (!sparkContainer) return;
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");

        const offset = 8;
        const randomX = (Math.random() - 0.5) * offset;
        const randomY = (Math.random() - 0.5) * offset;
        sparkle.style.left = `${x + randomX}px`;
        sparkle.style.top = `${y + randomY}px`;

        const colors = SPELL_COLORS[activeSpell] || SPELL_COLORS.finite;
        sparkle.style.background = colors.bg;
        sparkle.style.boxShadow = colors.shadow;

        const size = Math.random() * 6 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        sparkContainer.appendChild(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove());
    }

    // Expose createSparkle for burst effects in app.js
    function burstSparkles(centerX, centerY, count, spreadX, spreadY) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createSparkle(
                    centerX + (Math.random() - 0.5) * spreadX,
                    centerY + (Math.random() - 0.5) * spreadY
                );
            }, i * 20);
        }
    }

    // ---- Spell System ----
    function initSpells() {
        spellButtons = {
            lumos:    document.getElementById("spell-lumos"),
            nox:      document.getElementById("spell-nox"),
            confundo: document.getElementById("spell-confundo"),
            finite:   document.getElementById("spell-finite")
        };
        connectionStatus = document.getElementById("connection-status");

        Object.keys(spellButtons).forEach(spell => {
            const btn = spellButtons[spell];
            if (!btn) return;
            btn.addEventListener("click", () => castSpell(spell));
        });
    }

    function castSpell(spellName) {
        if (!body) body = document.body;

        body.classList.remove("lumos-active", "nox-active", "confundo-active");
        Object.values(spellButtons).forEach(btn => { if (btn) btn.classList.remove("active"); });

        activeSpell = spellName;

        if (spellName !== "finite") {
            body.classList.add(`${spellName}-active`);
            if (spellButtons[spellName]) {
                spellButtons[spellName].classList.add("active");
                spellButtons[spellName].setAttribute("aria-pressed", "true");
            }
            playSound(soundMagic);
            console.log(`%c\u2728 Cast Spell: ${spellName.toUpperCase()}!`, "color: #b59449; font-size: 14px; font-weight: bold;");
        } else {
            if (spellButtons.finite) {
                spellButtons.finite.classList.add("active");
                spellButtons.finite.setAttribute("aria-pressed", "true");
            }
            playSound(soundPage);
            console.log(`%c\u2728 Finite Incantatem: Spells dissolved.`, "color: #888; font-size: 14px;");
        }

        // Reset aria-pressed on non-active spells
        Object.entries(spellButtons).forEach(([key, btn]) => {
            if (btn && key !== spellName) btn.setAttribute("aria-pressed", "false");
        });

        // Update connection status indicator
        if (connectionStatus) {
            connectionStatus.textContent = spellName === "finite" ? "Active" : `Magic Active (${spellName.toUpperCase()})`;
            connectionStatus.style.color = spellName === "finite" ? "#2e7d32" : "#b59449";
        }
    }

    // ---- Wizarding Date ----
    function generateWizardingDate() {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayName = days[now.getDay()];
        const dateNum = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        let suffix = "";
        if (year % 3 === 0) suffix = " (Year of the Dragon)";
        else if (year % 3 === 1) suffix = " (Year of the Phoenix)";
        else suffix = " (Year of the Hippogriff)";
        return `${dayName}, ${dateNum} ${monthName} ${year}${suffix}`;
    }

    // ---- Master Init ----
    function init() {
        body = document.body;
        initSound();
        initSparkles();
        initSpells();
    }

    // ---- Public API ----
    return {
        init,
        playSound,
        createSparkle,
        burstSparkles,
        castSpell,
        generateWizardingDate,
        getActiveSpell: () => activeSpell,
        setBodyClass: (cls) => { if (body) body.classList.add(cls); }
    };
})();