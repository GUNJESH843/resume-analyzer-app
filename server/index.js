
const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/pay", async (req, res) => {
  // Dummy Razorpay simulation
  res.json({ success: true });
});

app.post("/api/analyze", async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const pdfBuffer = req.files.resume.data;
  const parsed = await pdfParse(pdfBuffer);

  const text = parsed.text;
  const score = Math.min(100, Math.floor(text.length / 20));

  const prompt = `Give 3 brief and practical suggestions to improve this resume for ATS systems:\n${text.slice(0, 1000)}`;
  const aiResponse = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o"
  });

  const tips = aiResponse.choices[0].message.content;
  res.json({ score, tips });
});

app.listen(5000, () => console.log("Server running on port 5000"));
