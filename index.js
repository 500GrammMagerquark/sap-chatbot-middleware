const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const { routeRequest } = require("./core/intentRouter"); // 💡 Deine Middleware einbinden

const app = express();
app.use(express.json()); // Damit Express JSON korrekt verarbeitet
app.use(bodyParser.json()); // Zusätzliche Absicherung für das Parsen

// Webhook-Route für alle Anfragen
app.post("/webhook", async (req, res) => {
  try {
    const text = req.body.text || "";
    const sapUser = req.body.sapUser || null;
    const from = req.body.from || {};

    const response = await routeRequest({ text, sapUser, from }); // 💡 Intent-Logik aufrufen
    res.status(200).send(response);
  } catch (err) {
    console.error("❌ Fehler:", err);
    res.status(500).send({ text: "Fehler bei der Verarbeitung" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Middleware läuft auf http://localhost:${PORT}`);
});