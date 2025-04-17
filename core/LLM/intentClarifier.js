const axios = require("axios");

let contextStore = {};

async function clarifyIntent(userText, sapUser, from) {
  const userId = sapUser || from?.aadObjectId || "Unbekannt";
  const lowerText = userText.toLowerCase();

  // Kontextprüfung für JA
  if (lowerText.includes("ja") && contextStore[userId]) {
    const confirmedIntent = contextStore[userId];
    delete contextStore[userId];
    return { intent: confirmedIntent, pendingConfirmation: false };
  }

  // Kontextprüfung für NEIN
  if (lowerText.includes("nein")) {
    delete contextStore[userId];
    return {
      pendingConfirmation: true,
      message: "Alles klar. Bitte formuliere deine Anfrage nochmal etwas genauer."
    };
  }

  // GPT befragen
  const prompt = [
    {
      role: "system",
      content: `Du bist ein intelligenter SAP HCM Chatbot. Deine Aufgabe ist es, Benutzereingaben zu verstehen und korrekt einem der folgenden Intents zuzuordnen:

1. Urlaubskontingent abfragen
2. Urlaub beantragen
3. Urlaub stornieren
4. Krankenstand melden
5. Resturlaub anzeigen
6. Feiertage anzeigen
7. Bereits beantragte Urlaube anzeigen
8. Arbeitszeitkonto anzeigen

Wenn du dir nicht sicher bist, frage den Benutzer nach mehr Informationen.`
    },
    {
      role: "user",
      content: userText
    }
  ];

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: prompt,
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const gptResponse = res.data.choices[0].message.content.toLowerCase();

    // Einfache Intent-Erkennung per Keywords
    const intentMapping = [
      { keyword: "urlaubskontingent", intent: "urlaubskontingent_abfragen" },
      { keyword: "urlaub beantragen", intent: "urlaub_beantragen" },
      { keyword: "urlaub stornieren", intent: "urlaub_stornieren" },
      { keyword: "krankenstand", intent: "krankmeldung_melden" },
      { keyword: "resturlaub", intent: "resturlaub_anzeigen" },
      { keyword: "feiertage", intent: "feiertage_anzeigen" },
      { keyword: "beantragte urlaube", intent: "urlaubsliste_anzeigen" },
      { keyword: "arbeitszeitkonto", intent: "arbeitszeitkonto_anzeigen" }
    ];

    const found = intentMapping.find((entry) =>
      gptResponse.includes(entry.keyword)
    );

    if (found) {
      // Intent erkannt, aber Rückfrage erwünscht
      contextStore[userId] = found.intent;
      return {
        pendingConfirmation: true,
        message: `Meinst du: "${found.intent.replace(/_/g, " ")}"? Bitte antworte mit 'Ja' oder 'Nein'.`
      };
    }

    // Kein Treffer
    return {
      pendingConfirmation: true,
      message: "Ich bin mir nicht sicher. Kannst du deine Anfrage bitte nochmal genauer formulieren?"
    };
  } catch (error) {
    console.error("❌ GPT-Fehler:", error.response?.data || error.message);
    return {
      pendingConfirmation: true,
      message: "Es gab ein Problem bei der Verarbeitung deiner Anfrage."
    };
  }
}

module.exports = { clarifyIntent };
