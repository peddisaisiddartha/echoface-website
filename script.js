const video =
document.getElementById("video");

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

const statusText =
document.getElementById("status");

const chatBox =
document.getElementById("chatBox");


// START CAMERA
navigator.mediaDevices.getUserMedia({
    video: true
})
.then((stream) => {

    video.srcObject = stream;

})
.catch((err) => {

    alert(
        "Camera access denied"
    );

});


// MEDIAPIPE
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


// RESULTS
faceMesh.onResults(onResults);


// CAMERA PROCESSING
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


// RESULTS FUNCTION
function onResults(results) {

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (
        results.multiFaceLandmarks
    ) {

        for (
            const landmarks
            of results.multiFaceLandmarks
        ) {

            // LIPS
            const upperLip =
                landmarks[13];

            const lowerLip =
                landmarks[14];

            const mouthOpen =
                Math.abs(
                    upperLip.y -
                    lowerLip.y
                );

            // DRAW
            ctx.fillStyle =
                "cyan";

            ctx.beginPath();

            ctx.arc(
                upperLip.x *
                canvas.width,

                upperLip.y *
                canvas.height,

                5,
                0,
                2 * Math.PI
            );

            ctx.fill();

            ctx.beginPath();

            ctx.arc(
                lowerLip.x *
                canvas.width,

                lowerLip.y *
                canvas.height,

                5,
                0,
                2 * Math.PI
            );

            ctx.fill();

            // DETECTION
            if (
                mouthOpen > 0.02
            ) {

                statusText.innerText =
                    "Lip Movement Detected";

                respondAI();

            }
            else {

                statusText.innerText =
                    "Waiting...";
            }
        }
    }
}


let cooldown = false;


// AI RESPONSE
async function respondAI() {

    if (cooldown) return;

    cooldown = true;

    try {

        const response =
            await fetch(
                "https://silent-api.liveatlasco.workers.dev",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text:
                        "User is trying to communicate silently"
                    })
                }
            );

        const data =
            await response.json();

        addMessage(
            data.response
        );

        const speech =
            new SpeechSynthesisUtterance(
                data.response
            );

        speechSynthesis.speak(
            speech
        );

    }
    catch {

        addMessage(
            "API Error"
        );
    }

    setTimeout(() => {

        cooldown = false;

    }, 5000);
}


// CHAT
function addMessage(text) {

    chatBox.innerHTML +=
        "<p>" +
        text +
        "</p>";
}
