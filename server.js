
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://kimjiho0205-stack.github.io"
}));

app.use(express.json({ limit: "10kb" }));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// 간단한 요청 제한
const requestCounts = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const ip = req.ip;
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (record && now - record.start < 60000 && record.count >= 5) {
      return res.status(429).json({
        error: "잠시 후 다시 시도해 주세요."
      });
    }

    if (!record || now - record.start >= 60000) {
      requestCounts.set(ip, { start: now, count: 1 });
    } else {
      record.count++;
    }

    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "메시지를 입력해 주세요."
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: "메시지는 1000자 이하로 입력해 주세요."
      });
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n");

    console.log("THINKER 사용량:", response.usage);

    res.json({ reply });

  } catch (error) {
    console.error("THINKER API 오류:", error.message);

    res.status(500).json({
      error: "AI 응답을 생성하지 못했습니다."
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "THINKER server online" });
});

app.listen(PORT, () => {
  console.log(`THINKER SERVER running on port ${PORT}`);
});
