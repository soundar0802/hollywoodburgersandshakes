/* =========================================================================
   HOLLYWOOD BURGERS & SHAKES - GSAP CORE
   Shared setup + helpers used by every page-specific animation file
   (gsap-home.js / gsap-story.js / gsap-our-story.js / gsap-franchise.js).

   Load order required in the HTML (all plain <script> tags, no jQuery):
     gsap.min.js -> ScrollTrigger.min.js -> split-type -> gsap-animations.js
     -> the page specific gsap-*.js file
   ========================================================================= */

(function () {

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP / ScrollTrigger did not load - animations skipped.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Mobile browsers firing a resize when the URL bar hides/shows would
       otherwise re-trigger every ScrollTrigger mid-scroll. */
    ScrollTrigger.config({ ignoreMobileResize: true });

    var REDUCE_MOTION =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var CAN_HOVER =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;


    /* ============================================================
       SMOOTH (INERTIA) SCROLL
       Desktop mouse-wheel only - touch devices already have their
       own native momentum scrolling, so this only listens for
       "wheel" events (touch never fires them) and leaves phones/
       tablets on native scrolling untouched.
    ============================================================ */
    (function smoothScroll() {

        if (REDUCE_MOTION) return;

        var scrollEl = document.scrollingElement || document.documentElement;
        var pageBody = document.getElementById("page-body");
        var EASE = 0.1;
        var target = scrollEl.scrollTop;
        var current = target;
        var running = false;

        function maxScroll() {
            return scrollEl.scrollHeight - window.innerHeight;
        }

        /* the page sets scroll-behavior: smooth in CSS, which makes a
           plain ".scrollTop = x" assignment queue the BROWSER's own
           smoothing on top of ours; behavior: "instant" bypasses that
           so our own easing is the only thing moving the page. */
        function setScroll(y) {
            scrollEl.scrollTo({ top: y, left: 0, behavior: "instant" });
        }

        function tick() {

            current += (target - current) * EASE;

            if (Math.abs(target - current) < 0.5) {
                current = target;
                setScroll(current);
                running = false;
                return;
            }

            setScroll(current);
            requestAnimationFrame(tick);

        }

        window.addEventListener("wheel", function (e) {

            /* pinch-to-zoom on trackpads also fires wheel+ctrlKey - leave it alone */
            if (e.ctrlKey) return;

            /* the mobile nav overlay locks page scroll itself - don't fight it */
            if (pageBody && pageBody.classList.contains("active")) return;

            e.preventDefault();

            var delta = e.deltaY;
            if (e.deltaMode === 1) delta *= 18;              /* line mode -> px */
            if (e.deltaMode === 2) delta *= window.innerHeight; /* page mode -> px */

            target = Math.max(0, Math.min(target + delta, maxScroll()));

            if (!running) {
                running = true;
                requestAnimationFrame(tick);
            }

        }, { passive: false });

        /* keep target in sync with scrollbar drag / keyboard / anchor jumps */
        window.addEventListener("scroll", function () {
            if (!running) {
                target = scrollEl.scrollTop;
                current = target;
            }
        });

        window.addEventListener("resize", function () {
            target = Math.min(target, Math.max(0, maxScroll()));
        });

    })();


    /* ============================================================
       RESPONSIVE SCROLL-TRIGGER START POINT
       Returned as a function (not a fixed string) so ScrollTrigger
       re-evaluates it on refresh/resize/orientation change instead
       of freezing whatever the viewport was on first paint.
    ============================================================ */
    function scrollStart() {
        var w = window.innerWidth;
        if (w <= 575) return "top 93%";
        if (w <= 767) return "top 88%";
        if (w <= 991) return "top 85%";
        return "top 80%";
    }

    function lateStart() {
        var w = window.innerWidth;
        if (w <= 575) return "top 97%";
        if (w <= 991) return "top 92%";
        return "top 90%";
    }


    /* ============================================================
       SPLIT-TEXT SCROLL REVEAL
       Wraps the element's text into words with SplitType and plays
       a staggered reveal, either on scroll or immediately (hero).
    ============================================================ */
    function revealWords(selector, opts) {

        opts = opts || {};

        var el = (typeof selector === "string")
            ? document.querySelector(selector)
            : selector;

        if (!el || typeof SplitType === "undefined") return null;

        if (REDUCE_MOTION) return null;

        var split = new SplitType(el, { types: "words" });

        var vars = {
            y: opts.y || 55,
            opacity: 0,
            rotateZ: opts.rotate === false
                ? 0
                : function (i) { return (i % 2 === 0) ? -4 : 4; },
            duration: opts.duration || 0.8,
            ease: opts.ease || "expo.out",
            stagger: { each: opts.stagger || 0.06, from: "start" }
        };

        if (opts.scrollTrigger !== false) {

            vars.scrollTrigger = {
                trigger: opts.trigger || el,
                start: opts.start || scrollStart,
                toggleActions: "play none none reverse"
            };

        } else {

            vars.delay = opts.delay || 0;

        }

        gsap.from(split.words, vars);

        return split;
    }


    /* ============================================================
       GENERIC FADE / RISE REVEAL
       For anything that isn't split text - images, cards, buttons,
       icons. `targets` can be a selector string or a NodeList/array.
    ============================================================ */
    function reveal(targets, opts) {

        opts = opts || {};

        var els = (typeof targets === "string")
            ? gsap.utils.toArray(targets)
            : targets;

        if (!els || !els.length) return;

        if (REDUCE_MOTION) return;

        /* Built with gsap.from() rather than fromTo() on purpose: the
           "to" state is whatever the element's own CSS already renders
           (e.g. .franch-logo has a static transform: scale(1.5) in CSS),
           so GSAP reads that per-element instead of us hard-coding
           scale/rotate: 1/0 and snapping to the real value once
           clearProps runs. */
        var vars = {
            y: opts.y != null ? opts.y : 45,
            x: opts.x || 0,
            opacity: 0,
            duration: opts.duration || 0.8,
            ease: opts.ease || "power3.out",
            clearProps: opts.clearProps || "transform",
            scrollTrigger: {
                trigger: opts.trigger || els[0],
                start: opts.start || scrollStart,
                toggleActions: "play none none reverse"
            }
        };

        if (opts.scale != null) vars.scale = opts.scale;
        if (opts.rotateFrom != null) vars.rotate = opts.rotateFrom;

        if (opts.each) {

            els.forEach(function (el) {

                gsap.from(el, Object.assign({}, vars, {
                    scrollTrigger: {
                        trigger: el,
                        start: opts.start || scrollStart,
                        toggleActions: "play none none reverse"
                    }
                }));

            });

        } else {

            vars.stagger = opts.stagger != null ? opts.stagger : 0;
            gsap.from(els, vars);

        }

    }


    /* ============================================================
       MAGNETIC / BOUNCY HOVER FOR CTA BUTTONS
    ============================================================ */
    function magnetize(selector) {

        if (!CAN_HOVER || REDUCE_MOTION) return;

        document.querySelectorAll(selector).forEach(function (btn) {

            if (btn.dataset.hbsMagnetized) return;
            btn.dataset.hbsMagnetized = "1";

            btn.addEventListener("mouseenter", function () {
                gsap.to(btn, { scale: 1.06, duration: 0.25, ease: "power2.out" });
            });

            btn.addEventListener("mouseleave", function () {
                gsap.to(btn, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
            });

        });

    }


    /* ============================================================
       CTA POP-IN (used for order buttons / submit buttons)
    ============================================================ */
    function popIn(selector, opts) {

        opts = opts || {};

        var els = gsap.utils.toArray(selector);
        if (!els.length || REDUCE_MOTION) return;

        els.forEach(function (el) {

            gsap.fromTo(el,
                { scale: 0.6, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.55,
                    ease: "back.out(2.6)",
                    scrollTrigger: opts.scroll === false ? undefined : {
                        trigger: el,
                        start: opts.start || lateStart,
                        toggleActions: "play none none reverse"
                    },
                    delay: opts.delay || 0,
                    onComplete: function () { gsap.set(el, { clearProps: "transform" }); }
                }
            );

        });

    }


    /* ============================================================
       HEADER + FOOTER
       Header/footer markup is injected asynchronously by header.js
       (fetch + innerHTML), so we wait for the "hbs:partialsReady"
       event it dispatches instead of racing DOMContentLoaded.
    ============================================================ */
    function animatePartials() {

        if (REDUCE_MOTION) return;

        var logo = document.querySelector("#header .brand-logo");
        var navItems = document.querySelectorAll(
            "#header .nav-links .nav-link-li"
        );

        if (logo || navItems.length) {

            var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            if (logo) {
                tl.from(logo, { y: -30, opacity: 0, duration: 0.6 });
            }

            if (navItems.length) {
                tl.from(navItems, {
                    y: -20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08
                }, "-=0.3");
            }

        }

        reveal("#footer .footer-logo", { y: 30, start: lateStart });
        reveal("#footer .footer-nav .nav-link-li", {
            y: 20, stagger: 0.08, start: lateStart, trigger: "#footer"
        });
        reveal("#footer .social-icons-flex .social-icon", {
            y: 20, scale: 0.7, stagger: 0.08, start: lateStart, trigger: "#footer"
        });

        magnetize(".order-btn, .loc-card__btn, .social-follow-btn, .insta-link-btn, .fr-submit, .footer .social-icon a");

        ScrollTrigger.refresh();

    }

    document.addEventListener("hbs:partialsReady", animatePartials);


    /* ============================================================
       REFRESH SAFETY NET
       Layout height changes (webfonts, images, the header/footer
       being injected) can leave ScrollTrigger start points stale.
    ============================================================ */
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
    });


    /* ============================================================
       PUBLIC API for the page-specific animation files
    ============================================================ */
    window.HBS = {
        reduceMotion: REDUCE_MOTION,
        scrollStart: scrollStart,
        lateStart: lateStart,
        revealWords: revealWords,
        reveal: reveal,
        magnetize: magnetize,
        popIn: popIn
    };

})();
