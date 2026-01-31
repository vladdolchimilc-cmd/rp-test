
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { questions } from "./questions.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const TOKEN = "ВАШ_TELEGRAM_TOKEN"; // вставьте свой токен
const CHAT_ID = 1182389827;

let completedNicks = new Set();

app.post("/submit", async (req, res) => {
  const { nick, score, percent, time, answers } = req.body;

  if (completedNicks.has(nick)) {
    return res.json({ ok: false, message: "Вы уже проходили тест." });
  }

  completedNicks.add(nick);

  const text = `
📝 Тест Зама МВД
👤 Ник: ${nick}
✅ Баллы: ${score}
📊 Процент: ${percent}%
⏱ Время: ${time}
✍️ Ответы:
${answers.map((a,i) => `${i+1}. ${a}`).join("\n")}
`;

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });

  res.json({ ok: true });
});

app.listen(3000, () => console.log("Server started on port 3000"));
