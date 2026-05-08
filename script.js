const video =
document.getElementById("video");

const detectedWord =
document.getElementById("detectedWord");

const chatBox =
document.getElementById("chatBox");


// CAMERA
async function startCamera() {

    const stream =
        await navigator.mediaDevices.getUserMedia({
            video: true
        });

    video.srcObject = stream;

    await video.play();
}

startCamera();


// FACEMESH
const faceMesh =
new FaceMesh({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});

faceMesh.setOptions({

    maxNumFaces: 1,

    refineLandmarks: true,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5
});

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


// WORD MEMORY
let currentWord = "";
let lastStableWord = "";
let stableStart = Date.now();


// DETECTION
function onResults(results) {

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

    let detected = "";

    // HELLO
    if (
        mouthHeight > 0.06
    ) {

        detected = "HELLO";
    }

    // YES
    else if (
        mouthWidth > 0.15
    ) {

        detected = "YES";
    }

    // NO
    else {

        detected = "NO";
    }

    detectedWord.innerText =
        detected;

    // STABILITY CHECK
    if (
        detected !== currentWord
    ) {

        currentWord = detected;

        stableStart = Date.now();
    }

    // 1 SECOND STABLE
    if (
        Date.now() - stableStart > 1000 &&
        detected !== lastStableWord
    ) {

        lastStableWord = detected;

        triggerAI(detected);
    }
}


// AI RESPONSES
function triggerAI(word) {

    addMessage(
        word,
        "user"
    );

    let aiReply = "";

    if (word === "HELLO") {

        aiReply =
            "Hello. Nice to meet you.";

    } else if (word === "YES") {

        aiReply =
            "Okay. You said yes.";

    } else if (word === "NO") {

        aiReply =
            "Understood. You said no.";
    }

    addMessage(
        aiReply,
        "ai"
    );

    // SPEAK
    const speech =
        new SpeechSynthesisUtterance(
            aiReply
        );

    speech.lang =
        "en-US";

    speechSynthesis.speak(
        speech
    );
}


// CHAT UI
function addMessage(
    text,
    sender
) {

    const div =
        document.createElement("div");

    div.classList.add(
        "message"
    );

    div.classList.add(
        sender
    );

    div.innerHTML =
        "<b>" +
        sender.toUpperCase() +
        "</b><br>" +
        text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}
