document.addEventListener("DOMContentLoaded", function () {

    Promise.all([

        /* ==========================================
           LOAD HEADER
        ========================================== */

        fetch("header.html")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load header.html");
                }

                return response.text();

            }),


        /* ==========================================
           LOAD FOOTER
        ========================================== */

        fetch("footer.html")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load footer.html");
                }

                return response.text();

            })

    ])

    .then(([headerHTML, footerHTML]) => {


        /* ==========================================
           INSERT HEADER
        ========================================== */

        const headerContainer =
            document.getElementById("header-container");


        if (headerContainer) {

            headerContainer.innerHTML =
                headerHTML;


            /*
             * Header has now been inserted
             * into the DOM.
             */

            initHeader();

            initScrollHeader();

        } else {

            console.warn(
                "#header-container was not found."
            );

        }


        /* ==========================================
           INSERT FOOTER
        ========================================== */

        const footerContainer =
            document.getElementById("footer-container");


        if (footerContainer) {

            footerContainer.innerHTML =
                footerHTML;

        } else {

            console.warn(
                "#footer-container was not found."
            );

        }


        /*
         * Run navigation after BOTH
         * header and footer have been inserted.
         */

        setActiveNav();

        setCurrentYear();

    })


    /* ==========================================
       ERROR HANDLING
    ========================================== */

    .catch(error => {

        console.error(
            "Error loading common components:",
            error
        );

    });

});



/* =========================================================
   MOBILE MENU
========================================================= */

function initHeader() {

    const openBtn =
        document.getElementById("open-menu");

    const closeBtn =
        document.getElementById("close-menu");

    const navLinks =
        document.querySelector("#header .nav-links");

    const body =
        document.getElementById("page-body");

    const overlay =
        document.getElementById("overlay");


    /*
     * Stop if required elements are missing.
     */

    if (
        !openBtn ||
        !closeBtn ||
        !navLinks
    ) {

        console.warn(
            "Mobile menu elements were not found."
        );

        return;

    }


    /* ==========================================
       OPEN MENU
    ========================================== */

    openBtn.addEventListener(
        "click",
        function () {

            navLinks.classList.add("active");


            if (body) {
                body.classList.add("active");
            }


            if (overlay) {
                overlay.classList.add("active");
            }

        }
    );


    /* ==========================================
       CLOSE MENU
    ========================================== */

    closeBtn.addEventListener(
        "click",
        function () {

            navLinks.classList.remove("active");


            if (body) {
                body.classList.remove("active");
            }


            if (overlay) {
                overlay.classList.remove("active");
            }

        }
    );


    /* ==========================================
       CLOSE MENU USING OVERLAY
    ========================================== */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                navLinks.classList.remove(
                    "active"
                );


                if (body) {
                    body.classList.remove(
                        "active"
                    );
                }


                overlay.classList.remove(
                    "active"
                );

            }
        );

    }

}



/* =========================================================
   HEADER HIDE / SHOW ON SCROLL
========================================================= */

function initScrollHeader() {

    const header =
        document.getElementById("header");


    /*
     * Header is loaded dynamically.
     *
     * If it doesn't exist, stop.
     */

    if (!header) {

        console.warn(
            "#header was not found."
        );

        return;

    }


    let previousScrollPosition =
        window.scrollY;


    window.addEventListener(
        "scroll",
        function () {

            const currentScrollPosition =
                window.scrollY;


            /* ==================================
               SCROLLING DOWN
            ================================== */

            if (
                currentScrollPosition >
                    previousScrollPosition &&
                currentScrollPosition > 100
            ) {

                header.classList.add(
                    "hide"
                );

            }


            /* ==================================
               SCROLLING UP
            ================================== */

            else {

                header.classList.remove(
                    "hide"
                );

            }


            previousScrollPosition =
                currentScrollPosition;

        }
    );

}



/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActiveNav() {

    /*
     * Normalize the URL so that:
     *
     * /                       -> /
     * /index.html             -> /
     * /about/                 -> /about/
     * /about/index.html       -> /about/
     */

    function normalizePath(path) {

        if (!path) {
            return "/";
        }

        path = path
            .split("?")[0]
            .split("#")[0];

        /*
         * Remove index.html
         */

        if (path.endsWith("/index.html")) {

            path = path.substring(
                0,
                path.length - "index.html".length
            );

        }

        /*
         * Convert empty path to /
         */

        if (path === "") {
            path = "/";
        }

        /*
         * Make sure directory paths
         * end with /
         */

        if (!path.endsWith("/")) {
            path += "/";
        }

        return path;
    }


    /*
     * Current browser URL
     */

    const currentPage =
        normalizePath(
            window.location.pathname
        );


    /*
     * HEADER NAVIGATION
     */

    const headerLinks =
        document.querySelectorAll(
            "#header .nav-link"
        );


    headerLinks.forEach(function (link) {

        /*
         * Get the actual URL of the link.
         *
         * This converts:
         *
         * index.html
         * our-story.html
         * franchise.html
         *
         * into their complete pathname.
         */

        const linkPath =
            normalizePath(
                new URL(
                    link.getAttribute("href"),
                    window.location.href
                ).pathname
            );


        /*
         * Remove active from every link first.
         */

        link.classList.remove("active");


        /*
         * Add active when the normalized
         * paths are identical.
         */

        if (linkPath === currentPage) {

            link.classList.add("active");

        }

    });


    /*
     * FOOTER NAVIGATION
     */

    const footerLinks =
        document.querySelectorAll(
            "#footer .nav-link"
        );


    footerLinks.forEach(function (link) {

        const linkPath =
            normalizePath(
                new URL(
                    link.getAttribute("href"),
                    window.location.href
                ).pathname
            );


        link.classList.remove("active");


        if (linkPath === currentPage) {

            link.classList.add("active");

        }

    });

}



/* =========================================================
   CURRENT YEAR
========================================================= */

function setCurrentYear() {

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

}