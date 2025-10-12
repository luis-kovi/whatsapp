# 📱 Integração WhatsApp Real - Baileys

## ✅ Implementação Completa

Sistema integrado com **@whiskeysockets/baileys** para conexão real com WhatsApp Web.

### Por que Baileys?

- ✅ **Funciona no Railway** - Não precisa de Puppeteer/Chrome
- ✅ **Leve e rápido** - Menor consumo de recursos
- ✅ **Multi-sessão** - Suporta múltiplas conexões simultâneas
- ✅ **Persistência** - Sessões salvas automaticamente
- ✅ **Gratuito** - Sem custos adicionais

### Funcionalidades

1. **QR Code Real** - Gerado pelo WhatsApp oficial
2. **Conexão Automática** - Reconecta automaticamente após escanear
3. **Recebimento de Mensagens** - Cria tickets automaticamente
4. **Envio de Mensagens** - Envia direto para o WhatsApp
5. **Múltiplas Instâncias** - Várias conexões simultâneas
6. **Persistência de Sessão** - Não precisa escanear sempre

## 🚀 Como Usar

### 1. Acessar Conexões WhatsApp

- Faça login no sistema
- Acesse o menu **"WhatsApp"**

### 2. Criar Nova Conexão

- Clique em **"Nova Conexão"**
- Digite um nome (ex: "Atendimento Vendas")
- Clique em **"Criar"**

### 3. Conectar WhatsApp

- Clique em **"Conectar"** na conexão criada
- Aguarde o QR Code aparecer (5-10 segundos)
- Clique em **"Ver QR Code"**

### 4. Escanear QR Code

No seu celular:
1. Abra o **WhatsApp**
2. Toque em **⋮** (menu) > **Aparelhos conectados**
3. Toque em **"Conectar um aparelho"**
4. Escaneie o QR Code exibido na tela

### 5. Pronto!

- Status mudará para **"Conectado"**
- Mensagens recebidas criarão tickets automaticamente
- Mensagens enviadas pelo sistema vão para o WhatsApp

## 🔧 Configuração no Railway

### Variáveis de Ambiente

Certifique-se de ter no Railway:

```env
DATABASE_URL=sua_url_do_supabase
DIRECT_URL=sua_url_direta_do_supabase
JWT_SECRET=seu_secret_jwt
JWT_REFRESH_SECRET=seu_refresh_secret
PORT=3001
NODE_ENV=production
```

### Persistência de Sessões

As sessões são salvas em `auth_sessions/` no Railway. O Railway mantém esses arquivos entre deploys, então você não precisa escanear o QR Code toda vez.

## 📊 Fluxo de Mensagens

### Mensagem Recebida

1. WhatsApp recebe mensagem
2. Sistema busca/cria contato
3. Sistema busca/cria ticket
4. Mensagem é salva no banco
5. Notificação em tempo real via Socket.io

### Mensagem Enviada

1. Atendente digita mensagem no sistema
2. Sistema envia para WhatsApp via Baileys
3. Mensagem é salva no banco
4. Status atualizado em tempo real

## 🔄 Reconexão Automática

O sistema reconecta automaticamente em caso de:
- Perda de conexão temporária
- Restart do servidor
- Problemas de rede

**Exceção:** Se você desconectar manualmente ou fizer logout no celular, precisará escanear o QR Code novamente.

## 🛡️ Segurança

- ✅ Sessões criptografadas
- ✅ Autenticação JWT
- ✅ Dados salvos no Supabase
- ✅ Conexão segura via WebSocket

## ⚠️ Limitações

### WhatsApp Business API vs Baileys

| Recurso | Baileys | Business API |
|---------|---------|--------------|
| Custo | Gratuito | Pago |
| QR Code | Sim | Não |
| Mensagens | Ilimitadas | Limitadas |
| Aprovação Meta | Não precisa | Precisa |
| Suporte Oficial | Não | Sim |

### Recomendações

- **Pequenas empresas**: Use Baileys (gratuito)
- **Grandes empresas**: Considere Business API (oficial)
- **Teste primeiro**: Baileys é perfeito para começar

## 🐛 Troubleshooting

### QR Code não aparece

1. Verifique se o Railway está rodando
2. Aguarde 10-15 segundos
3. Tente desconectar e conectar novamente

### Desconecta sozinho

1. Verifique conexão de internet
2. Certifique-se que o celular está online
3. Não faça logout no celular

### Mensagens não chegam

1. Verifique se a conexão está "Conectada"
2. Teste enviando uma mensagem do celular
3. Verifique logs no Railway

## 📱 Múltiplas Conexões

Você pode ter várias conexões simultâneas:

- **Vendas**: +55 11 99999-1111
- **Suporte**: +55 11 99999-2222
- **Financeiro**: +55 11 99999-3333

Cada conexão funciona independentemente!

## 🔗 Links Úteis

- [Baileys GitHub](https://github.com/WhiskeySockets/Baileys)
- [WhatsApp Business API](https://business.whatsapp.com/)
- [Railway Docs](https://docs.railway.app/)

---

**Desenvolvido com ❤️ usando Baileys**
