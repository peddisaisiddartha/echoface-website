let port;

let writer;


// CONNECT ESP32
async function connectESP32() {

    try {

        port =
        await navigator.serial.requestPort();

        await port.open({
            baudRate: 115200
        });

        writer =
        port.writable.getWriter();

        console.log(
            "ESP32 Connected"
        );

        alert(
            "ESP32 Connected"
        );

    } catch (error) {

        console.log(error);

        alert(
            "Connection Failed"
        );
    }
}


// SEND TEXT
async function sendToESP32(text) {

    if (!writer) return;

    const data =
    new TextEncoder().encode(
        text + "\n"
    );

    await writer.write(data);

    console.log(
        "Sent:",
        text
    );
}
