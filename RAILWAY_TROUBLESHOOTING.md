# 🔧 Railway Troubleshooting

## ❌ Erro: "npm ci requires package-lock.json"

### Solução
✅ **Corrigido na versão atual!**

O projeto agora usa `npm install` em vez de `npm ci` e inclui:
- Script `postinstall` para gerar Prisma Client
- `prisma` e `typescript` em dependencies
- Configuração `nixpacks.toml`

### Se ainda ocorrer:
1. Verifique se está usando a versão mais recente do código
2. No Railway, vá em **Settings** > **Root Directory** = `backend`
3. Deixe **Build Command** vazio (usa padrão)
4. **Start Command** = `npm start`

---

## ❌ Erro: "Prisma Client not generated"

### Solução
```bash
# O script postinstall deve gerar automaticamente
# Se não funcionar, adicione no Build Command:
npm install && npx prisma generate && npm run build
```

---

## ❌ Erro: "Cannot find module 'typescript'"

### Solução
✅ **Corrigido!** TypeScript agora está em `dependencies`.

Se ainda ocorrer:
1. Verifique `package.json` - `typescript` deve estar em `dependencies`
2. Force rebuild no Railway

---

## ❌ Erro: "Port already in use"

### Solução
Railway define a variável `PORT` automaticamente. Certifique-se:

```env
PORT=3001  # Pode remover, Railway define automaticamente
```

---

## ❌ Erro: "Database connection failed"

### Solução
1. Verifique variáveis de ambiente no Railway:
   - `DATABASE_URL` - URL do Supabase
   - `DIRECT_URL` - URL direta do Supabase

2. Teste conexão:
```bash
# No Supabase, vá em Settings > Database
# Copie Connection String e Direct Connection
```

---

## ❌ Erro: "Module not found: @whiskeysockets/baileys"

### Solução
```bash
# Certifique-se que está em dependencies:
npm install @whiskeysockets/baileys @hapi/boom pino
```

---

## ✅ Configuração Correta do Railway

### Settings
- **Root Directory**: `backend`
- **Build Command**: (vazio)
- **Start Command**: `npm start`

### Variables
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=sua_chave_secreta
JWT_REFRESH_SECRET=sua_chave_refresh
NODE_ENV=production
PORT=3001
```

### Networking
- Gerar domínio público
- Copiar URL para usar no frontend

---

## 🔍 Como Ver Logs

### Via CLI
```bash
railway login
railway link
railway logs
```

### Via Dashboard
1. Acesse projeto no Railway
2. Clique em **Deployments**
3. Clique no deploy ativo
4. Veja logs em tempo real

---

## 🚀 Forçar Redeploy

### Opção 1: Via Git
```bash
git commit --allow-empty -m "trigger deploy"
git push origin main
```

### Opção 2: Via Dashboard
1. Vá em **Deployments**
2. Clique nos 3 pontos
3. **Redeploy**

---

## 📊 Verificar Status

### Health Check
```bash
curl https://seu-app.railway.app/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX..."
}
```

### API Status
```bash
curl https://seu-app.railway.app/
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "WhatsApp Manager API"
}
```

---

## 🐛 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| Build failed | Falta dependência | Verificar package.json |
| Start failed | Porta errada | Usar variável PORT |
| DB error | URL incorreta | Verificar DATABASE_URL |
| Prisma error | Client não gerado | Adicionar postinstall |
| Module not found | Dep em devDependencies | Mover para dependencies |

---

## 💡 Dicas

### 1. Use Nixpacks
Railway detecta automaticamente projetos Node.js com `nixpacks.toml`.

### 2. Variáveis de Ambiente
Sempre use variáveis de ambiente, nunca hardcode valores.

### 3. Logs
Monitore logs durante deploy para identificar problemas rapidamente.

### 4. Health Check
Implemente endpoints de health check para monitoramento.

### 5. Backup
Sempre tenha backup do banco de dados antes de fazer migrations.

---

## 📞 Suporte

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: Abra uma issue no repositório

---

**Última atualização**: Janeiro 2024
