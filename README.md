# Dapaz Confeitaria 🍰

Vitrine digital premium para a Dapaz Confeitaria, desenvolvida para apresentar o trabalho da marca e transformar visitantes em pedidos pelo WhatsApp.

## ✨ Objetivo

Este projeto funciona como um **case real de site comercial de alta conversão** e também como demonstração de uma solução que pode ser adaptada para outros negócios locais.

### O site apresenta

- Hero visual com destaque para a marca
- Galeria de bolos personalizados com filtros
- Seção de sabores
- Jornada de encomenda em 3 etapas
- CTAs estratégicos para WhatsApp
- CTA móvel persistente para conversão
- Integração com Instagram
- Layout responsivo e mobile-first
- SEO básico e dados estruturados
- Acessibilidade e redução de movimento respeitada

## 🧠 Conceito comercial

**Vitrine → confiança → desejo → contato → orçamento.**

A estrutura foi pensada para que o visitante conheça o trabalho, veja exemplos reais, entenda o processo e tenha um caminho curto até o atendimento.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3
- JavaScript
- Tailwind CSS via CDN
- Google Fonts
- GitHub Pages

## 🚀 Demonstração

Site publicado em:

https://rlgomes92.github.io/confeitaria/

## 🔒 Segurança

Nenhuma chave de API ou credencial deve ser colocada no código-fonte. Configurações sensíveis devem permanecer em variáveis de ambiente ou no serviço responsável pela integração.

## 🤖 Arquitetura preparada para Agente de IA

O orçamento do site agora usa uma estrutura padronizada com nome, data, evento, quantidade, tema, sabor, observações e origem. Isso prepara o projeto para uma integração futura com **WhatsApp + webhook + OpenAI API**, sem acoplar a inteligência artificial ao front-end.

Fluxo planejado: **Site → WhatsApp → Webhook → Agente de IA → Atendimento humano**.

O agente deve trabalhar somente com informações aprovadas pela Dapaz e nunca inventar preços, disponibilidade, prazos ou confirmações.

Documentação técnica:
- `docs/whatsapp-quote-schema.json`
- `docs/whatsapp-agent-flow.md`

## 📈 Próxima evolução

A próxima fase pode transformar esta vitrine em uma solução completa de **Site + Agente de IA + WhatsApp**, incluindo qualificação de leads, respostas automáticas, coleta de dados do pedido e encaminhamento para atendimento humano.

## 👨‍💻 Desenvolvimento

**Rodrigo Gomes** — Desenvolvedor Full Stack & Especialista em Agentes de IA

GitHub: https://github.com/RLGOMES92
Instagram: https://www.instagram.com/rodrigo_ligomes/


## ⚙️ Webhook do WhatsApp (Vercel)

O endpoint serverless está em `api/webhook.js` e oferece:
- Verificação GET do webhook da Meta.
- Recebimento de mensagens de texto via POST.
- Respostas geradas pela OpenAI quando `OPENAI_API_KEY` está configurada.
- Mensagem de fallback quando a chave da OpenAI não está disponível.

### Variáveis de ambiente

Configure no painel da Vercel (Settings → Environment Variables), sem inserir segredos no GitHub:

| Variável | Finalidade |
| --- | --- |
| `PHONE_NUMBER_ID` | ID do número de telefone no WhatsApp Cloud API (não é o número de telefone comum). |
| `WHATSAPP_TOKEN` | Token de acesso da API do WhatsApp. |
| `OPENAI_API_KEY` | Chave da API da OpenAI para gerar respostas. |
| `WEBHOOK_VERIFY_TOKEN` | Token usado na verificação GET. Se não for definido, o código usa o token de compatibilidade já existente. |

Após alterar variáveis, faça um novo deploy na Vercel. Configure na Meta a URL pública do endpoint `/api/webhook` e o mesmo token de verificação.

### Limitações atuais

- A conversa ainda não mantém histórico entre mensagens.
- O agente não consulta catálogo, preços ou agenda da confeitaria; forneça apenas dados aprovados antes de habilitar respostas comerciais específicas.
- O webhook trata mensagens de texto; outros tipos recebem uma orientação para enviar texto.
- A validação de assinatura das notificações POST da Meta ainda precisa ser implementada antes de considerar a integração endurecida para produção.
- A integração depende de credenciais válidas e de testes reais no ambiente publicado. O commit do código, por si só, não comprova que o serviço está operacional.
