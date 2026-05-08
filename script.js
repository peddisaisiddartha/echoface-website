const video =
document.getElementById("video");

const startBtn =
document.getElementById("startBtn");

const statusText =
document.getElementById("status");

const chatBox =
document.getElementById("chatBox");


// START CAMERA
async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

        video.srcObject = stream;

        await video.play();

        console.log(
            "Camera started"
        );

    }
    catch(error) {

        console.log(error);

        alert(
            "Camera access denied"
        );
    }
}

startCamera();


// BUTTON
startBtn.addEventListener(
    "click",
    startListening
);


// START SPEECH
function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Speech Recognition not supported"
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.start();

    statusText.innerText =
        "Listening...";

    recognition.onresult =
    async function(event) {

        const text =
            event.results[0][0].transcript;

        addMessage(
            text,
            "user"
        );

        statusText.innerText =
            "Thinking...";

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
                            text: text
                        })
                    }
                );

            const data =
                await response.json();

            console.log(data);

            const aiReply =
                data.response ||
                "No response";

            addMessage(
                aiReply,
                "ai"
            );

            const speech =
                new SpeechSynthesisUtterance(
                    aiReply
                );

            speech.lang =
                "en-US";

            speechSynthesis.speak(
                speech
            );

            statusText.innerText =
                "Waiting...";

        }
        catch(error) {

            console.log(error);

            addMessage(
                "API Error",
                "ai"
            );

            statusText.innerText =
                "Error";
        }
    };
}


// CHAT
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
