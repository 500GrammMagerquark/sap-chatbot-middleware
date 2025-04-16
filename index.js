const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Webhook-Route für Bot-Anfragen
app.post('/webhook', (req, res) => {
  const name = req.body?.from?.name || "Unbekannt";
  console.log(`📩 Anfrage von: ${name}`);

  // Dummy-Antwort zurückgeben
  res.status(200).send({
    text: `Hallo ${name}, du hast noch 12 Urlaubstage.`
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Middleware läuft auf http://localhost:${PORT}`);
});
