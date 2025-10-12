# 📝 Changelog

## [2.0.0] - 2024-01-XX

### ✨ Adicionado

- **Integração WhatsApp Real com Baileys**
  - QR Code real do WhatsApp
  - Conexão automática após escanear
  - Recebimento de mensagens em tempo real
  - Envio de mensagens direto para WhatsApp
  - Múltiplas instâncias simultâneas
  - Persistência de sessão

- **Melhorias no Backend**
  - Serviço WhatsApp com @whiskeysockets/baileys
  - Reconexão automática de sessões ativas
  - Health check endpoint
  - Suporte para Supabase (DIRECT_URL)

- **Melhorias no Frontend**
  - Página de conexões WhatsApp funcional
  - Exibição de QR Code em tempo real
  - Status de conexão em tempo real via Socket.io
  - Interface para múltiplas conexões

- **Documentação**
  - Guia completo de integração WhatsApp
  - Guia de deploy no Railway
  - Instruções de configuração Supabase

### 🔧 Alterado

- Substituído whatsapp-web.js por @whiskeysockets/baileys
- Otimizado para funcionar no Railway sem Puppeteer
- Melhorado sistema de reconexão automática

### 🐛 Corrigido

- Problema de QR Code não exibindo
- Reconexão após restart do servidor
- Persistência de sessões no Railway

### 📦 Dependências

- Adicionado: @whiskeysockets/baileys ^6.6.0
- Adicionado: @hapi/boom ^10.0.1
- Adicionado: pino ^8.17.2
- Removido: whatsapp-web.js

## [1.0.0] - 2024-01-XX

### ✨ MVP Inicial

- Sistema de autenticação
- Gestão de usuários
- Gestão de filas
- Gestão de tickets
- Chat funcional (simulado)
- Dashboard com métricas
- Sistema de tags
- Respostas rápidas
- Transferência de tickets
- Notificações em tempo real

---

**Formato baseado em [Keep a Changelog](https://keepachangelog.com/)**
