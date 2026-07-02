/* ==========================================================================
   DAILY PROPHET - ARTICLE PAGE LOGIC
   Uses shared magic-engine.js for sound, spells, and particles.
   Renders full article from articles-data.js safely (no innerHTML on user content).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ---- Initialize Shared Magic Engine ----
    DailyProphetMagic.init();

    // ---- DOM Elements ----
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

    const backBtnHeader = document.getElementById("btn-back-header");
    const backBtnFooter = document.getElementById("btn-back-footer");
    const soundPageEl = document.getElementById("sound-page");

    // ---- 1. Fetch Article ID from URL ----
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    // ---- 2. Safe Text Helper (XSS prevention) ----
    function safeText(el, text) {
        if (!el) return;
        el.textContent = text; // textContent is safe — no HTML parsing
    }

    // Helper to set/update meta tags
    function setMeta(property, content) {
        if (!content) return;
        let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
        if (meta) {
            meta.content = content;
        }
    }

    // ---- 3. Render Article ----
    function renderArticle() {
        if (!articleId || typeof articlesData === "undefined") {
            showError();
            return;
        }

        const article = articlesData.find(item => item.id === articleId);

        if (!article) {
            showError();
            return;
        }

        // Set text content safely (no innerHTML = no XSS risk)
        safeText(titleEl, article.title);
        safeText(subtitleEl, article.subtitle);
        safeText(authorEl, article.author);
        safeText(dateEl, article.date);
        safeText(categoryEl, (article.category || "NEWS REPORT").toUpperCase());

        // Dynamic page title for SEO
        document.title = `${article.title} | The Daily Prophet`;

        // Dynamic Open Graph meta tags for social sharing
        setMeta("og:title", article.title);
        setMeta("og:description", article.subtitle);
        if (article.image) {
            setMeta("og:image", article.image);
        }
        setMeta("twitter:title", article.title);
        setMeta("twitter:description", article.subtitle);
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = article.snippet || article.subtitle;

        // Handle Image safely
        if (article.image && imageEl && imageContainerEl && captionEl) {
            imageEl.src = article.image;
            imageEl.alt = article.title;
            imageEl.className = article.filter ? `magical-photo ${article.filter}` : "magical-photo";
            captionEl.textContent = article.title + " (depicted on parchment).";
            imageContainerEl.classList.remove("hide");
        } else if (imageContainerEl) {
            imageContainerEl.classList.add("hide");
        }

        // Handle Paragraphs with Dropcap (safe DOM construction)
        if (bodyTextEl) {
            bodyTextEl.innerHTML = ""; // clear container
            const content = article.content || [];
            content.forEach((para, index) => {
                const p = document.createElement("p");
                if (index === 0 && para.length > 0) {
                    p.classList.add("lead-para");
                    const span = document.createElement("span");
                    span.classList.add("drop-cap");
                    span.textContent = para.charAt(0);
                    p.appendChild(span);
                    p.appendChild(document.createTextNode(para.slice(1)));
                } else {
                    p.textContent = para;
                }
                bodyTextEl.appendChild(p);
            });
        }

        // Show details, hide loading
        if (loadingEl) loadingEl.classList.add("hide");
        if (detailsWrapper) detailsWrapper.classList.remove("hide");
    }

    function showError() {
        if (loadingEl) loadingEl.classList.add("hide");
        if (detailsWrapper) detailsWrapper.classList.add("hide");
        if (errorEl) errorEl.classList.remove("hide");
    }

    // Initialize Article Loading (slight delay for magical feel)
    setTimeout(renderArticle, 500);

    // ---- 4. Back Button Sound ----
    [backBtnHeader, backBtnFooter].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => DailyProphetMagic.playSound(soundPageEl));
        }
    });
});