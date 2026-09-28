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

## Endpoint implementado

A primeira versão de `/api/quote` já valida e normaliza o payload, rejeita métodos diferentes de POST e retorna um objeto de triagem. A integração com OpenAI permanece deliberadamente separada para não expor credenciais nem inventar regras comerciais.


## Regras do agente

A lógica inicial do agente está em `api/agent.js`. Ela separa as instruções do agente do endpoint HTTP e define o handoff humano para validações comerciais.

A integração com o provedor de IA deve permanecer no servidor e usar variáveis de ambiente. Nenhuma chave deve ser commitada no repositório.
