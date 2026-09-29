const WHATSAPP_API_VERSION = "v20.0";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const mode = req?.query?.["hub.mode"];
      const token = req?.query?.["hub.verify_token"];
      const challenge = req?.query?.["hub.challenge"];

      if (
        mode === "subscribe" &&
        token === "dapaz_webhook_2026_9f7k2m"
      ) {
        res.setHeader("Content-Type", "text/plain");
        return res.status(200).send(String(challenge ?? ""));
      }

      return res.status(403).send("Forbidden");
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

      const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message?.from) {
        const from = message.from;
        const receivedText = message.text?.body || "";

        const phoneNumberId = process.env.PHONE_NUMBER_ID;
        const whatsappToken = process.env.WHATSAPP_TOKEN;

        if (!phoneNumberId || !whatsappToken) {
          console.error("PHONE_NUMBER_ID ou WHATSAPP_TOKEN não configurado.");
          return res.status(200).send("EVENT_RECEIVED");
        }

        const response = await fetch(
          `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {
                body: `Olá! Recebi sua mensagem: "${receivedText}". Como posso ajudar na DaPaz Confeitaria?`
              }
            })
          }
        );

        const result = await response.text();

        if (!response.ok) {
          console.error("Erro da API do WhatsApp:", response.status, result);
        } else {
          console.log("Resposta enviada ao WhatsApp:", result);
        }
      }

      return res.status(200).send("EVENT_RECEIVED");
    }

    return res.status(405).send("Method Not Allowed");
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(200).send("EVENT_RECEIVED");
  }
}
