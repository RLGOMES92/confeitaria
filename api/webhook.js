import { createHmac, timingSafeEqual } from "node:crypto";

const WHATSAPP_API_VERSION = "v20.0";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const config = { api: { bodyParser: false } };

const SYSTEM_PROMPT = `Você é a assistente virtual da DaPaz Confeitaria. Responda em português brasileiro, com simpatia, clareza e mensagens curtas, adequadas ao WhatsApp.
Ajude clientes com dúvidas sobre bolos, doces, encomendas e orçamento. Não invente preços, sabores disponíveis, prazos, taxas de entrega ou disponibilidade. Quando não houver informação confirmada, peça os dados necessários e diga que a equipe confirmará.
Para encaminhar um pedido, pergunte de forma natural: produto, data desejada, quantidade/tamanho, sabor e região de entrega ou retirada, conforme o contexto. Não afirme que um pedido está confirmado.
Se o cliente pedir uma pessoa, informe que a equipe humana dará continuidade.`.trim();

async function readRawBody(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === "string") return Buffer.from(req.rawBody);
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}
function verifySignature(raw, signature) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = Buffer.from("sha256=" + createHmac("sha256", secret).update(raw).digest("hex"));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function getMessages(body) {
  return (body?.entry || []).flatMap(entry => entry?.changes || []).flatMap(change => change?.value?.messages || []);
}
async function createReply(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return "Olá! 😊 Obrigado por entrar em contato com a DaPaz Confeitaria. Conte qual produto deseja, para qual data e se prefere entrega ou retirada. Nossa equipe confirmará os detalhes.";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: text.slice(0, 4000) }], temperature: 0.4, max_tokens: 250 })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { console.error("OpenAI request failed:", response.status); throw new Error("AI response failed"); }
  return data?.choices?.[0]?.message?.content?.trim() || "Obrigada por entrar em contato! Como podemos ajudar?";
}
async function sendWhatsAppMessage(to, text) {
  const id = process.env.PHONE_NUMBER_ID, token = process.env.WHATSAPP_TOKEN;
  if (!id || !token) throw new Error("WhatsApp credentials missing");
  const response = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${id}/messages`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } })
  });
  if (!response.ok) { console.error("WhatsApp send failed:", response.status, (await response.text()).slice(0, 400)); throw new Error("WhatsApp send failed"); }
}
export default async function handler(req, res) {
  if (req.method === "GET") {
    const token = process.env.WEBHOOK_VERIFY_TOKEN;
    if (token && req.query?.["hub.mode"] === "subscribe" && req.query?.["hub.verify_token"] === token) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(String(req.query?.["hub.challenge"] ?? ""));
    }
    return res.status(403).send("Forbidden");
  }
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  if (!process.env.META_APP_SECRET) return res.status(503).send("Signature secret not configured");
  let raw;
  try { raw = await readRawBody(req); } catch { return res.status(400).send("Invalid body"); }
  if (!verifySignature(raw, req.headers["x-hub-signature-256"])) return res.status(401).send("Invalid signature");
  let payload;
  try { payload = JSON.parse(raw.toString("utf8")); } catch { return res.status(400).send("Invalid JSON"); }
  const messages = getMessages(payload);
  if (!messages.length) return res.status(200).send("EVENT_RECEIVED");
  try {
    for (const msg of messages) {
      if (!msg?.from) continue;
      const answer = msg.type === "text" && msg.text?.body
        ? await createReply(msg.text.body)
        : "Olá! 😊 Para eu ajudar, envie sua dúvida ou pedido por texto. A equipe confirmará preços e disponibilidade.";
      await sendWhatsAppMessage(msg.from, answer);
    }
    return res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Webhook processing failed:", error?.message);
    return res.status(500).send("Processing failed");
  }
}
