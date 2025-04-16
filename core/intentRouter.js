const handlerUrlaub = require("./handlers/handlerUrlaub");
const { clarifyIntent } = require("./LLM/intentClarifier");  // Importiere clarifyIntent

let contextStore = {}; // Temporäre Speicherung des Kontexts

async function routeRequest(req) {
  const message = req.text?.toLowerCase() || "";
  const userId = req.sapUser || req.from?.aadObjectId || "Unbekannt";
  let gptAntwort = await clarifyIntent(req.text);

  console.log("💬 GPT Vorschlag:", gptAntwort);

  // Wenn GPT den Intent 'Urlaubskontingent abfragen' erkennt
  if (gptAntwort.includes("urlaubskontingent") && gptAntwort.includes("abfragen")) {
    contextStore[userId] = {
      intent: "urlaubskontingent_abfragen",
      originalMessage: req.text
    };

    // Rückfrage stellen, ob der Intent korrekt ist
    return {
      text: `GPT Vorschlag: Der Intent dieser Anfrage ist "Urlaubskontingent abfragen". Bitte antworte mit 'Ja' oder 'Nein', ob das korrekt ist.`
    };
  }

  // Wenn der Benutzer mit 'Ja' antwortet, den gespeicherten Kontext verwenden
  if (message.includes("ja") && contextStore[userId]?.intent === "urlaubskontingent_abfragen") {
    console.log("Benutzer hat 'Ja' geantwortet.");
    // Urlaubskontingent abfragen
    return await handlerUrlaub.getKontingent(userId);
  }

  // Wenn der Benutzer mit 'Nein' antwortet, fragt der Bot nach der richtigen Anfrage
  if (message.includes("nein")) {
    console.log("Benutzer hat 'Nein' geantwortet.");
    return {
      text: "Es tut mir leid. Bitte teile mir mit, was du genau wissen möchtest."
    };
  }

  // Standardantwort, falls der Bot die Eingabe nicht versteht
  console.log("Chat checkt nicht");
  return {
    text: "Ich habe dich leider nicht verstanden 🤔"
  };
}

module.exports = { routeRequest };
