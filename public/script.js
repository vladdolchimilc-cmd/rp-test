
import { questions } from "../questions.js";

const form = document.getElementById("testForm");
const submitBtn = document.getElementById("submitBtn");
const nickInput = document.getElementById("nick");
const timerEl = document.getElementById("timer");

let timeLeft = 12 * 60;
const answers = [];

const timer = setInterval(() => {
  const m = Math.floor(timeLeft / 60).toString().padStart(2,'0');
  const s = (timeLeft % 60).toString().padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
  timeLeft--;
  if(timeLeft < 0) submitBtn.click();
}, 1000);

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.className = "question";
  const p = document.createElement("p");
  p.textContent = `${i+1}. ${q.question}`;
  div.appendChild(p);

  if(q.type === "text") {
    const input = document.createElement("textarea");
    input.rows = 2;
    input.cols = 50;
    input.dataset.index = i;
    div.appendChild(input);
  } else if(q.type === "radio") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = opt;
      label.appendChild(input);
      label.append(opt);
      div.appendChild(label);
    });
  }

  form.appendChild(div);
});

submitBtn.addEventListener("click", async () => {
  const nick = nickInput.value.trim();
  if(!/^[\w]+_[\w]+$/.test(nick)) {
    alert("Ник должен быть в формате Nick_Name");
    return;
  }

  let score = 0;
  const answersList = [];

  questions.forEach((q,i) => {
    if(q.type === "text") {
      const val = form.querySelector(`textarea[data-index="${i}"]`).value.trim();
      answersList.push(val || "-");
    } else if(q.type === "radio") {
      const sel = form.querySelector(`input[name="q${i}"]:checked`);
      answersList.push(sel ? sel.value : "-");
      if(sel && sel.value === q.answer) score++;
    }
  });

  const percent = Math.round(score / questions.filter(q=>q.type==="radio").length * 100);
  const time = `00:${12*60 - timeLeft} сек`;

  await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, score, percent, time, answers: answersList })
  });

  alert(percent >= 80 ? "Тест пройден!" : "Не прошёл тест");
  submitBtn.disabled = true;
});
