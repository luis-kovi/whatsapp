# 🚀 Guia Completo de Deploy - WhatsApp Manager

Deploy do sistema usando **Vercel** (Frontend) + **Railway** (Backend) + **Supabase** (Database)

---

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (vercel.com)
- Conta no Railway (railway.app)
- Conta no Supabase (supabase.com)
- Git instalado

---

## 🔧 PASSO 1: Preparar o Projeto

### 1.1 Criar arquivo .env.example no frontend

```bash
cd frontend
```

Crie o arquivo `.env.example`:
```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

### 1.2 Adicionar scripts de build

Verifique se `backend/package.json` tem:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "prisma generate"
  }
}
```

### 1.3 Criar arquivo railway.json no backend

```bash
cd backend
```

Crie `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run prisma:migrate && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 📦 PASSO 2: Subir para o GitHub

### 2.1 Inicializar Git (se ainda não fez)

```bash
# Voltar para raiz do projeto
cd c:\Users\luis.alves_kovi\Documents\Repositorios\whatsapp

# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - WhatsApp Manager System"
```

### 2.2 Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `whatsapp-manager`
3. Deixe como **Público** ou **Privado**
4. **NÃO** inicialize com README
5. Clique em **Create repository**

### 2.3 Conectar e fazer push

```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/whatsapp-manager.git

# Renomear branch para main
git branch -M main

# Fazer push
git push -u origin main
```

**✅ Projeto agora está no GitHub!**

---

## 🗄️ PASSO 3: Configurar Supabase (Database)

### 3.1 Criar projeto

1. Acesse https://supabase.com
2. Clique em **New Project**
3. Preencha:
   - **Name:** whatsapp-manager
   - **Database Password:** Crie uma senha forte (ANOTE!)
   - **Region:** South America (São Paulo)
4. Clique em **Create new project**
5. Aguarde ~2 minutos

### 3.2 Obter DATABASE_URL

1. No painel do Supabase, vá em **Settings** (ícone engrenagem)
2. Clique em **Database**
3. Role até **Connection string**
4. Selecione **URI** (não Pooler)
5. Copie a URL (formato: `postgresql://postgres:[YOUR-PASSWORD]@...`)
6. **Substitua `[YOUR-PASSWORD]` pela senha que você criou**

Exemplo:
```
postgresql://postgres:SuaSenhaForte123@db.abc123xyz.supabase.co:5432/postgres
```

**✅ Anote essa URL, você vai precisar!**

---

## 🚂 PASSO 4: Deploy do Backend no Railway

### 4.1 Criar projeto

1. Acesse https://railway.app
2. Clique em **Login** e entre com GitHub
3. Clique em **New Project**
4. Selecione **Deploy from GitHub repo**
5. Autorize o Railway a acessar seus repositórios
6. Selecione o repositório **whatsapp-manager**

### 4.2 Configurar o serviço

1. Railway vai detectar o projeto
2. Clique em **Add variables** ou vá em **Variables**
3. Adicione as seguintes variáveis:

```env
DATABASE_URL=postgresql://postgres:SuaSenha@db.abc.supabase.co:5432/postgres
JWT_SECRET=seu-super-secret-jwt-key-mude-isso-em-producao-12345
JWT_REFRESH_SECRET=seu-super-secret-refresh-key-mude-isso-em-producao-67890
PORT=3001
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- Cole a `DATABASE_URL` do Supabase (Passo 3.2)
- Gere secrets fortes para JWT (use gerador online ou `openssl rand -base64 32`)

### 4.3 Configurar Root Directory

1. Clique em **Settings**
2. Em **Root Directory**, coloque: `backend`
3. Em **Start Command**, coloque: `npm run build && npx prisma migrate deploy && npm start`
4. Clique em **Deploy**

### 4.4 Executar migrations

Após o deploy:
1. Vá em **Deployments**
2. Aguarde o build terminar
3. As migrations rodarão automaticamente

### 4.5 Obter URL do backend

1. Vá em **Settings**
2. Em **Domains**, clique em **Generate Domain**
3. Copie a URL (exemplo: `whatsapp-backend-production.up.railway.app`)

**✅ Anote essa URL do backend!**

---

## 🎨 PASSO 5: Deploy do Frontend no Vercel

### 5.1 Criar projeto

1. Acesse https://vercel.com
2. Clique em **Login** e entre com GitHub
3. Clique em **Add New** > **Project**
4. Selecione o repositório **whatsapp-manager**
5. Clique em **Import**

### 5.2 Configurar o projeto

1. Em **Framework Preset**, selecione **Next.js**
2. Em **Root Directory**, clique em **Edit** e selecione `frontend`
3. Em **Environment Variables**, adicione:

```env
NEXT_PUBLIC_API_URL=https://whatsapp-backend-production.up.railway.app
```

**⚠️ Cole a URL do Railway (Passo 4.5) SEM `/api` no final**

4. Clique em **Deploy**
5. Aguarde ~2 minutos

### 5.3 Obter URL do frontend

Após o deploy:
1. Vercel mostrará a URL (exemplo: `whatsapp-manager.vercel.app`)
2. Clique na URL para acessar

**✅ Sistema está no ar!**

---

## 🔄 PASSO 6: Configurar CORS no Backend

### 6.1 Atualizar código

Edite `backend/src/server.ts` e atualize o CORS:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://whatsapp-manager.vercel.app', // Sua URL do Vercel
    'https://*.vercel.app' // Permite preview deployments
  ],
  credentials: true
}));
```

### 6.2 Fazer commit e push

```bash
cd c:\Users\luis.alves_kovi\Documents\Repositorios\whatsapp

git add .
git commit -m "Configure CORS for production"
git push
```

Railway fará redeploy automático.

---

## 🌱 PASSO 7: Popular o Banco (Seed)

### 7.1 Via Railway CLI (Recomendado)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Rodar seed
railway run npm run prisma:seed
```

### 7.2 Via Supabase SQL Editor (Alternativa)

1. Acesse Supabase > **SQL Editor**
2. Execute o seed manualmente criando o usuário admin:

```sql
INSERT INTO users (id, name, email, password, role, max_tickets, is_active)
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@whatsapp.com',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt para gerar
  'ADMIN',
  10,
  true
);
```

**Ou use um gerador de hash bcrypt online para a senha `admin123`**

---

## ✅ PASSO 8: Testar o Sistema

### 8.1 Acessar aplicação

1. Abra a URL do Vercel: `https://whatsapp-manager.vercel.app`
2. Faça login:
   - **Email:** admin@whatsapp.com
   - **Senha:** admin123

### 8.2 Verificar funcionamento

- ✅ Login funciona
- ✅ Dashboard carrega
- ✅ Pode criar usuários
- ✅ Pode criar filas
- ✅ Pode criar tickets

---

## 🔧 PASSO 9: Configurações Adicionais (Opcional)

### 9.1 Domínio customizado no Vercel

1. Vercel > **Settings** > **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 9.2 Variáveis de ambiente no Railway

Para adicionar Redis (Upstash):
1. Acesse https://upstash.com
2. Crie Redis database
3. Copie `REDIS_URL`
4. Adicione no Railway > **Variables**

---

## 📊 Monitoramento

### Railway (Backend)
- **Logs:** Railway > **Deployments** > Clique no deploy > **View Logs**
- **Métricas:** Railway > **Metrics**

### Vercel (Frontend)
- **Logs:** Vercel > **Deployments** > Clique no deploy > **View Function Logs**
- **Analytics:** Vercel > **Analytics**

### Supabase (Database)
- **Tabelas:** Supabase > **Table Editor**
- **Logs:** Supabase > **Logs**

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se `DATABASE_URL` está correta no Railway
- Teste conexão no Supabase > **Database** > **Connection pooler**

### Erro: "CORS policy"
- Verifique se adicionou a URL do Vercel no CORS (Passo 6)
- Faça push das alterações

### Erro: "Module not found"
- Railway > **Settings** > **Root Directory** = `backend`
- Vercel > **Settings** > **Root Directory** = `frontend`

### Backend não inicia
- Verifique logs no Railway
- Confirme que migrations rodaram: `railway run npx prisma migrate deploy`

---

## 🔄 Atualizações Futuras

Sempre que fizer alterações:

```bash
# Fazer commit
git add .
git commit -m "Descrição da alteração"
git push

# Railway e Vercel farão redeploy automático
```

---

## 💰 Custos

- **Vercel:** GRÁTIS (100GB bandwidth/mês)
- **Railway:** GRÁTIS ($5 crédito/mês, ~500 horas)
- **Supabase:** GRÁTIS (500MB database)

**Total: R$ 0,00/mês** 🎉

---

## 📞 Suporte

- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/docs

---

**✅ Deploy Completo! Seu sistema está no ar! 🚀**
