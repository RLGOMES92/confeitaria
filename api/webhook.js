const WHATSAPP_API_VERSION = "v20.0";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `
Você é a assistente virtual da DaPaz Confeitaria. Responda em português brasileiro, com simpatia, clareza e mensagens curtas, adequadas ao WhatsApp.
Ajude clientes com dúvidas sobre bolos, doces, encomendas e orçamento. Não invente preços, sabores disponíveis, prazos, taxas de entrega ou disponibilidade. Quando não houver informação confirmada, peça os dados necessários e diga que a equipe confirmará.
Para encaminhar um pedido, pergunte de forma natural: produto, data desejada, quantidade/tamanho, sabor e região de entrega ou retirada, conforme o contexto. Não afirme que um pedido está confirmado.
Se o cliente pedir uma pessoa, informe que a equipe humana dará continuidade.
`.trim();

function getMessage(body) {
  return body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] ?? null;
}

async function createReply(userText) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "Olá! 😊 Obrigado por entrar em contato com a DaPaz Confeitaria. Para agilizar seu atendimento, conte qual produto deseja, para qual data e em qual região. Nossa equipe confirmará os detalhes com você.";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText }
      ],
      temperature: 0.4,
      max_tokens: 250
    })
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("Erro da API OpenAI:", response.status, JSON.stringify(result));
    throw new Error("Falha ao gerar resposta com IA");
  }

  return result?.choices?.[0]?.message?.content?.trim()
    || "Obrigada por entrar em contato! Como podemos ajudar?";
}

async function sendWhatsAppMessage(to, text) {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const whatsappToken = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !whatsappToken) {
    throw new Error("PHONE_NUMBER_ID ou WHATSAPP_TOKEN não configurado.");
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
        to,
        type: "text",
        text: { body: text }
      })
    }
  );

  const result = await response.text();
  if (!response.ok) {
    console.error("Erro da API do WhatsApp:", response.status, result);
    throw new Error("Falha ao enviar mensagem pelo WhatsApp");
  }

  console.log("Resposta enviada ao WhatsApp:", result);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req?.query?.["hub.mode"];
    const token = req?.query?.["hub.verify_token"];
    const challenge = req?.query?.["hub.challenge"];

    if (mode === "subscribe" && token === (process.env.WEBHOOK_VERIFY_TOKEN || "dapaz_webhook_2026_9f7k2m")) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(String(challenge ?? ""));
    }

    return res.status(403).send("Forbidden");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = getMessage(body);

    // A Meta também envia notificações de status, que não precisam de resposta.
    if (!message?.from) {
      return res.status(200).send("EVENT_RECEIVED");
    }

    if (message.type !== "text" || !message.text?.body) {
      await sendWhatsAppMessage(
        message.from,
        "Olá! No momento consigo entender mensagens de texto. 😊 Escreva sua dúvida ou pedido para que eu possa ajudar."
      );
      return res.status(200).send("EVENT_RECEIVED");
    }

    const reply = await createReply(message.text.body);
    await sendWhatsAppMessage(message.from, reply);
    return res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Erro no webhook:", error);
    // Retorna 200 para evitar tentativas repetidas da Meta. Consulte os logs para diagnóstico.
    return res.status(200).send("EVENT_RECEIVED");
  }
}
