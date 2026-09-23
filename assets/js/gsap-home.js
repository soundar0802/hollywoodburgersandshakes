/* =========================================================================
   HOME PAGE (index.html) - GSAP ANIMATIONS
   Requires gsap-animations.js to run first (window.HBS).
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (!window.HBS || typeof gsap === "undefined") return;

    var HBS = window.HBS;


    /* ============================================================
       ① HERO
       Plays immediately on load - not scroll triggered.
    ============================================================ */
    (function () {

        var hero = document.querySelector(".hero-section");
        if (!hero) return;

        var video = hero.querySelector(".hero-video");
        var overlay = hero.querySelector(".dark-overlay");
        var span = hero.querySelector(".common-span");

        if (HBS.reduceMotion) return;

        /* subtle Ken Burns push-in on the background video */
        if (video) {
            gsap.fromTo(video,
                { scale: 1.15 },
                { scale: 1, duration: 2.6, ease: "power2.out" }
            );
        }

        if (overlay) {
            gsap.from(overlay, { opacity: 0, duration: 1.2, ease: "power2.out" });
        }

        if (span) {
            gsap.from(span, {
                y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.3
            });
        }

        HBS.revealWords(".hero-heading", {
            scrollTrigger: false, delay: 0.55, stagger: 0.08
        });

        /* background pans slightly as the hero scrolls out from under the fixed header */
        gsap.to(video, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

    })();


    /* ============================================================
       ② LOCATION CARDS
    ============================================================ */
    (function () {

        var section = document.querySelector(".location-section");
        if (!section) return;

        HBS.reveal(".location-section .loc-card", {
            y: 60, each: true, stagger: 0, duration: 0.75
        });

        HBS.reveal(".location-section .location-stars svg", {
            y: 0, scale: 0, duration: 0.5, stagger: 0.08,
            trigger: ".location-content", ease: "back.out(3)"
        });

    })();


    /* ============================================================
       ③ FRANCHISING / ORDER NOW BAND
    ============================================================ */
    (function () {

        var section = document.querySelector(".franchising-section");
        if (!section) return;

        HBS.reveal(".franchising-logo", {
            scale: 0.85, y: 40, duration: 0.9, ease: "expo.out",
            trigger: section
        });

        HBS.reveal(".middle-content .middle-title", {
            scale: 0.8, y: 20, duration: 0.7, ease: "back.out(2)", trigger: section
        });

        HBS.revealWords(".franchising-title", { trigger: section, stagger: 0.05 });

        HBS.reveal(".franchising-para", {
            y: 20, each: true, duration: 0.6, start: HBS.lateStart
        });

    })();


    /* ============================================================
       ④ SOCIAL MEDIA
    ============================================================ */
    (function () {

        var section = document.querySelector(".social-media--section");
        if (!section) return;

        HBS.revealWords(".get-social--heading", { trigger: section });

        HBS.reveal(".social-section--img", {
            scale: 0.85, y: 30, each: true, duration: 0.6, ease: "back.out(1.8)"
        });

        HBS.reveal(".social-follow-row .social-follow-btn", {
            y: 25, each: true, duration: 0.5, ease: "back.out(2)"
        });

    })();


    setTimeout(function () { ScrollTrigger.refresh(); }, 400);

});
