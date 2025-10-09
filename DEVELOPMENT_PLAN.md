# 📋 Plano de Desenvolvimento - WhatsApp Manager

## 🎯 Status Atual do Projeto

### ✅ Implementado (Backend)
- Autenticação JWT
- CRUD de Usuários, Filas, Tags, Contatos
- Controllers e Routes completos
- Socket.io configurado
- Prisma ORM com schema completo

### ✅ Implementado (Frontend)
- Login funcional
- Estrutura básica de páginas
- API client configurado
- Auth store (Zustand)

### ❌ Faltando (Crítico)
1. **Páginas do Frontend** - Apenas placeholders
2. **Integração WhatsApp** - Baileys não implementado
3. **Interface de Chat** - Componentes básicos sem funcionalidade
4. **Dashboard real** - Sem dados reais
5. **Socket.io Client** - Não conectado

---

## 🚀 FASE 1: INTERFACE FUNCIONAL (Prioridade MÁXIMA)

### 1.1 Dashboard Completo
- [ ] Cards com métricas reais da API
- [ ] Gráficos com dados do backend
- [ ] Atualização em tempo real via Socket.io

### 1.2 Página de Usuários
- [ ] Listagem com tabela
- [ ] Modal de criar/editar usuário
- [ ] Filtros e busca
- [ ] Indicador de status online/offline

### 1.3 Página de Filas
- [ ] CRUD completo
- [ ] Seletor de cor
- [ ] Atribuição de usuários
- [ ] Configuração de horários

### 1.4 Página de Tags
- [ ] CRUD completo
- [ ] Seletor de cor
- [ ] Contador de uso

### 1.5 Página de Tickets (PRINCIPAL)
- [ ] Lista lateral com filtros
- [ ] Área de chat funcional
- [ ] Envio/recebimento de mensagens
- [ ] Ações: aceitar, transferir, finalizar
- [ ] Aplicar tags
- [ ] Notas internas

### 1.6 Página de Configurações
- [ ] Configurações gerais
- [ ] Configurações de notificações
- [ ] Gerenciar conexões WhatsApp

---

## 🚀 FASE 2: INTEGRAÇÃO WHATSAPP

### 2.1 Backend - Baileys Service
- [ ] Criar `whatsapp.service.ts`
- [ ] Gerar QR Code
- [ ] Gerenciar sessões
- [ ] Receber mensagens
- [ ] Enviar mensagens
- [ ] Status de conexão

### 2.2 Frontend - Conexão WhatsApp
- [ ] Página de conexões
- [ ] Exibir QR Code
- [ ] Status em tempo real
- [ ] Múltiplas instâncias

---

## 🚀 FASE 3: FUNCIONALIDADES AVANÇADAS

### 3.1 Respostas Rápidas
- [ ] Interface de gerenciamento
- [ ] Busca por atalho
- [ ] Variáveis dinâmicas
- [ ] Uso no chat

### 3.2 Chatbot Básico
- [ ] Fluxo de menu
- [ ] Palavras-chave
- [ ] Transferência para humano

### 3.3 Relatórios
- [ ] Filtros avançados
- [ ] Exportação PDF/Excel
- [ ] Gráficos detalhados

---

## 📝 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### Sprint 1 (Esta semana)
1. ✅ Corrigir login e deploy
2. **Dashboard funcional** (próximo)
3. **Página de Usuários completa**
4. **Página de Filas completa**

### Sprint 2
5. **Página de Tickets - Lista e Filtros**
6. **Área de Chat funcional**
7. **Socket.io Client integrado**

### Sprint 3
8. **Integração Baileys - QR Code**
9. **Receber/Enviar mensagens WhatsApp**
10. **Gestão de conexões**

### Sprint 4
11. **Respostas rápidas**
12. **Tags na interface**
13. **Relatórios básicos**

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Implementar Dashboard funcional com dados reais:**
- Conectar com API `/api/dashboard/stats`
- Exibir métricas em cards
- Adicionar gráficos básicos
- Socket.io para atualização real-time

Após isso, seguir para **Página de Usuários** completa.
