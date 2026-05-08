const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

const detectedWord =
document.getElementById("detectedWord");


// START CAMERA
startCamera();


// WHEN VIDEO READY
video.addEventListener(
    "loadeddata",
    () => {

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;
    }
);


// FACEMESH RESULTS
faceMesh.onResults(onResults);


// CAMERA LOOP
const camera =
new Camera(video, {

    onFrame: async () => {

        await faceMesh.send({
            image: video
        });
    },

    width: 640,

    height: 480
});

camera.start();


// MEMORY
let currentWord = "";

let lastStableWord = "";

let stableStart =
Date.now();


// RESULTS
function onResults(results) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
    ) {

        detectedWord.innerText =
            "No Face";

        return;
    }

    const landmarks =
        results.multiFaceLandmarks[0];

    // LIP DOTS
    const lipIndexes = [

        61,146,91,181,84,17,
        314,405,321,375,291,
        308,324,318,402,317,
        14,87,178,88,95

    ];

    for (
        let i = 0;
        i < lipIndexes.length;
        i++
    ) {

        const point =
            landmarks[
                lipIndexes[i]
            ];

        const x =
            point.x *
            canvas.width;

        const y =
            point.y *
            canvas.height;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            3,
            0,
            2 * Math.PI
        );

        ctx.fillStyle =
            "#00ff00";

        ctx.fill();
    }

    // MOUTH DATA
    const upperLip =
        landmarks[13];

    const lowerLip =
        landmarks[14];

    const leftLip =
        landmarks[61];

    const rightLip =
        landmarks[291];

    const mouthHeight =
        Math.abs(
            upperLip.y -
            lowerLip.y
        );

    const mouthWidth =
        Math.abs(
            leftLip.x -
            rightLip.x
        );

    // DETECT WORD
    const detected =
        detectWord(
            mouthHeight,
            mouthWidth
        );

    detectedWord.innerText =
        detected;

    // STABILITY
    if (
        detected !== currentWord
    ) {

        currentWord =
            detected;

        stableStart =
            Date.now();
    }

    // 1 SECOND STABLE
    if (
        Date.now() -
        stableStart > 1000 &&
        detected !==
        lastStableWord
    ) {

        lastStableWord =
            detected;

        triggerAI(
            detected
        );
    }
}


// AI
function triggerAI(word) {

    addMessage(
        word,
        "user"
    );

    let aiReply = "";

    if (word === "HELLO") {

        aiReply =
            "Hello. Nice to meet you.";
    }

    else if (word === "YES") {

        aiReply =
            "Okay. You said yes.";
    }

    else {

        aiReply =
            "Understood. You said no.";
    }

    addMessage(
        aiReply,
        "ai"
    );

    speak(aiReply);
}
