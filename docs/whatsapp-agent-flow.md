# Arquitetura — Site + Agente de IA + WhatsApp

## Fluxo

`Site → WhatsApp → Webhook → Agente de IA → Atendimento humano`

O site coleta um conjunto padronizado de dados e envia uma mensagem estruturada. Em uma próxima etapa, o mesmo formato pode ser recebido por um webhook e convertido em contexto para um agente.

## Dados coletados

- Nome
- Data da comemoração
- Tipo de evento
- Quantidade de pessoas
- Tema/ideia
- Sabor
- Observações
- Origem do lead

## Responsabilidades do agente

O agente poderá, após a integração:

1. Identificar a intenção do cliente.
2. Organizar os dados do pedido.
3. Responder dúvidas com base em informações aprovadas pela Dapaz.
4. Solicitar dados que estejam faltando.
5. Preparar um resumo para a equipe.
6. Encaminhar para atendimento humano quando necessário.

## Regras importantes

O agente **não deve inventar** preços, disponibilidade, sabores, prazos, condições de entrega ou confirmação de pedido.

Preço final, disponibilidade da data e confirmação da encomenda devem permanecer sujeitos à validação da equipe da Dapaz.

## Evolução técnica

1. Site estático com formulário estruturado.
2. WhatsApp como canal de entrada.
3. Webhook para receber eventos.
4. OpenAI API para interpretação e geração de respostas.
5. Base de conhecimento com catálogo aprovado.
6. Handoff para humano.
7. Registro dos leads e métricas de conversão.

## Objetivo comercial

A arquitetura transforma o site em uma demonstração real de uma solução replicável para negócios locais: **site de alta conversão + atendimento inteligente + WhatsApp**.
