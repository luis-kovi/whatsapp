# ✅ Checklist de Deploy - WhatsApp Manager v2.0

## 📋 Antes do Deploy

### 1. Supabase (Banco de Dados)
- [ ] Criar projeto no Supabase
- [ ] Copiar DATABASE_URL
- [ ] Copiar DIRECT_URL
- [ ] Executar migrations: `npx prisma migrate deploy`
- [ ] Executar seed: `npx prisma db seed`

### 2. Railway (Backend)
- [ ] Criar projeto no Railway
- [ ] Conectar repositório GitHub
- [ ] Configurar Root Directory: `backend`
- [ ] Adicionar variáveis de ambiente:
  - [ ] DATABASE_URL
  - [ ] DIRECT_URL
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] PORT=3001
  - [ ] NODE_ENV=production
- [ ] Gerar domínio público
- [ ] Copiar URL do backend

### 3. Vercel (Frontend)
- [ ] Criar projeto no Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar Root Directory: `frontend`
- [ ] Adicionar variáveis de ambiente:
  - [ ] NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api
  - [ ] NEXT_PUBLIC_WS_URL=wss://seu-backend.railway.app
- [ ] Deploy

## 🚀 Após o Deploy

### 4. Testar Backend
- [ ] Acessar https://seu-backend.railway.app
- [ ] Verificar resposta: `{"status":"ok","message":"WhatsApp Manager API"}`
- [ ] Testar health check: https://seu-backend.railway.app/health

### 5. Testar Frontend
- [ ] Acessar https://seu-app.vercel.app
- [ ] Fazer login (admin@whatsapp.com / admin123)
- [ ] Verificar se carrega dashboard

### 6. Testar WhatsApp
- [ ] Ir em menu "WhatsApp"
- [ ] Criar nova conexão
- [ ] Clicar em "Conectar"
- [ ] Aguardar QR Code (10-15 segundos)
- [ ] Escanear QR Code no celular
- [ ] Verificar status "Conectado"

### 7. Testar Mensagens
- [ ] Enviar mensagem para o número conectado
- [ ] Verificar se ticket foi criado
- [ ] Ir em "Tickets"
- [ ] Aceitar ticket
- [ ] Responder mensagem
- [ ] Verificar se chegou no WhatsApp

## 🔧 Configurações Adicionais

### 8. Segurança
- [ ] Alterar senha do admin
- [ ] Criar usuários reais
- [ ] Configurar filas
- [ ] Configurar tags
- [ ] Adicionar respostas rápidas

### 9. Monitoramento
- [ ] Verificar logs no Railway
- [ ] Verificar métricas no Vercel
- [ ] Testar reconexão após restart

### 10. Backup
- [ ] Configurar backup automático no Supabase
- [ ] Documentar credenciais em local seguro
- [ ] Testar restore de backup

## 📊 Métricas de Sucesso

- [ ] Backend respondendo em < 500ms
- [ ] Frontend carregando em < 2s
- [ ] WhatsApp conectando em < 15s
- [ ] Mensagens chegando em tempo real
- [ ] Zero erros nos logs

## 🐛 Troubleshooting

### Backend não inicia
1. Verificar variáveis de ambiente
2. Verificar logs: `railway logs`
3. Testar conexão com Supabase

### Frontend não conecta
1. Verificar NEXT_PUBLIC_API_URL
2. Testar URL do backend no navegador
3. Verificar CORS no backend

### WhatsApp não conecta
1. Aguardar 15 segundos
2. Verificar logs no Railway
3. Tentar desconectar e reconectar
4. Verificar se auth_sessions/ existe

### Mensagens não chegam
1. Verificar status da conexão
2. Testar enviando do celular
3. Verificar logs de erro
4. Verificar Socket.io conectado

## 📞 Suporte

- **Documentação**: Ver WHATSAPP_REAL_INTEGRATION.md
- **Deploy**: Ver RAILWAY_SETUP.md
- **Issues**: Abrir issue no GitHub

---

**Última atualização**: 2024-01-XX
