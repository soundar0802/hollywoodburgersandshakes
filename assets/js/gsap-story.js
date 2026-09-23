/* =========================================================================
   "OUR STORY" PAGE (story.html) - GSAP ANIMATIONS
   Requires gsap-animations.js to run first (window.HBS).
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (!window.HBS || typeof gsap === "undefined") return;

    var HBS = window.HBS;


    /* ============================================================
       ① ABOUT US / FRANCHISE SUPPORT
    ============================================================ */
    (function () {

        var section = document.querySelector(".franchise-support-section");
        if (!section) return;

        HBS.revealWords(".support-content .primary-heading", { trigger: section });

        HBS.reveal(".support-content .support-para", {
            y: 20, each: true, duration: 0.55, start: HBS.lateStart
        });

        HBS.reveal(".support-image", {
            x: 70, scale: 0.92, duration: 1, ease: "expo.out", trigger: section
        });

    })();


    /* ============================================================
       ② OUR STORY TIMELINE
    ============================================================ */
    (function () {

        var section = document.querySelector(".story-section");
        var timeline = section ? section.querySelector(".story-timeline") : null;
        if (!section) return;

        HBS.reveal(".story-section .people-icon-div", {
            scale: 0.5, y: 0, duration: 0.6, ease: "back.out(2.5)", trigger: section
        });

        HBS.revealWords(".story-section h1", { trigger: section });

        /* alternating left / right cascade, matching the zig-zag layout */
        var items = gsap.utils.toArray(".story-item");

        items.forEach(function (item) {

            var fromRight = item.classList.contains("story-item--right");
            var node = item.querySelector(".story-node");
            var card = item.querySelector(".story-card");

            if (!HBS.reduceMotion) {

                gsap.fromTo(item,
                    { x: fromRight ? 60 : -60, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: HBS.scrollStart,
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                if (node) {
                    gsap.from(node, {
                        scale: 0, rotate: fromRight ? -90 : 90, duration: 0.6,
                        ease: "back.out(2.2)", delay: 0.15,
                        scrollTrigger: {
                            trigger: item,
                            start: HBS.scrollStart,
                            toggleActions: "play none none reverse"
                        }
                    });
                }

            }

        });

        /* the dashed centre line "draws" itself downward as the
           timeline scrolls through view - driven by a CSS variable
           (see .story-timeline in style.css) rather than a real element. */
        if (timeline && !HBS.reduceMotion) {

            gsap.fromTo(timeline,
                { "--tl-progress": 0 },
                {
                    "--tl-progress": 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: timeline,
                        start: "top 75%",
                        end: "bottom 65%",
                        scrub: 0.6
                    }
                }
            );

        }

    })();

    setTimeout(function () { ScrollTrigger.refresh(); }, 400);

});
