const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

const detectedWord =
document.getElementById("detectedWord");


// START CAMERA
startCamera();


// VIDEO READY
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


// MEMORY VARIABLES
let currentWord = "";

let lastStableWord = "";

let stableStart =
Date.now();

//MOTION HISTORY
let motionHistory = [];

//MAX HISTORY SIZE
const maxHistory = 20;


// MAIN RESULTS FUNCTION
function onResults(results) {

    // CLEAR CANVAS
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // NO FACE
    if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
    ) {

        detectedWord.innerText =
            "No Face";

        return;
    }

    // FACE LANDMARKS
    const landmarks =
        results.multiFaceLandmarks[0];

    // LIP LANDMARKS
    const lipIndexes = [

        61,146,91,181,84,17,
        314,405,321,375,291,
        308,324,318,402,317,
        14,87,178,88,95

    ];

    // DRAW GREEN DOTS
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

    // IMPORTANT LIP POINTS
    const upperLip =
        landmarks[13];

    const lowerLip =
        landmarks[14];

    const leftLip =
        landmarks[61];

    const rightLip =
        landmarks[291];

    // CALCULATIONS
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

    // SAVE MOUTH MOVEMENT
motionHistory.push({

    height: mouthHeight,

    width: mouthWidth,

    time: Date.now()
});

// LIMIT SIZE
if (
    motionHistory.length >
    maxHistory
) {

    motionHistory.shift();
}

// DEBUG HISTORY
console.log(
    motionHistory
);

    // DETECT WORD
    const detected =
        detectWord(
            mouthHeight,
            mouthWidth
        );

    // DISPLAY WORD
    detectedWord.innerText =
        detected;

    // STABILITY CHECK
    if (
        detected !== currentWord
    ) {

        currentWord =
            detected;

        stableStart =
            Date.now();
    }

    // STABLE FOR 1 SECOND
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


// AI RESPONSE FUNCTION
function triggerAI(word) {

    addMessage(
        word,
        "user"
    );

    let aiReply = "";

    // HELLO
    if (word === "HELLO") {

        aiReply =
            "Hello. Nice to meet you.";
    }

    // YES
    else if (word === "YES") {

        aiReply =
            "Okay. You said yes.";
    }

    // NO
    else if (word === "NO") {

        aiReply =
            "Understood. You said no.";
    }

    // HELP
    else if (word === "HELP") {

        aiReply =
            "Help request detected.";
    }

    // WATER
    else if (word === "WATER") {

        aiReply =
            "Water assistance requested.";
    }

    // STOP
    else if (word === "STOP") {

        aiReply =
            "Stopping current operation.";
    }

    // THANK YOU
    else if (word === "THANK YOU") {

        aiReply =
            "You are welcome.";
    }

    // DEFAULT
    else {

        aiReply =
            "Command detected.";
    }

    // SHOW CHAT
    addMessage(
        aiReply,
        "ai"
    );

    // SPEAK RESPONSE
    speak(aiReply);
    
    sendToESP32(aiReply);
}
