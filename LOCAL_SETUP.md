# 🖥️ Guia Completo - Rodar Localmente com WhatsApp Real

## 📋 Pré-requisitos

### Obrigatórios
- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Verificar instalação
```bash
node --version  # Deve ser 20.x ou superior
npm --version   # Deve ser 10.x ou superior
psql --version  # Qualquer versão recente
```

---

## 🚀 Passo a Passo

### 1. Clonar o Repositório
```bash
git clone https://github.com/luis-kovi/whatsapp.git
cd whatsapp
```

### 2. Configurar Banco de Dados PostgreSQL

#### Opção A: PostgreSQL Local
```bash
# Criar banco de dados
psql -U postgres
CREATE DATABASE whatsapp_local;
\q
```

#### Opção B: Docker (mais fácil)
```bash
docker run --name postgres-whatsapp -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=whatsapp_local -p 5432:5432 -d postgres:15
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac
```

#### Editar `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/whatsapp_local
REDIS_URL=redis://localhost:6379
JWT_SECRET=meu-secret-local-123
JWT_REFRESH_SECRET=meu-refresh-secret-local-456
PORT=3001
NODE_ENV=development
```

#### Ativar WhatsApp Real:
Editar `backend/src/controllers/whatsapp.controller.ts`:
```typescript
// Trocar esta linha:
import { initWhatsAppSession, disconnectWhatsApp, getSession } from '../services/whatsapp-mock.service';

// Por esta:
import { initWhatsAppSession, disconnectWhatsApp, getSession } from '../services/whatsapp-real.service';
```

Editar `backend/src/controllers/message.controller.ts`:
```typescript
// Trocar esta linha:
import { sendWhatsAppMessage } from '../services/whatsapp-mock.service';

// Por esta:
import { sendWhatsAppMessage } from '../services/whatsapp-real.service';
```

#### Rodar migrations e seed:
```bash
npx prisma migrate dev
npx prisma db seed
```

#### Iniciar backend:
```bash
npm run dev
```

✅ Backend rodando em: http://localhost:3001

### 4. Configurar Frontend

**Abrir novo terminal:**

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
copy .env.example .env.local  # Windows
# ou
cp .env.example .env.local    # Linux/Mac
```

#### Editar `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

#### Iniciar frontend:
```bash
npm run dev
```

✅ Frontend rodando em: http://localhost:3000

---

## 📱 Conectar WhatsApp

1. **Acessar:** http://localhost:3000
2. **Login:** admin@whatsapp.com / admin123
3. **Ir para:** Menu > WhatsApp
4. **Criar Conexão:** Clique em "Nova Conexão"
5. **Conectar:** Clique em "Conectar"
6. **Aguardar QR Code:** Aparecerá em ~10 segundos
7. **Escanear:** Abra WhatsApp no celular > Aparelhos Conectados > Escanear QR Code
8. **Pronto!** Status mudará para "Conectado"

---

## ⚠️ Limitações

### Técnicas
- **1 número por conexão** - Cada conexão = 1 WhatsApp
- **Sessão local** - Dados salvos em `.wwebjs_auth/`
- **Chromium necessário** - Baixado automaticamente pelo Puppeteer
- **RAM mínima:** 512MB por conexão
- **Não funciona em servidor sem GUI** - Precisa de ambiente gráfico

### Funcionais
- **Sem mensagens em massa** - WhatsApp pode banir
- **Limite de mensagens** - ~1000 mensagens/dia (não oficial)
- **Conexão instável** - Pode cair e precisar reconectar
- **Sem garantias** - WhatsApp pode bloquear uso não oficial

### Legais
- **Termos de Serviço** - Uso não oficial viola ToS do WhatsApp
- **Risco de ban** - WhatsApp pode banir o número
- **Sem suporte oficial** - WhatsApp não dá suporte

---

## 🔧 Troubleshooting

### Erro: "Chromium not found"
```bash
cd backend
npx puppeteer browsers install chrome
```

### Erro: "Connection refused" no PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
# Windows:
services.msc  # Procurar por PostgreSQL

# Linux/Mac:
sudo systemctl status postgresql
```

### Erro: "Port 3001 already in use"
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3001 | xargs kill -9
```

### QR Code não aparece
- Aguardar 30 segundos
- Verificar logs do backend
- Reiniciar backend
- Limpar pasta `.wwebjs_auth/`

### Sessão desconecta sozinha
- Normal após algumas horas
- Reconectar manualmente
- Implementar auto-reconexão (avançado)

---

## 📊 Estrutura de Arquivos Locais

```
whatsapp/
├── backend/
│   ├── .wwebjs_auth/          # Sessões WhatsApp (não commitar!)
│   │   └── session-{id}/
│   ├── .env                    # Configurações locais
│   └── node_modules/
├── frontend/
│   ├── .env.local              # Configurações locais
│   └── node_modules/
└── .gitignore                  # Já ignora .wwebjs_auth
```

---

## 🎯 Próximos Passos

### Para Produção
1. **Usar VPS** - DigitalOcean, AWS, Linode
2. **PM2** - Gerenciador de processos
3. **Nginx** - Proxy reverso
4. **SSL** - Certificado HTTPS
5. **Backup** - Sessões e banco de dados

### Alternativas Profissionais
1. **WhatsApp Business API** - Oficial, pago, estável
2. **Evolution API** - Open source, mais robusto
3. **Twilio** - Serviço pago com suporte

---

## 💡 Dicas

- **Desenvolvimento:** Use mock service
- **Testes:** Use número secundário
- **Produção:** Use API oficial
- **Backup:** Copie `.wwebjs_auth/` regularmente
- **Logs:** Monitore console do backend
- **Performance:** 1 conexão = ~200MB RAM

---

## ✅ Checklist Rápido

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL rodando
- [ ] Backend `.env` configurado
- [ ] Frontend `.env.local` configurado
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 3000)
- [ ] WhatsApp real service ativado
- [ ] Login funcionando
- [ ] QR Code aparecendo
- [ ] WhatsApp conectado

---

**🎉 Pronto! Seu sistema está rodando localmente com WhatsApp real!**
