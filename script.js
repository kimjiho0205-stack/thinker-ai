// THINKER 시계 기능
function updateClock() {
  const now = new Date();

  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (clock) {
    clock.textContent = now.toLocaleTimeString("ko-KR");
  }

  if (date) {
    date.textContent = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  }
}

updateClock();
setInterval(updateClock, 1000);


// THINKER 음성 기능
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const message =
      event.results[0][0].transcript;

    console.log("인식된 명령:", message);

    const result =
      document.getElementById("recognizedText");

    if (result) {
      result.textContent = "인식된 명령: " + message;
    }

    speak("안녕하세요. 띵커입니다.");
  };

  recognition.onerror = function(event) {
    console.log("음성 인식 오류:", event.error);
  };
}


// THINKER 음성 출력
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}


// 마이크 버튼 연결
const voiceButton =
  document.getElementById("voiceButton");

if (voiceButton) {
  voiceButton.addEventListener("click", function() {
    if (recognition) {
      recognition.start();
    } else {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
    }
  });
}