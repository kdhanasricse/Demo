/* =========================
   BASIC ELEMENTS
========================= */

const intro =
    document.getElementById("intro");

const cakeSection =
    document.getElementById("cakeSection");

const birthdaySection =
    document.getElementById("birthdaySection");

const storySection =
    document.getElementById("storySection");

const wishButton =
    document.getElementById("wishButton");

const blowButton =
    document.getElementById("blowButton");

const storyButton =
    document.getElementById("storyButton");

const micStatus =
    document.getElementById("micStatus");

const birthdayTune =
    document.getElementById("birthdayTune");

const storyTune =
    document.getElementById("storyTune");


birthdayTune.volume = 0.35;


/* =========================
   WISH BUTTON
========================= */

wishButton.addEventListener(
    "click",
    function () {

        intro.classList.add("hidden");

        cakeSection.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================
   CAKE + MICROPHONE
========================= */

let audioContext = null;

let analyser = null;

let microphone = null;

let microphoneStream = null;

let blowing = false;

let candleIndex = 0;

const BLOW_THRESHOLD = 0.040;

const COOLDOWN = 1200;

let lastBlowTime = 0;

const candles =
    document.querySelectorAll(".candle");


blowButton.addEventListener(
    "click",
    async function () {

        if (blowing) {
            return;
        }

        try {

            microphoneStream =
                await navigator.mediaDevices
                    .getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                            channelCount: 1
                        }
                    });


            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();


            analyser =
                audioContext.createAnalyser();

            analyser.fftSize = 1024;

            analyser.smoothingTimeConstant =
                0.05;


            microphone =
                audioContext
                    .createMediaStreamSource(
                        microphoneStream
                    );


            microphone.connect(analyser);


            blowing = true;

            blowButton.textContent =
                "🎙 Blow on the candles";


            micStatus.textContent =
                "Blow gently into your microphone...";


            birthdayTune.currentTime = 0;

            birthdayTune
                .play()
                .catch(function () {});


            detectBlow();

        } catch (error) {

            console.error(error);

            micStatus.textContent =
                "Microphone permission is needed to blow the candles.";

        }

    }
);


/* =========================
   DETECT BLOW
========================= */

function detectBlow() {

    if (
        !blowing ||
        !analyser
    ) {
        return;
    }


    const data =
        new Uint8Array(
            analyser.fftSize
        );


    analyser.getByteTimeDomainData(data);


    let sum = 0;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        const value =
            (data[i] - 128) / 128;

        sum += value * value;

    }


    const rms =
        Math.sqrt(
            sum / data.length
        );


    const now =
        Date.now();


    if (
        rms > BLOW_THRESHOLD &&
        now - lastBlowTime > COOLDOWN
    ) {

        lastBlowTime = now;

        extinguishNextCandle();

    }


    requestAnimationFrame(
        detectBlow
    );

}


/* =========================
   EXTINGUISH CANDLE
========================= */

function extinguishNextCandle() {

    if (
        candleIndex >=
        candles.length
    ) {
        return;
    }


    candles[candleIndex]
        .classList.add("blown");


    candleIndex++;


    if (
        candleIndex ===
        candles.length
    ) {

        setTimeout(
            finishCake,
            1200
        );

    }

}


/* =========================
   FINISH CAKE
========================= */

function finishCake() {

    blowing = false;


    if (microphoneStream) {

        microphoneStream
            .getTracks()
            .forEach(
                function (track) {
                    track.stop();
                }
            );

    }


    if (audioContext) {

        audioContext.close();

        audioContext = null;

    }


    birthdayTune.pause();

    birthdayTune.currentTime = 0;


    blowButton.classList.add(
        "hidden"
    );


    micStatus.textContent =
        "Wish made. ✨";


    setTimeout(
        function () {

            cakeSection.classList.add(
                "hidden"
            );

            birthdaySection.classList.remove(
                "hidden"
            );

            birthdaySection.scrollIntoView({
                behavior: "smooth"
            });

        },
        800
    );

}


/* =========================
   BIRTHDAY → STORY
========================= */

storyButton.addEventListener(
    "click",
    function () {

        birthdaySection.classList.add(
            "hidden"
        );

        storySection.classList.remove(
            "hidden"
        );

        storySection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   STORY ELEMENTS
========================= */

const closedBook =
    document.getElementById(
        "closedBook"
    );

const openBook =
    document.getElementById(
        "openBook"
    );

const openBookButton =
    document.getElementById(
        "openBookButton"
    );

const storyAssistant =
    document.getElementById(
        "storyAssistant"
    );

const storySpeech =
    document.getElementById(
        "storySpeech"
    );

const storyPageImage =
    document.getElementById(
        "storyPageImage"
    );

const pageNumber =
    document.getElementById(
        "pageNumber"
    );

const storyQuestion =
    document.getElementById(
        "storyQuestion"
    );

const questionText =
    document.getElementById(
        "questionText"
    );

const answerOptions =
    document.getElementById(
        "answerOptions"
    );

const answerFeedback =
    document.getElementById(
        "answerFeedback"
    );

const storyClosing =
    document.getElementById(
        "storyClosing"
    );


/* =========================
   STORY DATA
========================= */

const storyPages = [
    "sheet1.png",
    "sheet2.png",
    "sheet3.png",
    "sheet4.png"
];


const storyQuestions = [

    {
        question:
            "Which standard did we first meet?",

        options: [
            "8th standard",
            "9th standard",
            "10th standard",
            "11th standard"
        ],

        correct:
            "9th standard"
    },

    {
        question:
            "After school, where did we meet for the first time?",

        options: [
            "At the beach",
            "At the bus stand",
            "At college",
            "At a park"
        ],

        correct:
            "At the bus stand"
    },

    {
        question:
            "Where did I move for college?",

        options: [
            "Coimbatore",
            "Madurai",
            "Chennai",
            "Bangalore"
        ],

        correct:
            "Chennai"
    }

];


let pageIndex = 0;


/* =========================
   OPEN STORY
========================= */

closedBook.addEventListener(
    "click",
    openStoryBook
);


openBookButton.addEventListener(
    "click",
    openStoryBook
);


function openStoryBook() {

    closedBook.classList.add(
        "hidden"
    );

    openBookButton.classList.add(
        "hidden"
    );

    openBook.classList.remove(
        "hidden"
    );


    storyTune.volume = 0.30;

    storyTune.currentTime = 0;

    storyTune
        .play()
        .catch(function () {});


    showStoryPage(0);

}


/* =========================
   SHOW STORY PAGE
========================= */

function showStoryPage(index) {

    pageIndex = index;


    storyPageImage.src =
        storyPages[index];


    pageNumber.textContent =
        String(index + 1)
            .padStart(2, "0");


    storyQuestion.classList.add(
        "hidden"
    );


    storyClosing.classList.add(
        "hidden"
    );


    if (index < 3) {

        storySpeech.textContent =
            "Before turning the page... answer this one.";


        setTimeout(
            function () {

                showStoryQuestion(index);

            },
            500
        );

    } else {

        storySpeech.textContent =
            "And this is where the story keeps going...";


        storyClosing.classList.remove(
            "hidden"
        );

    }

}


/* =========================
   SHOW STORY QUESTION
========================= */

function showStoryQuestion(index) {

    const question =
        storyQuestions[index];


    questionText.textContent =
        question.question;


    answerOptions.innerHTML = "";

    answerFeedback.textContent = "";


    question.options.forEach(
        function (option) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    checkAnswer(
                        option,
                        question.correct
                    );

                }
            );


            answerOptions.appendChild(
                button
            );

        }
    );


    storyQuestion.classList.remove(
        "hidden"
    );

}


/* =========================
   CHECK STORY ANSWER
========================= */

function checkAnswer(
    selected,
    correct
) {

    if (
        selected === correct
    ) {

        answerFeedback.textContent =
            "Correct! ✓";


        answerFeedback.style.color =
            "#6f9d73";


        setTimeout(
            function () {

                storyQuestion.classList.add(
                    "hidden"
                );

                turnToNextPage();

            },
            700
        );

    } else {

        answerFeedback.textContent =
            "Not quite 😄 The correct answer is: " +
            correct;


        answerFeedback.style.color =
            "#b87565";

    }

}


/* =========================
   NEXT STORY PAGE
========================= */

function turnToNextPage() {

    const nextIndex =
        pageIndex + 1;


    if (
        nextIndex <
        storyPages.length
    ) {

        showStoryPage(
            nextIndex
        );

    }

}


/* =========================
   CLOSE STORY
========================= */

storyClosing.addEventListener(
    "click",
    closeStoryBook
);


function closeStoryBook() {

    storyTune.pause();

    storyTune.currentTime = 0;


    storySection.classList.add(
        "hidden"
    );


    photosSection.classList.remove(
        "hidden"
    );


    photosSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   MEMORY PHOTOS
========================= */

const photosSection =
    document.getElementById(
        "photosSection"
    );


const photosNextButton =
    document.getElementById(
        "photosNextButton"
    );


const memoryPhotos = [

    "pic1.jpg",
    "pic2.jpg",
    "pic3.jpg",
    "pic4.jpg",
    "pic5.jpg",
    "pic6.jpg",
    "pic7.jpg",
    "pic8.jpg",
    "pic9.jpg"

];


const memoryCaptions = [

    "Where it began",

    "Growing up",

    "Those days",

    "A little older",

    "More memories",

    "Do u remember this pic??😂",

    "Almost there",

    "Then to now",

    "And here you are😉"

];


const memoryPhoto =
    document.getElementById(
        "memoryPhoto"
    );


const memoryCaption =
    document.getElementById(
        "memoryCaption"
    );


const memoryCurrent =
    document.getElementById(
        "memoryCurrent"
    );


const memoryPrev =
    document.getElementById(
        "memoryPrev"
    );


const memoryNext =
    document.getElementById(
        "memoryNext"
    );


const memoryDots =
    document.getElementById(
        "memoryDots"
    );


const memoryFrame =
    document.getElementById(
        "memoryFrame"
    );


let currentMemory = 0;


/* =========================
   MEMORY DOTS
========================= */

memoryPhotos.forEach(
    function (_, index) {

        const dot =
            document.createElement(
                "span"
            );


        dot.className =
            "memory-dot";


        dot.addEventListener(
            "click",
            function () {

                showMemory(index);

            }
        );


        memoryDots.appendChild(
            dot
        );

    }
);


/* =========================
   SHOW MEMORY
========================= */

function showMemory(index) {

    if (index < 0) {

        index =
            memoryPhotos.length - 1;

    }


    if (
        index >=
        memoryPhotos.length
    ) {

        index = 0;

    }


    currentMemory = index;


    memoryPhoto.style.opacity =
        "0";


    memoryPhoto.style.transform =
        "translateY(8px)";


    setTimeout(
        function () {

            memoryPhoto.src =
                memoryPhotos[
                    currentMemory
                ];


            memoryPhoto.alt =
                "Memory " +
                (currentMemory + 1);


            memoryCaption.textContent =
                memoryCaptions[
                    currentMemory
                ];


            memoryCurrent.textContent =
                String(
                    currentMemory + 1
                ).padStart(2, "0") +
                " / " +
                String(
                    memoryPhotos.length
                ).padStart(2, "0");


            updateMemoryDots();


            memoryPhoto.style.opacity =
                "1";


            memoryPhoto.style.transform =
                "translateY(0)";

        },
        180
    );

}


/* =========================
   MEMORY DOTS
========================= */

function updateMemoryDots() {

    const dots =
        document.querySelectorAll(
            ".memory-dot"
        );


    dots.forEach(
        function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentMemory
            );

        }
    );

}


/* =========================
   MEMORY ARROWS
========================= */

memoryPrev.addEventListener(
    "click",
    function () {

        showMemory(
            currentMemory - 1
        );

    }
);


memoryNext.addEventListener(
    "click",
    function () {

        showMemory(
            currentMemory + 1
        );

    }
);


/* =========================
   MEMORY KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !photosSection.classList.contains(
                "hidden"
            )
        ) {

            if (
                event.key === "ArrowLeft"
            ) {

                showMemory(
                    currentMemory - 1
                );

            }


            if (
                event.key === "ArrowRight"
            ) {

                showMemory(
                    currentMemory + 1
                );

            }

        }

    }
);


/* =========================
   MEMORY MOBILE SWIPE
========================= */

let touchStartX = 0;

let touchEndX = 0;


memoryFrame.addEventListener(
    "touchstart",
    function (event) {

        touchStartX =
            event.changedTouches[0]
                .screenX;

    },
    {
        passive: true
    }
);


memoryFrame.addEventListener(
    "touchend",
    function (event) {

        touchEndX =
            event.changedTouches[0]
                .screenX;


        const difference =
            touchStartX -
            touchEndX;


        if (
            Math.abs(difference) < 50
        ) {
            return;
        }


        if (difference > 0) {

            showMemory(
                currentMemory + 1
            );

        } else {

            showMemory(
                currentMemory - 1
            );

        }

    },
    {
        passive: true
    }
);


/* =========================
   INITIAL MEMORY
========================= */

showMemory(0);


/* =========================
   BEFORE SNAP QUESTIONS
========================= */

const snapQuestions =
    document.getElementById(
        "snapQuestions"
    );


const snapQuestionTitle =
    document.getElementById(
        "snapQuestionTitle"
    );


const snapQuestionOptions =
    document.getElementById(
        "snapQuestionOptions"
    );


const snapQuestionFeedback =
    document.getElementById(
        "snapQuestionFeedback"
    );


let currentSnapQuestion = 0;


const beforeSnapQuestions = [

    {
        question:
            "Do we have pictures together?",

        noAnswer:
            "Yes, we do 😂"
    },

    {
        question:
            "Did we have coffee together?",

        noAnswer:
            "Yes, we did 😂"
    }

];


/* =========================
   SHOW SNAP QUESTIONS
========================= */

function showSnapQuestions() {

    currentSnapQuestion = 0;

    snapQuestionTitle.textContent =
        beforeSnapQuestions[
            currentSnapQuestion
        ].question;


    snapQuestionFeedback.textContent =
        "";


    snapQuestions.classList.add(
        "show-questions"
    );


    snapQuestions.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   SNAP QUESTION ANSWER
========================= */

const snapAnswerButtons =
    document.querySelectorAll(
        ".snap-answer-button"
    );


snapAnswerButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const answer =
                    button.dataset.answer;


                handleSnapAnswer(
                    answer
                );

            }
        );

    }
);


/* =========================
   HANDLE SNAP ANSWER
========================= */

function handleSnapAnswer(answer) {

    const currentQuestion =
        beforeSnapQuestions[
            currentSnapQuestion
        ];


    if (answer === "no") {

        snapQuestionFeedback.textContent =
            currentQuestion.noAnswer;

    } else {

        snapQuestionFeedback.textContent =
            "Exactly! 😌";

    }


    setTimeout(
        function () {

            currentSnapQuestion++;


            if (
                currentSnapQuestion <
                beforeSnapQuestions.length
            ) {

                showNextSnapQuestion();

            } else {

                showOurSnaps();

            }

        },
        1000
    );

}


/* =========================
   NEXT SNAP QUESTION
========================= */

function showNextSnapQuestion() {

    snapQuestionTitle.textContent =
        beforeSnapQuestions[
            currentSnapQuestion
        ].question;


    snapQuestionFeedback.textContent =
        "";

}


/* =========================
   SHOW OUR SNAPS
========================= */

function showOurSnaps() {

    const nextSection =
        document.getElementById(
            "nextSection"
        );


    snapQuestions.classList.remove(
        "show-questions"
    );


    nextSection.classList.add(
        "show-snaps"
    );


    setTimeout(
        function () {

            nextSection.scrollIntoView({
                behavior: "smooth"
            });

        },
        4000
    );

}


/* =========================
   KEEP GOING
========================= */

photosNextButton.addEventListener(
    "click",
    function () {

        showSnapQuestions();

    }
);


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


let currentSnap = 0;


/* =========================
   SHOW SNAP
========================= */

function showSnap(index) {

    if (index < 0) {

        index =
            snapPhotos.length - 1;

    }


    if (
        index >=
        snapPhotos.length
    ) {

        index = 0;

    }


    currentSnap = index;


    snapLightboxImage.src =
        snapPhotos[
            currentSnap
        ];


    snapLightboxImage.alt =
        "Snap " +
        (currentSnap + 1);


    snapCounter.textContent =
        String(
            currentSnap + 1
        ).padStart(2, "0") +
        " / " +
        String(
            snapPhotos.length
        ).padStart(2, "0");

}


/* =========================
   OPEN SNAP
========================= */

function openSnap(index) {

    showSnap(index);


    snapLightbox.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "snap-open"
    );

}


/* =========================
   CLOSE SNAP
========================= */

function closeSnap() {

    snapLightbox.classList.add(
        "hidden"
    );


    document.body.classList.remove(
        "snap-open"
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
   SNAP BUTTONS
========================= */

snapClose.addEventListener(
    "click",
    closeSnap
);


snapPrev.addEventListener(
    "click",
    function () {

        showSnap(
            currentSnap - 1
        );

    }
);


snapNext.addEventListener(
    "click",
    function () {

        showSnap(
            currentSnap + 1
        );

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
   SNAP KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            snapLightbox.classList.contains(
                "hidden"
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

            showSnap(
                currentSnap - 1
            );

        }


        if (
            event.key === "ArrowRight"
        ) {

            showSnap(
                currentSnap + 1
            );

        }

    }
);


/* =========================
   SNAP MOBILE SWIPE
========================= */

let snapTouchStartX = 0;

let snapTouchEndX = 0;


snapLightboxImage.addEventListener(
    "touchstart",
    function (event) {

        snapTouchStartX =
            event.changedTouches[0]
                .screenX;

    },
    {
        passive: true
    }
);


snapLightboxImage.addEventListener(
    "touchend",
    function (event) {

        snapTouchEndX =
            event.changedTouches[0]
                .screenX;


        const difference =
            snapTouchStartX -
            snapTouchEndX;


        if (
            Math.abs(difference) < 50
        ) {
            return;
        }


        if (difference > 0) {

            showSnap(
                currentSnap + 1
            );

        } else {

            showSnap(
                currentSnap - 1
            );

        }

    },
    {
        passive: true
    }
);


/* =========================
   A GIFT FOR YOU
========================= */

const giftSection =
    document.getElementById(
        "giftSection"
    );


const envelope =
    document.getElementById(
        "envelope"
    );


const letterOverlay =
    document.getElementById(
        "letterOverlay"
    );


const letterClose =
    document.getElementById(
        "letterClose"
    );


/* =========================
   SHOW GIFT SECTION
========================= */

function showGiftSection() {

    giftSection.classList.remove(
        "hidden"
    );


    giftSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   OPEN LETTER
========================= */

envelope.addEventListener(
    "click",
    function () {

        letterOverlay.classList.remove(
            "hidden"
        );


        document.body.classList.add(
            "letter-open"
        );

    }
);


/* =========================
   CLOSE LETTER
========================= */

letterClose.addEventListener(
    "click",
    function () {

        letterOverlay.classList.add(
            "hidden"
        );


        document.body.classList.remove(
            "letter-open"
        );

    }
);


/* =========================
   CLICK OUTSIDE LETTER
========================= */

letterOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            letterOverlay
        ) {

            letterOverlay.classList.add(
                "hidden"
            );


            document.body.classList.remove(
                "letter-open"
            );

        }

    }
);


/* =========================
   ESCAPE TO CLOSE LETTER
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !letterOverlay.classList.contains(
                "hidden"
            )
        ) {

            letterOverlay.classList.add(
                "hidden"
            );


            document.body.classList.remove(
                "letter-open"
            );

        }

    }
);


/* =========================
   SHOW GIFT AFTER SNAPS
========================= */

snapLightbox.addEventListener(
    "click",
    function (event) {

        /*
         * The gift section should appear
         * after the user finishes with the
         * snaps.
         */

        if (
            event.target ===
            snapLightbox
        ) {

            return;

        }

    }
);


/*
 * Add the gift section after the
 * "Our Snaps" section naturally.
 *
 * When the user reaches the bottom
 * of the snaps section, the gift
 * section becomes visible.
 */

const giftObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        showGiftSection();

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


giftObserver.observe(
    document.getElementById(
        "nextSection"
    )
);
