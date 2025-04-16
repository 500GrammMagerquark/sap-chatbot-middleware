// core/handlers/handlerUrlaub.js

async function getKontingent(userId) {
    console.log("📥 Anfrage für Kontingent von", userId);
  
    // Später: SAP-OData-Aufruf
    return {
        text: `Hallo ${userId}, du hast noch 12 Urlaubstage übrig.`
      };
    }
  
  module.exports = { getKontingent };
  