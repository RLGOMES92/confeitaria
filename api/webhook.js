import OpenAI from "openai";

const VERIFY_TOKEN = "dapaz_webhook_2026_9f7k2m";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v23.0";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export default async function handler(req, res) {
  if (req.method === "GET") {
    return verifyWebhook(req, res);
  }

  if (req.method === "POST") {
    return receiveWebhook(req, res);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

function verifyWebhook(req, res) {
  const mode = String(req.query["hub.mode"] || "");
  const verifyToken = String(req.query["hub.verify_token"] || "");
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    verifyToken === VERIFY_TOKEN &&
    challenge !== undefined &&
    challenge !== null
  ) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end(String(challenge));
  }

  return res.sendStatus(403);
}

async function receiveWebhook(req, res) {
  if (req.body?.object !== "whatsapp_business_account") {
    return res.sendStatus(404);
  }

  try {
    const messages = extractTextMessages(req.body);

    for (const message of messages) {
      await processMessage(message);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return res.sendStatus(200);
  }
}

function extractTextMessages(body) {
  const messages = [];

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value;

      for (const message of value?.messages || []) {
        if (message.type === "text" && message.from && message.text?.body) {
          messages.push({
            id: message.id,
            from: message.from,
            text: message.text.body.trim()
          });
        }
      }
    }
  }

  return messages;
}

async function processMessage(message) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    store: false,
    instructions: `
Você é o assistente virtual da DaPaz Confeitaria.

Atenda clientes em português do Brasil com cordialidade, clareza e respostas curtas para WhatsApp.

A DaPaz trabalha com bolos artesanais personalizados. Ajude com informações gerais, sabores, personalização e pedidos de orçamento.

Para um orçamento, peça:
- data desejada;
- quantidade de pessoas;
- tema/modelo;
- sabor;
- cidade ou região para entrega/retirada.

Nunca invente preço, disponibilidade, sabores ou políticas da empresa. Quando não souber uma informação, diga que a equipe da DaPaz precisa confirmar.

Não peça senhas, tokens ou códigos de segurança.
`,
    input: message.text
  });

  const answer =
    response.output_text?.trim() ||
    "Olá! Recebi sua mensagem. Nossa equipe vai continuar seu atendimento. 💛";

  await sendWhatsAppMessage(message.from, answer);
}

async function sendWhatsAppMessage(to, body) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    throw new Error("WHATSAPP_TOKEN or PHONE_NUMBER_ID is not configured");
  }

  const url =
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        preview_url: false,
        body
      }
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`WhatsApp API ${response.status}: ${details}`);
  }
}
