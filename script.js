/* =========================
   OUR SNAPS
========================= */

const snapItems =
    document.querySelectorAll(
        ".snap-item"
    );

const snapLightbox =
    document.getElementById(
        "snapLightbox"
    );

const snapLightboxImage =
    document.getElementById(
        "snapLightboxImage"
    );

const snapCounter =
    document.getElementById(
        "snapCounter"
    );

const snapClose =
    document.getElementById(
        "snapClose"
    );

const snapPrev =
    document.getElementById(
        "snapPrev"
    );

const snapNext =
    document.getElementById(
        "snapNext"
    );


const snapPhotos = [
    "snap1.jpg",
    "snap2.jpg",
    "snap3.jpg",
    "snap4.jpg",
    "snap5.jpg",
    "snap6.jpg",
    "snap7.jpg"
];


/* Title for the whole Snap section */

const snapSectionTitle =
    "Memories That We Cherish Virtually 😂";


/* Titles / captions for each Snap */

const snapTitles = [
    "That day 😂",
    "One of those moments",
    "Still remember this",
    "Random but special",
    "Coffee together",
    "Selfie",
    "And here we are"
];


let currentSnap = 0;


/* =========================
   SHOW SNAP
========================= */

function showSnap(index) {

    if (
        index < 0 ||
        index >= snapPhotos.length
    ) {
        return;
    }

    currentSnap = index;

    snapLightboxImage.src =
        snapPhotos[currentSnap];

    snapLightboxImage.alt =
        snapTitles[currentSnap];

    snapCounter.textContent =
        (currentSnap + 1) +
        " / " +
        snapPhotos.length;

    /*
     * Show the Snap title/caption
     * if the caption element exists.
     */

    const snapTitle =
        document.getElementById(
            "snapTitle"
        );

    if (snapTitle) {
        snapTitle.textContent =
            snapTitles[currentSnap];
    }

}


/* =========================
   OPEN SNAP
========================= */

function openSnap(index) {

    showSnap(index);

    snapLightbox.classList.add(
        "show"
    );

}


/* =========================
   CLOSE SNAP
========================= */

function closeSnap() {

    snapLightbox.classList.remove(
        "show"
    );

}


/* =========================
   SNAP CLICK
========================= */

snapItems.forEach(
    function (item, index) {

        item.addEventListener(
            "click",
            function () {

                openSnap(index);

            }
        );

    }
);


/* =========================
   CLOSE BUTTON
========================= */

snapClose.addEventListener(
    "click",
    closeSnap
);


/* =========================
   PREVIOUS
========================= */

snapPrev.addEventListener(
    "click",
    function () {

        currentSnap--;

        if (currentSnap < 0) {
            currentSnap =
                snapPhotos.length - 1;
        }

        showSnap(currentSnap);

    }
);


/* =========================
   NEXT
========================= */

snapNext.addEventListener(
    "click",
    function () {

        currentSnap++;

        if (
            currentSnap >=
            snapPhotos.length
        ) {
            currentSnap = 0;
        }

        showSnap(currentSnap);

    }
);


/* =========================
   CLICK OUTSIDE
========================= */

snapLightbox.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            snapLightbox
        ) {
            closeSnap();
        }

    }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !snapLightbox.classList.contains(
                "show"
            )
        ) {
            return;
        }

        if (
            event.key === "Escape"
        ) {
            closeSnap();
        }

        if (
            event.key === "ArrowLeft"
        ) {
            snapPrev.click();
        }

        if (
            event.key === "ArrowRight"
        ) {
            snapNext.click();
        }

    }
);


/* =========================
   MOBILE SWIPE
========================= */

let snapTouchStartX = 0;

snapLightbox.addEventListener(
    "touchstart",
    function (event) {

        snapTouchStartX =
            event.touches[0].clientX;

    }
);


snapLightbox.addEventListener(
    "touchend",
    function (event) {

        const snapTouchEndX =
            event.changedTouches[0]
                .clientX;

        const difference =
            snapTouchStartX -
            snapTouchEndX;

        if (
            Math.abs(difference) < 50
        ) {
            return;
        }

        if (difference > 0) {
            snapNext.click();
        } else {
            snapPrev.click();
        }

    }
);
