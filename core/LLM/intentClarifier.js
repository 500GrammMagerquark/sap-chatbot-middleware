const axios = require("axios");

async function clarifyIntent(userText) {
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

Benutze die Anfrage des Benutzers, um den richtigen Intent zu erkennen. Wenn du dir nicht sicher bist, frage den Benutzer nach mehr Informationen.

Beispiel für eine Anfrage: „Wie viele Urlaubstage habe ich noch?“
`
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
        model: "gpt-3.5-turbo", // oder "gpt-3.5-turbo" wenn du günstiger testen willst
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

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ GPT-Fehler:", error.response?.data || error.message);
    return "Ich konnte deine Anfrage leider nicht interpretieren.";
  }
}

module.exports = { clarifyIntent };
