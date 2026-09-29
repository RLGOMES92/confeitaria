export default function handler(req, res) {
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

    return res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Server Error");
  }
}
