// core/intentRouter.js

const handlerUrlaub = require("./handlers/handlerUrlaub");

async function routeRequest(req) {
  const message = req.text?.toLowerCase() || "";
  const userId = req.sapUser || req.from?.aadObjectId || "unknown";

  if (message.includes("urlaub") && message.includes("wieviel")) {
    return await handlerUrlaub.getKontingent(userId);
  }

  return {
    text: "Ich habe dich leider nicht verstanden 🤔"
  };
}

module.exports = { routeRequest };
