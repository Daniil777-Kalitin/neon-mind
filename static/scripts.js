console.log("REAL SCRIPT LOADED");

async function send() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chat");

  const text = input.value;
  if (!text) return;

  chat.innerHTML += `<div class="user">Ты: ${text}</div>`;
  input.value = "";

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    chat.innerHTML += `<div class="bot">Neon Mind: ${data.answer}</div>`;
    speak(data.answer);
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    chat.innerHTML += `<div class="bot">Ошибка соединения</div>`;
  }
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "ru-RU";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

function startVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Голосовой ввод не поддерживается");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("msg").value = text;
    send();
  };

  recognition.onerror = function (event) {
    alert("Ошибка микрофона: " + event.error);
  };
}
