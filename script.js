const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");

startBtn.addEventListener("click", startListening);

async function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = async (event) => {

        const text = event.results[0][0].transcript;

        addMessage("USER", text);

        const response = await fetch(
            "YOUR_CLOUDFLARE_WORKER_URL",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text
                })
            }
        );

        const data = await response.json();

        addMessage("AI", data.response);

        const speech =
            new SpeechSynthesisUtterance(
                data.response
            );

        speechSynthesis.speak(speech);
    };
}

function addMessage(sender, text) {

    const div = document.createElement("div");

    div.innerHTML =
        `<b>${sender}:</b> ${text}`;

    chatBox.appendChild(div);
}
