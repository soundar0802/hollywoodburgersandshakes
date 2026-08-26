document.addEventListener("DOMContentLoaded", function () {

    const openMenu = document.getElementById("open-menu");
    const closeMenu = document.getElementById("close-menu");
    const slide = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");
    const body = document.getElementById("page-body");
    const overlay = document.getElementById("overlay");

    const activePage = window.location.pathname;


    /*
     * Only initialize mobile menu if all required
     * elements are available.
     */

    if (
        openMenu &&
        closeMenu &&
        slide &&
        body &&
        overlay
    ) {

        /* Open Menu */

        openMenu.addEventListener("click", function () {

            slide.classList.add("active");
            body.classList.add("active");
            overlay.classList.add("active");

        });


        /* Close Menu */

        closeMenu.addEventListener("click", function () {

            slide.classList.remove("active");
            body.classList.remove("active");
            overlay.classList.remove("active");

        });


        /* Close Menu When Overlay Is Clicked */

        overlay.addEventListener("click", function () {

            slide.classList.remove("active");
            body.classList.remove("active");
            overlay.classList.remove("active");

        });


        /* Close Menu When Navigation Link Is Clicked */

        links.forEach(function (link) {

            link.addEventListener("click", function () {

                slide.classList.remove("active");
                slide.style.transition = "0.5s";

                body.classList.remove("active");
                overlay.classList.remove("active");

            });


            /* Active Navigation */

            const linkPath =
                new URL(link.href).pathname;

            if (linkPath === activePage) {

                link.classList.add("active");

            }

        });

    }

});


/* =========================================================
   IMAGE PREVIEW
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const thumbnails =
        document.querySelectorAll(".allergy-banner");

    const modalImage =
        document.getElementById("previewImage");

    const modalElement =
        document.getElementById("imagePreviewModal");


    /*
     * Only initialize if the image preview
     * exists on the current page.
     */

    if (
        thumbnails.length > 0 &&
        modalImage &&
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const modal =
            new bootstrap.Modal(modalElement);


        thumbnails.forEach(function (thumbnail) {

            thumbnail.addEventListener("click", function () {

                const imgSrc =
                    thumbnail.getAttribute("data-imgsrc");

                if (imgSrc) {

                    modalImage.src = imgSrc;
                    modal.show();

                }

            });

        });

    }

});


/* =========================================================
   OWL CAROUSEL - HOME PAGE
========================================================= */

$(document).ready(function () {

    if (
        $(".img-carousel").length &&
        typeof $.fn.owlCarousel === "function"
    ) {

        $(".img-carousel").owlCarousel({

            loop: true,
            margin: 50,
            nav: false,
            dots: true,
            dotsEach: 3,
            autoplay: true,
            autoplayTimeout: 3000,
            stagePadding: 150,

            responsive: {

                0: {
                    items: 1,
                    margin: 20,
                    stagePadding: 10
                },

                600: {
                    items: 1,
                    stagePadding: 100
                },

                768: {
                    items: 1,
                    stagePadding: 250
                },

                992: {
                    items: 1,
                    stagePadding: 300
                },

                1200: {
                    items: 3
                }

            }

        });

    }

});


/* =========================================================
   TESTIMONIAL CAROUSEL
========================================================= */

$(document).ready(function () {

    if (
        $(".testimonial-carousel").length &&
        typeof $.fn.owlCarousel === "function"
    ) {

        $(".testimonial-carousel").owlCarousel({

            loop: false,
            margin: 10,
            nav: false,
            dots: false,
            autoplay: false,
            autoplayTimeout: 2000,

            responsive: {

                0: {
                    items: 1
                },

                600: {
                    items: 1
                },

                1000: {
                    items: 1
                }

            }

        });

    }

});


/* =========================================================
   ENQUIRY FORM VALIDATION
========================================================= */

$(function () {

    "use strict";


    var enquiryForm = function () {

        if (
            $("#enquiryForm").length > 0 &&
            typeof $.fn.validate === "function"
        ) {

            $("#enquiryForm").validate({

                rules: {

                    name: "required",

                    phone: "required",

                    email: {
                        required: true,
                        email: true
                    },

                    location: "required",

                    fund: "required",

                    comments: {
                        required: true,
                        minlength: 5
                    }

                },


                messages: {

                    name: "Please enter your name",

                    phone: "Please enter your Telephone Number",

                    email: "Please enter a valid email address",

                    location: "Please enter a valid location",

                    fund: "Please enter a valid fund",

                    comments: "Please enter a message"

                },


                /* Submit via AJAX */

                submitHandler: function (form) {

                    var $submit =
                        $(".submitting");

                    var waitText =
                        "Submitting...";


                    $.ajax({

                        type: "POST",

                        url: "./assets/php/enquiry-form.php",

                        data: $(form).serialize(),


                        beforeSend: function () {

                            console.log(
                                $(form).serialize()
                            );

                            $submit
                                .css("display", "block")
                                .text(waitText);

                        },


                        success: function (msg) {

                            if (msg == "OK") {

                                $("#form-message-warning")
                                    .hide();


                                setTimeout(function () {

                                    $("#enquiryForm")
                                        .fadeOut();

                                }, 1000);


                                setTimeout(function () {

                                    $("#form-message-success")
                                        .fadeIn();

                                }, 1400);


                            } else {

                                $("#form-message-warning")
                                    .html(msg);

                                $("#form-message-warning")
                                    .fadeIn();

                                $submit
                                    .css("display", "none");

                            }

                        },


                        error: function () {

                            $("#form-message-warning")
                                .html(
                                    "Something went wrong. Please try again."
                                );

                            $("#form-message-warning")
                                .fadeIn();

                            $submit
                                .css("display", "none");

                        }

                    });

                }

            });

        }

    };


    enquiryForm();

});


/* =========================================================
   CONTACT FORM VALIDATION
========================================================= */

$(function () {

    "use strict";


    var contactForm = function () {

        if (
            $("#contactForm").length > 0 &&
            typeof $.fn.validate === "function"
        ) {

            $("#contactForm").validate({

                rules: {

                    name: "required",

                    address: "required",

                    email: {
                        required: true,
                        email: true
                    },

                    message: {
                        required: true,
                        minlength: 5
                    }

                },


                messages: {

                    name: "Please enter your name",

                    address: "Please enter your address",

                    email: "Please enter a valid email address",

                    message: "Please enter a message"

                },


                /* Submit via AJAX */

                submitHandler: function (form) {

                    var $submit =
                        $(".submitting");

                    var waitText =
                        "Submitting...";


                    $.ajax({

                        type: "POST",

                        url: "./assets/php/send-email.php",

                        data: $(form).serialize(),


                        beforeSend: function () {

                            $submit
                                .css("display", "block")
                                .text(waitText);

                        },


                        success: function (msg) {

                            if (msg == "OK") {

                                $("#form-message-warning")
                                    .hide();


                                setTimeout(function () {

                                    $("#contactForm")
                                        .fadeOut();

                                }, 1000);


                                setTimeout(function () {

                                    $("#form-message-success")
                                        .fadeIn();

                                }, 1400);


                            } else {

                                $("#form-message-warning")
                                    .html(msg);

                                $("#form-message-warning")
                                    .fadeIn();

                                $submit
                                    .css("display", "none");

                            }

                        },


                        error: function () {

                            $("#form-message-warning")
                                .html(
                                    "Something went wrong. Please try again."
                                );

                            $("#form-message-warning")
                                .fadeIn();

                            $submit
                                .css("display", "none");

                        }

                    });

                }

            });

        }

    };


    contactForm();

});


/* =========================================================
   DOWNLOAD PDF
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const enquiryForm =
        document.getElementById("enquiryForm");

    const enquiryFormInputs =
        document.querySelectorAll(
            "#enquiryForm input"
        );

    const downloadBtn =
        document.getElementById(
            "download-submit-btn"
        );


    /*
     * If the download button doesn't exist
     * on this page, do nothing.
     */

    if (!downloadBtn) {
        return;
    }


    downloadBtn.addEventListener(
        "click",
        downloadpdf
    );


    function downloadpdf(event) {

        /*
         * Prevent default button behaviour
         * if this is a button inside a form.
         */

        if (event) {
            event.preventDefault();
        }


        /*
         * Validate enquiry form inputs
         */

        for (
            let input of enquiryFormInputs
        ) {

            if (
                input.value.trim() === ""
            ) {

                return;

            }

        }


        /*
         * PDF path
         */

        const pdfFilePath =
            "assets/images/docs/franchise-prospectus.pdf";


        /*
         * Create download link
         */

        const a =
            document.createElement("a");


        a.href = pdfFilePath;

        a.id = "download-link";

        a.download =
            "downloaded-pdf.pdf";

        a.style.display = "none";


        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

    }

});