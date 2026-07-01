/* ==========================================================================
   DAILY PROPHET - INDIVIDUAL ARTICLE LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements for article rendering
    const loadingEl = document.getElementById("article-loading");
    const detailsWrapper = document.getElementById("article-details");
    const errorEl = document.getElementById("article-error");
    
    const titleEl = document.getElementById("article-title");
    const subtitleEl = document.getElementById("article-subtitle");
    const authorEl = document.getElementById("article-author");
    const dateEl = document.getElementById("article-date");
    const categoryEl = document.getElementById("article-category");
    const imageContainerEl = document.getElementById("article-image-container");
    const imageEl = document.getElementById("article-image");
    const captionEl = document.getElementById("article-image-caption");
    const bodyTextEl = document.getElementById("article-body-text");

    // Generic DOM Elements
    const body = document.body;
    const btnSound = document.getElementById("btn-sound");
    const soundPage = document.getElementById("sound-page");
    const soundMagic = document.getElementById("sound-magic");
    
    const spellButtons = {
        lumos: document.getElementById("spell-lumos"),
        nox: document.getElementById("spell-nox"),
        confundo: document.getElementById("spell-confundo"),
        finite: document.getElementById("spell-finite")
    };

    const backBtnHeader = document.getElementById("btn-back-header");
    const backBtnFooter = document.getElementById("btn-back-footer");

    // State Variables
    let soundEnabled = true;
    let particleThrottle = false;
    let activeSpell = "finite";

    // 1. Fetch Article ID from URL Query Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    // 2. Render Article Details
    function renderArticle() {
        if (!articleId) {
            showError();
            return;
        }

        // Search in articlesData (loaded from articles-data.js)
        const article = articlesData.find(item => item.id === articleId);

        if (!article) {
            showError();
            return;
        }

        // Set text content
        titleEl.textContent = article.title;
        subtitleEl.textContent = article.subtitle;
        authorEl.textContent = article.author;
        dateEl.textContent = article.date;
        categoryEl.textContent = article.category.toUpperCase();

        // Handle Image
        if (article.image) {
            imageEl.src = article.image;
            imageEl.alt = article.title;
            // Apply filter class
            if (article.filter) {
                imageEl.className = `magical-photo ${article.filter}`;
            } else {
                imageEl.className = `magical-photo`;
            }
            captionEl.textContent = `${article.title.toLowerCase().replace(/^\w/, c => c.toUpperCase())} (depicted on parchment).`;
            imageContainerEl.classList.remove("hide");
        } else {
            imageContainerEl.classList.add("hide");
        }

        // Handle Paragraphs with Dropcap
        bodyTextEl.innerHTML = "";
        article.content.forEach((para, index) => {
            const p = document.createElement("p");
            if (index === 0) {
                p.classList.add("lead-para");
                // Extract first letter for dropcap
                const firstChar = para.charAt(0);
                const remainingText = para.slice(1);
                p.innerHTML = `<span class="drop-cap">${firstChar}</span>${remainingText}`;
            } else {
                p.textContent = para;
            }
            bodyTextEl.appendChild(p);
        });

        // Show details, hide loading
        loadingEl.classList.add("hide");
        detailsWrapper.classList.remove("hide");
    }

    function showError() {
        loadingEl.classList.add("hide");
        detailsWrapper.classList.add("hide");
        errorEl.classList.remove("hide");
    }

    // Initialize Article Loading
    setTimeout(renderArticle, 500); // Slight delay for realistic magical loading feel!

    // 3. Audio Control System
    if (localStorage.getItem("soundEnabled") !== null) {
        soundEnabled = localStorage.getItem("soundEnabled") === "true";
        updateSoundButtonUI();
    }

    btnSound.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem("soundEnabled", soundEnabled);
        updateSoundButtonUI();
        playSound(soundPage);
    });

    // Page flip sound on back buttons
    [backBtnHeader, backBtnFooter].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                playSound(soundPage);
            });
        }
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

    // 4. Wand Spark Trail
    window.addEventListener("mousemove", (e) => {
        body.style.setProperty("--cursor-x", `${e.clientX}px`);
        body.style.setProperty("--cursor-y", `${e.clientY}px`);

        if (particleThrottle) return;
        particleThrottle = true;
        
        createSparkle(e.clientX, e.clientY);

        setTimeout(() => {
            particleThrottle = false;
        }, 15);
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        
        const offset = 8;
        const randomX = (Math.random() - 0.5) * offset;
        const randomY = (Math.random() - 0.5) * offset;
        
        sparkle.style.left = `${x + randomX}px`;
        sparkle.style.top = `${y + randomY}px`;

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
            sparkle.style.background = "#ffe082";
            sparkle.style.boxShadow = "0 0 10px #ffb300, 0 0 20px #ffa000";
        }

        const size = Math.random() * 6 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        document.getElementById("spark-container").appendChild(sparkle);

        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
        });
    }

    // 5. Spell Selection & Application
    Object.keys(spellButtons).forEach(spell => {
        spellButtons[spell].addEventListener("click", () => {
            castSpell(spell);
        });
    });

    function castSpell(spellName) {
        body.classList.remove("lumos-active", "nox-active", "confundo-active");
        Object.values(spellButtons).forEach(btn => btn.classList.remove("active"));
        
        activeSpell = spellName;

        if (spellName !== "finite") {
            body.classList.add(`${spellName}-active`);
            spellButtons[spellName].classList.add("active");
            playSound(soundMagic);
        } else {
            spellButtons.finite.classList.add("active");
            playSound(soundPage);
        }
    }
});
