# API do Agente Dapaz

Esta pasta reserva a integração futura do atendimento inteligente.

## Contrato inicial

O endpoint planejado será `POST /api/quote` e receberá o payload documentado em `docs/whatsapp-quote-schema.json`.

Fluxo:

`Site → POST /api/quote → validação → contexto do agente → OpenAI API → resposta/triagem → humano`

## Segurança

- Nunca colocar `OPENAI_API_KEY` no front-end.
- Segredos ficam somente em variáveis de ambiente do servidor.
- Validar e normalizar todos os campos recebidos.
- Não confirmar preço, disponibilidade ou pedido sem regra/fonte aprovada.

## Implementação

O projeto atual continua estático e publicado no GitHub Pages. O backend deve ser hospedado separadamente (por exemplo, em uma função serverless), mantendo o site desacoplado da chave da OpenAI.
