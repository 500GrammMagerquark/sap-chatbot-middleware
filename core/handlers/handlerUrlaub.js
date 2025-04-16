// handlerUrlaub.js

async function getKontingent(userId) {
    console.log("Abfrage für Urlaubskontingent von:", userId);
  
    // Beispiel: Rückgabe von Dummy-Daten, falls keine echte SAP-Integration vorhanden ist
    return {
      text: `Hallo ${userId}, du hast noch 12 Urlaubstage übrig.`
    };
  }
  
  module.exports = { getKontingent };
  