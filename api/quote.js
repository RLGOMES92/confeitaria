const ALLOWED_EVENTS = ['Aniversário', 'Infantil', 'Casamento', 'Data especial', 'Outro'];
const ALLOWED_FLAVORS = ['Ninho com morango', 'Brigadeiro belga', 'Doce de leite com nozes', 'Pistache'];

function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validateQuote(body = {}) {
  const quote = {
    nome: clean(body.nome, 120),
    data: clean(body.data, 10),
    evento: clean(body.evento, 60),
    pessoas: clean(body.pessoas, 60),
    tema: clean(body.tema),
    sabor: clean(body.sabor, 80),
    observacoes: clean(body.observacoes),
    source: clean(body.source, 40)
  };

  const errors = [];
  if (quote.nome.length < 2) errors.push('nome');
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(quote.data)) errors.push('data');
  if (!ALLOWED_EVENTS.includes(quote.evento)) errors.push('evento');
  if (!quote.pessoas) errors.push('pessoas');
  if (quote.sabor && !ALLOWED_FLAVORS.includes(quote.sabor)) errors.push('sabor');
  if (quote.source !== 'site-dapaz') errors.push('source');

  return { valid: errors.length === 0, errors, quote };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método não permitido' });

  const { valid, errors, quote } = validateQuote(req.body);
  if (!valid) return res.status(400).json({ ok: false, error: 'Payload inválido', fields: errors });

  const customerMessage = typeof req.body.message === 'string' ? req.body.message.trim().slice(0, 1000) : '';
  if (customerMessage) {
    try {
      const { generateAgentResponse } = await import('./agent.js');
      const agent = await generateAgentResponse({ quote, input: customerMessage });
      return res.status(200).json({ ok: true, status: 'agent_response', quote, agent });
    } catch (error) {
      return res.status(503).json({ ok: false, status: 'handoff_required', message: 'Não foi possível responder automaticamente. A equipe deve continuar o atendimento.' });
    }
  }
  return res.status(200).json({
    ok: true,
    status: 'received',
    message: 'Orçamento recebido para triagem.',
    quote
  });
}
