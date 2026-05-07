const chatContainer = document.getElementById("chatContainer");
const historyList = document.getElementById("historyList");

const greeting = document.getElementById("greeting");

const hour = new Date().getHours();

if(hour < 12){
  greeting.innerText = "Good Morning";
}
else if(hour < 18){
  greeting.innerText = "Good Afternoon";
}
else{
  greeting.innerText = "Good Evening";
}

const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({
  video:true
})
.then(stream=>{
  video.srcObject = stream;
});

function addMessage(text,type){

  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(type);

  div.innerText = text;

  chatContainer.appendChild(div);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

  if(type==="user"){
    const li=document.createElement("li");
    li.innerText=text;
    historyList.appendChild(li);
  }
}

async function captureLip(){

  // Simulated lip-reading
  const detectedText =
    "hello how are you";

  addMessage(detectedText,"user");

  generateAIResponse(detectedText);
}

function sendManualMessage(){

  const input =
    document.getElementById("manualInput");

  const text = input.value;

  if(text.trim()==="") return;

  addMessage(text,"user");

  generateAIResponse(text);

  input.value="";
}

async function generateAIResponse(userText){

  try{

    // Temporary AI response
    const aiReply =
      "AI Response: " + userText;

    addMessage(aiReply,"ai");

  }
  catch(error){

    addMessage(
      "Something went wrong",
      "ai"
    );
  }
}

function newChat(){
  chatContainer.innerHTML="";
}
