const video =
document.getElementById("video");

const detectedWord =
document.getElementById("detectedWord");


// START CAMERA
async function startCamera() {

    const stream =
        await navigator.mediaDevices.getUserMedia({
            video: true
        });

    video.srcObject = stream;

    await video.play();
}

startCamera();


// MEDIAPIPE FACEMESH
const faceMesh =
new FaceMesh({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});


// SETTINGS
faceMesh.setOptions({

    maxNumFaces: 1,

    refineLandmarks: true,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5
});


// RESULTS
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


// LIP DETECTION
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

    // LIPS
    const upperLip =
        landmarks[13];

    const lowerLip =
        landmarks[14];

    const leftLip =
        landmarks[61];

    const rightLip =
        landmarks[291];

    // CALCULATE
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

    console.log(
        mouthHeight,
        mouthWidth
    );

    // SIMPLE WORD LOGIC

    // HELLO
    if (
        mouthHeight > 0.06
    ) {

        detectedWord.innerText =
            "HELLO";
    }

    // YES
    else if (
        mouthWidth > 0.15
    ) {

        detectedWord.innerText =
            "YES";
    }

    // NO
    else {

        detectedWord.innerText =
            "NO";
    }
}
