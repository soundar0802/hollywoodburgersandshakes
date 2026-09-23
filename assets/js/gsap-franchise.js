/* =========================================================================
   FRANCHISE PAGE (franchise.html) - GSAP ANIMATIONS
   Requires gsap-animations.js to run first (window.HBS).
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (!window.HBS || typeof gsap === "undefined") return;

    var HBS = window.HBS;


    /* ============================================================
       ① ABOUT / INTRO BAND
    ============================================================ */
    (function () {

        var section = document.querySelector(".abt-section");
        if (!section) return;

        HBS.reveal(".franch-logo-div .franch-logo", {
            scale: 0.6, y: 0, duration: 0.8, ease: "back.out(2)", trigger: section
        });

        HBS.revealWords(".cont-div .main-cont", { trigger: section });

        HBS.reveal(".cont-div .sub-cont", { y: 18, duration: 0.6, trigger: section, start: HBS.lateStart });

        HBS.reveal(".burger-meal-div .burger-meal-img", {
            y: 70, scale: 0.9, duration: 1, ease: "expo.out",
            trigger: ".burger-meal-div"
        });

    })();


    /* ============================================================
       ② FRANCHISE INTRO / FAQ INTRO
    ============================================================ */
    (function () {

        var section = document.querySelector(".franchise-section");
        if (!section) return;

        HBS.reveal(".franchise-section .people-icon-div", {
            scale: 0.5, duration: 0.6, ease: "back.out(2.5)", trigger: section
        });

        HBS.revealWords(".franchise-section .head-cont-div h1", { trigger: section });

        HBS.reveal(".fr-content .fr-question", { y: 24, duration: 0.6, trigger: ".fr-content" });

        HBS.reveal(".fr-content > .para, .fr-content .fr-highlight", {
            y: 18, each: true, duration: 0.55, start: HBS.lateStart
        });

        var callout = document.querySelector(".fr-callout");
        if (callout && !HBS.reduceMotion) {

            gsap.from(callout, {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: callout, start: HBS.lateStart, toggleActions: "play none none reverse" }
            });

            var icon = callout.querySelector(".fr-callout-icon");
            if (icon) {
                gsap.from(icon, {
                    scale: 0, rotate: -180, duration: 0.6, ease: "back.out(2.4)", delay: 0.2,
                    scrollTrigger: { trigger: callout, start: HBS.lateStart, toggleActions: "play none none reverse" }
                });
            }

        }

    })();


    /* ============================================================
       ③ FAQ - alternating left / right cascade per item
       (bootstrap still owns the collapse open/close behaviour;
       we only animate the item's scroll-in entrance)
    ============================================================ */
    (function () {

        var section = document.querySelector(".faq-section");
        if (!section) return;

        HBS.reveal(".faq-section .people-icon-div", {
            scale: 0.5, duration: 0.6, ease: "back.out(2.5)", trigger: section
        });

        HBS.revealWords(".faq-section .head-cont-div h1", { trigger: section });

        if (HBS.reduceMotion) return;

        gsap.utils.toArray(".faq-item").forEach(function (item, i) {

            gsap.fromTo(item,
                { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.6, ease: "power3.out",
                    onComplete: function () { gsap.set(item, { clearProps: "transform" }); },
                    scrollTrigger: {
                        trigger: item,
                        start: HBS.scrollStart,
                        toggleActions: "play none none reverse"
                    }
                }
            );

        });

    })();


    /* ============================================================
       ④ FRANCHISE ENQUIRY FORM
    ============================================================ */
    (function () {

        var section = document.querySelector(".enquiry-section");
        if (!section) return;

        HBS.reveal(".enquiry-section .people-icon-div", {
            scale: 0.5, duration: 0.6, ease: "back.out(2.5)", trigger: section
        });

        HBS.revealWords(".enquiry-section .head-cont-div h1", { trigger: section });

        HBS.reveal(".enquiry-intro", { y: 20, duration: 0.6, trigger: section, start: HBS.lateStart });

        HBS.reveal(".enquiry-form .fr-field", {
            y: 24, duration: 0.55, stagger: 0.05, trigger: ".enquiry-form", start: HBS.lateStart
        });

        HBS.reveal(".enquiry-form .fr-consent, .enquiry-form p.fr-consent-note", {
            y: 16, duration: 0.5, trigger: ".enquiry-form", start: HBS.lateStart
        });

        HBS.popIn(".fr-submit-wrap .fr-submit", { start: HBS.lateStart });

    })();

    setTimeout(function () { ScrollTrigger.refresh(); }, 400);

});
