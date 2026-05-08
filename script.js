const startBtn =
document.getElementById("startBtn");

const chatBox =
document.getElementById("chatBox");


// START BUTTON
startBtn.addEventListener(
    "click",
    startListening
);


// MAIN FUNCTION
async function startListening() {

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

    startBtn.innerText =
        "Listening...";

    recognition.onresult =
    async function(event) {

        const text =
            event.results[0][0].transcript;

        addMessage(
            text,
            "user"
        );

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

            addMessage(
                data.response,
                "ai"
            );

            const speech =
                new SpeechSynthesisUtterance(
                    data.response
                );

            speech.lang =
                "en-US";

            speechSynthesis.speak(
                speech
            );

        }
        catch(error) {

            console.log(error);

            addMessage(
                "API Error",
                "ai"
            );
        }

        startBtn.innerText =
            "Start Talking";
    };
}


// ADD MESSAGE
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
        `<b>${sender.toUpperCase()}</b><br>${text}`;

    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}
