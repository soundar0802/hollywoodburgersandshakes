/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActiveNav() {

    /*
     * Get current page filename.
     *
     * Examples:
     *
     * /repository/                  -> index.html
     * /repository/index.html       -> index.html
     * /repository/our-story.html   -> our-story.html
     * /repository/franchise.html   -> franchise.html
     */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    /*
     * If URL ends with "/", we are on the homepage.
     */

    if (!currentPage) {
        currentPage = "index.html";
    }


    /* ==========================================
       HEADER NAVIGATION
    ========================================== */

    const headerLinks =
        document.querySelectorAll(
            "#header .nav-link"
        );


    headerLinks.forEach(
        function (link) {

            let href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            /*
             * Get only the filename from href.
             *
             * index.html -> index.html
             * our-story.html -> our-story.html
             */

            let linkPage =
                href.split("/")
                    .pop();


            /*
             * Handle "/" if it exists anywhere.
             */

            if (!linkPage) {
                linkPage = "index.html";
            }


            /*
             * Remove old active class.
             */

            link.classList.remove(
                "active"
            );


            /*
             * Add active class to current page.
             */

            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );


    /* ==========================================
       FOOTER NAVIGATION
    ========================================== */

    const footerLinks =
        document.querySelectorAll(
            "#footer .nav-link"
        );


    footerLinks.forEach(
        function (link) {

            let href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            let linkPage =
                href.split("/")
                    .pop();


            if (!linkPage) {
                linkPage = "index.html";
            }


            /*
             * Remove old active class.
             */

            link.classList.remove(
                "active"
            );


            /*
             * Add active class to current page.
             */

            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}