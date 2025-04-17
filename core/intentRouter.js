const handlerUrlaub = require("../handlers/handlerUrlaub");

async function routeRequest({ text, sapUser, from, intent }) {
  const userId = sapUser || from?.aadObjectId || "Unbekannt";

  switch (intent) {
    case "urlaubskontingent_abfragen":
      return await handlerUrlaub.getKontingent(userId);

    case "urlaub_beantragen":
      return await handlerUrlaub.beantragen(userId, text);

    // Hier kannst du weitere Intents ergänzen, z. B.:
    // case "urlaub_stornieren":
    // case "krankmeldung_melden":
    // case "feiertage_anzeigen":

    default:
      console.log("❌ Unbekannter Intent:", intent);
      return {
        text: "Ich habe dich leider nicht verstanden 🤔"
      };
  }
}

module.exports = { routeRequest };
