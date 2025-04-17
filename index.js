const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { routeRequest } = require("./core/intentRouter");
const { clarifyIntent } = require("./core/LLM/intentClarifier");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  try {
    const text = req.body.text || "";
    const sapUser = req.body.sapUser || null;
    const from = req.body.from || {};

    const intentInfo = await clarifyIntent(text, sapUser, from);

    if (intentInfo.pendingConfirmation) {
      return res.status(200).send({ text: intentInfo.message });
    }

    const response = await routeRequest({
      text,
      sapUser,
      from,
      intent: intentInfo.intent
    });

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
