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

---

## 🎯 Plano de crescimento e finalização — Nov/2026

### Fase 1 — Conversão do site
- [ ] Revisar site em dispositivos móveis e desktop.
- [ ] Conferir CTAs e links de WhatsApp em todas as seções.
- [ ] Confirmar número de contato e Instagram.
- [ ] Conferir imagens, textos, catálogo, sabores e preços; não publicar valores sem validação da confeitaria.
- [ ] Testar formulário e fluxo de fallback para WhatsApp.
- [ ] Revisar acessibilidade, velocidade e erros de console.

### Fase 2 — SEO e presença local
- [x] `robots.txt` aponta para `sitemap.xml`.
- [x] Sitemap XML existe no repositório.
- [ ] Validar sitemap publicado e reenviar no Search Console.
- [ ] Confirmar indexação e corrigir problemas reportados.
- [ ] Completar/atualizar Google Business Profile com fotos reais, produtos, horário e link de pedido.
- [ ] Solicitar avaliações honestas a clientes após entregas.

### Fase 3 — Atendimento WhatsApp
- [ ] Confirmar webhook e variáveis no ambiente de produção.
- [ ] Testar mensagem recebida e resposta enviada com número real.
- [ ] Confirmar logs e tratamento de falhas.
- [ ] Proteger endpoint com validação de assinatura Meta e controles contra duplicidade.
- [ ] Definir fallback claro para atendimento humano.

### Fase 4 — Aura IA e catálogo
- [ ] Unificar regras de atendimento entre webhook e endpoint de orçamento.
- [ ] Criar catálogo oficial (produtos, sabores, tamanhos, preços, prazo, retirada/entrega).
- [ ] Implementar coleta conversacional dos dados do pedido.
- [ ] Não inventar preço, prazo, disponibilidade ou confirmação.
- [ ] Preparar resumo de pedido e transferência para pessoa responsável.
- [ ] Testar cenários de conversa e casos de erro.

### Fase 5 — Aquisição e retenção
- [ ] Planejar conteúdo semanal com fotos reais, bastidores, produtos, temas e depoimentos.
- [ ] Usar links de WhatsApp com mensagens de entrada claras.
- [ ] Registrar origem dos contatos (Google, Instagram, indicação, site).
- [ ] Acompanhar métricas: cliques no WhatsApp, pedidos de orçamento, encomendas fechadas, avaliações e produtos mais procurados.
- [ ] Criar rotina de pós-venda e pedido de avaliação.

### Critério de lançamento
A DaPaz só será marcada como pronta quando o caminho completo for testado: **visitante → produto/formulário → WhatsApp → atendimento → orçamento confirmado por pessoa → encomenda**. A publicação do código não substitui testes de produção.


## 🔎 Status verificado na hospedagem (23/11/2026)

- Projeto Vercel `confeitaria`: existe e está conectado ao repositório.
- Domínio de produção verificado: `confeitaria-three-rose.vercel.app`.
- O endpoint do formulário usa o domínio estável de produção, evitando URL específica de deployment/branch.
- A lista de variáveis de ambiente retornou vazia na verificação; portanto, a IA e o webhook não devem ser considerados operacionais até que as credenciais necessárias sejam configuradas e testadas.
- Não registrar, copiar ou publicar tokens/segredos no README ou Git.
- Deploys recentes podem estar em construção; confirme estado READY antes de considerar as alterações publicadas.
