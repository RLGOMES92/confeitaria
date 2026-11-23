# API da DaPaz Confeitaria

A API serverless é implantada junto deste repositório na Vercel, a partir da pasta raiz. Endpoints: `/api/quote` e `/api/webhook`.

## Configuração de produção

Na Vercel, abra **Project → Settings → Environment Variables** e configure:

- `OPENAI_API_KEY`: chave da API OpenAI.
- `OPENAI_MODEL`: modelo habilitado na conta (opcional).
- `PHONE_NUMBER_ID`: ID numérico do WhatsApp Cloud API.
- `WHATSAPP_TOKEN`: token de acesso da Meta.
- `WEBHOOK_VERIFY_TOKEN`: string aleatória forte, usada na validação GET.
- `META_APP_SECRET`: App Secret da Meta, para validar assinatura HMAC SHA-256 de POST.
- `ALLOWED_ORIGIN`: origem autorizada para API de orçamento, normalmente `https://rlgomes92.github.io`.

Não coloque credenciais no Git, HTML, mensagens ou screenshots. Depois de cadastrar/alterar variáveis, faça redeploy.

## Configurar webhook Meta

1. URL callback: `https://confeitaria-three-rose.vercel.app/api/webhook`.
2. Método de verificação: token definido em `WEBHOOK_VERIFY_TOKEN`.
3. Inscreva o campo `messages` no webhook da aplicação.
4. O POST exige `META_APP_SECRET` e uma assinatura válida em `X-Hub-Signature-256`.
5. Envie mensagem de teste a partir de um número autorizado e confira logs de função Vercel.

## Comportamento

- Mensagens texto recebem resposta gerada pela OpenAI (ou fallback quando não há chave).
- Mensagens de outros tipos recebem orientação para enviar texto.
- Notificações de status sem mensagens são ignoradas.
- Erros de processamento retornam 500 para permitir tentativa da Meta.
- A API não confirma encomendas, preços ou disponibilidade.

## Limitações não resolvidas

- Não há armazenamento de histórico persistente de conversas.
- Não há deduplicação durável de eventos da Meta.
- Não há catálogo de produtos, preço, agenda, cálculo de entrega ou controle de estoque.
- Não há encaminhamento automático/alerta para atendente humano.
- Credenciais externas são necessárias para teste ponta a ponta.

