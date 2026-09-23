/* =========================================================================
   "OUR STORY" LEGACY PAGE (our-story.html) - GSAP ANIMATIONS
   Requires gsap-animations.js to run first (window.HBS).
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (!window.HBS || typeof gsap === "undefined") return;

    var HBS = window.HBS;


    /* ============================================================
       ① HERO
    ============================================================ */
    (function () {

        var hero = document.querySelector(".story-hero-section");
        if (!hero) return;

        var shape = hero.querySelector(".shape-top-img");
        var span = hero.querySelector(".common-span");

        if (!HBS.reduceMotion) {

            if (shape) {
                gsap.from(shape, {
                    y: -60, opacity: 0, rotate: -8, duration: 1.1, ease: "power3.out"
                });
            }

            if (span) {
                gsap.from(span, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.25 });
            }

        }

        HBS.revealWords(".story-hero-section .hero-heading", {
            scrollTrigger: false, delay: 0.45, stagger: 0.08
        });

    })();


    /* ============================================================
       ② OUR STORY COPY - reveals paragraph by paragraph
    ============================================================ */
    (function () {

        var section = document.querySelector(".story-content-section");
        if (!section) return;

        HBS.revealWords(".story-content-section .primary-heading", { trigger: section });

        HBS.reveal(".story-content-section .story-para", {
            y: 24, each: true, duration: 0.6, start: HBS.lateStart
        });

    })();


    /* ============================================================
       ③ OUR FOOD
    ============================================================ */
    (function () {

        var section = document.querySelector(".food-section");
        if (!section) return;

        HBS.reveal(".food-section .food-para", {
            y: 20, duration: 0.7, trigger: section
        });

        HBS.revealWords(".food-section .food-heading", { trigger: section, y: 70 });

        gsap.to(".food-section .food-wrapper .dark-overlay", {
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

    })();


    /* ============================================================
       ④ GALLERY - clip-path wipe reveal, staggered per image
    ============================================================ */
    (function () {

        [".gallery-section", ".mobile-resp-gallery-section"].forEach(function (sectionSel) {

            var section = document.querySelector(sectionSel);
            if (!section) return;

            HBS.revealWords(section.querySelector(".primary-heading"), { trigger: section });

            var images = gsap.utils.toArray(sectionSel + " .gallery-wrapper");
            if (!images.length || HBS.reduceMotion) return;

            images.forEach(function (wrap, i) {

                gsap.fromTo(wrap,
                    { clipPath: "inset(0 0 100% 0)", scale: 1.15 },
                    {
                        clipPath: "inset(0 0 0% 0)",
                        scale: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        delay: (i % 4) * 0.08,
                        onComplete: function () { gsap.set(wrap, { clearProps: "transform" }); },
                        scrollTrigger: {
                            trigger: wrap,
                            start: HBS.scrollStart,
                            toggleActions: "play none none reverse"
                        }
                    }
                );

            });

        });

    })();


    /* ============================================================
       ⑤ SOCIAL MEDIA
    ============================================================ */
    (function () {

        var section = document.querySelector(".social-media--section");
        if (!section) return;

        HBS.revealWords(".social-media--section .get-social--heading", { trigger: section });

        HBS.reveal(".social-media--section .social-section--img", {
            scale: 0.85, y: 30, each: true, duration: 0.6, ease: "back.out(1.8)"
        });

        HBS.popIn(".insta-btn .insta-link-btn", { start: HBS.lateStart });

    })();

    setTimeout(function () { ScrollTrigger.refresh(); }, 400);

});
