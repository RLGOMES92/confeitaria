# API do Agente Dapaz

Endpoint: `POST /api/quote`.

## Arquitetura

`GitHub Pages → /api/quote → validação → agente → atendimento humano`

O site continua estático. A API deve ser publicada separadamente em uma plataforma serverless compatível com Node.js.

## Deploy seguro

1. Crie um projeto apontando para este repositório.
2. Configure a pasta raiz do projeto conforme a plataforma escolhida.
3. Configure as variáveis de ambiente **somente no painel da hospedagem**:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (opcional; padrão definido no código)
4. Não publique a chave no GitHub, no HTML ou em JavaScript do navegador.
5. Após publicar, obtenha a URL pública da API.
6. Se a API ficar em domínio diferente do GitHub Pages, altere o formulário para usar a URL da API e configure CORS no servidor.

## Teste

Exemplo de requisição:

```bash
curl -X POST https://SEU-DOMINIO/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Cliente",
    "data":"2026-10-15",
    "evento":"Aniversário",
    "pessoas":"21 a 40 pessoas",
    "tema":"Flores",
    "sabor":"Ninho com morango",
    "observacoes":"",
    "source":"site-dapaz",
    "message":"Olá, gostaria de um orçamento."
  }'
```

## Segurança

- A `OPENAI_API_KEY` nunca vai para o front-end.
- O servidor valida e normaliza os campos.
- O agente não deve inventar preços, disponibilidade, prazos ou confirmação de pedido.
- Casos comerciais que exigem confirmação devem seguir para atendimento humano.
- O fallback do site mantém o WhatsApp funcional se a API estiver indisponível.

## Arquivos

- `api/quote.js`: endpoint HTTP.
- `api/agent.js`: regras e integração com IA.
- `api/.env.example`: referência das variáveis de ambiente.
- `docs/whatsapp-quote-schema.json`: contrato do payload.
