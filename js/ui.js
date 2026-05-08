function addMessage(text, sender) {

    const chatBox =
    document.getElementById("chatBox");

    const div =
    document.createElement("div");

    div.classList.add("message");

    div.classList.add(sender);

    div.innerHTML =
    "<b>" +
    sender.toUpperCase() +
    "</b><br>" +
    text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
    chatBox.scrollHeight;
}
