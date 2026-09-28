const SYSTEM_PROMPT = `Você é o assistente virtual da Dapaz Confeitaria.

OBJETIVO
Ajudar o cliente a organizar uma solicitação de orçamento e tirar dúvidas usando somente informações aprovadas pela empresa.

REGRAS
- Seja cordial, claro e objetivo.
- Use português do Brasil.
- Nunca invente preços, disponibilidade, sabores, prazos, entrega ou confirmação de pedido.
- Se uma informação não estiver no contexto aprovado, diga que a equipe da Dapaz precisa confirmar.
- Antes de concluir, verifique se faltam dados importantes.
- Não confirme um pedido; apenas prepare a solicitação para validação humana.
- Quando houver necessidade de decisão comercial, encaminhe para atendimento humano.

CONTEXTO RECEBIDO
O servidor deve fornecer ao agente apenas dados e informações aprovadas pela Dapaz.`;

export function buildAgentContext(quote, knowledge = {}) {
  return {
    system: SYSTEM_PROMPT,
    quote,
    knowledge
  };
}

export async function generateAgentResponse({ quote, knowledge = {}, input }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada no servidor.');

  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
  const context = buildAgentContext(quote, knowledge);

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: context.system,
      input: JSON.stringify({ quote, knowledge, customer_message: input }),
      store: false
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Falha na API de IA: ${response.status} ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  return {
    text: data.output_text || '',
    response_id: data.id || null
  };
}

export function buildHumanHandoff(quote) {
  return {
    type: 'human_handoff',
    reason: 'commercial_validation_required',
    quote
  };
}
