// handlerUrlaub.js

async function getKontingent(userId) {
  console.log("📊 Abfrage Urlaubskontingent für:", userId);
  return {
    text: `Hallo ${userId}, du hast noch 12 Urlaubstage übrig.`
  };
}

async function beantragen(userId, originalText) {
  console.log("📝 Urlaubsantrag von:", userId);
  console.log("📨 Ursprüngliche Anfrage:", originalText);

  // Du könntest hier später ein SAP-OData-Call einbauen
  return {
    text: `Alles klar, ${userId}. Ich habe deinen Urlaubsantrag vorgemerkt: "${originalText}".`
  };
}

module.exports = {
  getKontingent,
  beantragen
};
