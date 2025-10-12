# 🚂 Deploy no Railway - Guia Completo

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Conta no [Supabase](https://supabase.com/)
- Conta no [Vercel](https://vercel.com/)
- Repositório no GitHub

## 🗄️ 1. Configurar Supabase (Banco de Dados)

### 1.1 Criar Projeto

1. Acesse [Supabase](https://supabase.com/)
2. Clique em **"New Project"**
3. Escolha um nome e senha
4. Aguarde a criação (2-3 minutos)

### 1.2 Obter URLs de Conexão

1. Vá em **Settings** > **Database**
2. Copie a **Connection String** (URI)
3. Copie a **Direct Connection** (Session Pooler)

Exemplo:
```
DATABASE_URL=postgresql://postgres.xxx:senha@aws-0-us-east-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.xxx:senha@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### 1.3 Executar Migrations

No seu computador:

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
```

## 🚂 2. Deploy Backend no Railway

### 2.1 Criar Projeto

1. Acesse [Railway](https://railway.app/)
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione seu repositório
5. Escolha a pasta **backend**

### 2.2 Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
DATABASE_URL=sua_url_do_supabase
DIRECT_URL=sua_url_direta_do_supabase
JWT_SECRET=gere_uma_chave_secreta_forte
JWT_REFRESH_SECRET=gere_outra_chave_secreta_forte
PORT=3001
NODE_ENV=production
```

**Dica:** Gere chaves secretas fortes:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Configurar Build

No Railway, vá em **Settings**:

- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### 2.4 Obter URL do Backend

Após o deploy:
1. Vá em **Settings** > **Networking**
2. Clique em **Generate Domain**
3. Copie a URL (ex: `https://seu-app.railway.app`)

## ▲ 3. Deploy Frontend no Vercel

### 3.1 Importar Projeto

1. Acesse [Vercel](https://vercel.com/)
2. Clique em **"Add New"** > **"Project"**
3. Importe seu repositório do GitHub
4. Escolha a pasta **frontend**

### 3.2 Configurar Variáveis de Ambiente

No Vercel, adicione:

```env
NEXT_PUBLIC_API_URL=https://seu-app.railway.app/api
NEXT_PUBLIC_WS_URL=wss://seu-app.railway.app
```

**Importante:** Use `wss://` (WebSocket Secure) para produção!

### 3.3 Configurar Build

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3.4 Deploy

Clique em **Deploy** e aguarde (2-3 minutos)

## ✅ 4. Testar Integração

### 4.1 Acessar Sistema

1. Acesse a URL do Vercel
2. Faça login com:
   - Email: `admin@whatsapp.com`
   - Senha: `admin123`

### 4.2 Conectar WhatsApp

1. Vá em **WhatsApp** no menu
2. Clique em **"Nova Conexão"**
3. Clique em **"Conectar"**
4. Escaneie o QR Code

### 4.3 Testar Mensagens

1. Envie uma mensagem para o número conectado
2. Verifique se o ticket foi criado
3. Responda pelo sistema
4. Verifique se chegou no WhatsApp

## 🔧 5. Configurações Avançadas

### 5.1 CORS no Railway

Se tiver problemas de CORS, adicione no Railway:

```env
CORS_ORIGIN=https://seu-app.vercel.app
```

### 5.2 Logs no Railway

Para ver logs em tempo real:
```bash
railway logs
```

### 5.3 Redeploy

Para fazer redeploy:
- **Railway**: Commit no GitHub (auto-deploy)
- **Vercel**: Commit no GitHub (auto-deploy)

## 🐛 Troubleshooting

### Backend não inicia

1. Verifique variáveis de ambiente
2. Verifique logs no Railway
3. Teste conexão com Supabase

### Frontend não conecta

1. Verifique `NEXT_PUBLIC_API_URL`
2. Teste a URL do backend no navegador
3. Verifique CORS

### WhatsApp não conecta

1. Aguarde 10-15 segundos para QR Code
2. Verifique logs no Railway
3. Tente desconectar e conectar novamente

### Sessão não persiste

1. Verifique se `auth_sessions/` está no Railway
2. Não use volumes temporários
3. Railway mantém arquivos entre deploys

## 📊 Monitoramento

### Railway

- **Metrics**: CPU, RAM, Network
- **Logs**: Real-time logs
- **Deployments**: Histórico de deploys

### Vercel

- **Analytics**: Pageviews, performance
- **Logs**: Function logs
- **Deployments**: Preview e production

## 💰 Custos

### Plano Gratuito

- **Railway**: $5 de crédito/mês (suficiente para testes)
- **Vercel**: Ilimitado para hobby
- **Supabase**: 500MB database, 2GB bandwidth

### Plano Pago (Recomendado para Produção)

- **Railway**: $5/mês + uso
- **Vercel**: $20/mês (Pro)
- **Supabase**: $25/mês (Pro)

## 🔐 Segurança

### Checklist

- [ ] Alterar senha do admin
- [ ] Usar HTTPS em produção
- [ ] Configurar CORS corretamente
- [ ] Usar variáveis de ambiente
- [ ] Não commitar .env
- [ ] Usar chaves JWT fortes

## 🚀 Próximos Passos

1. Configurar domínio customizado
2. Adicionar SSL certificate
3. Configurar backup automático
4. Implementar monitoramento
5. Configurar alertas

---

**Dúvidas?** Abra uma issue no GitHub!
