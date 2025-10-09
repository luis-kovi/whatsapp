# 🔧 CORREÇÃO URGENTE - Railway Environment Variables

## Problema
Erro: `prepared statement "s0" already exists`
Causa: Supabase Connection Pooler não suporta prepared statements do Prisma

## Solução

### No Railway, atualize a variável DATABASE_URL:

**ANTES:**
```
DATABASE_URL=postgresql://postgres.tbqsqcyqkszjklcwcezv:Outubro101088@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

**DEPOIS (adicione `?pgbouncer=true&connection_limit=1`):**
```
DATABASE_URL=postgresql://postgres.tbqsqcyqkszjklcwcezv:Outubro101088@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Passos:
1. Acesse Railway: https://railway.app
2. Clique no serviço **backend**
3. Vá em **Variables**
4. Edite `DATABASE_URL` e adicione `?pgbouncer=true&connection_limit=1` no final
5. Clique em **Deploy** (ou aguarde redeploy automático)

### Variáveis finais corretas:
```env
DATABASE_URL=postgresql://postgres.tbqsqcyqkszjklcwcezv:Outubro101088@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

DIRECT_URL=postgresql://postgres:Outubro101088@db.tbqsqcyqkszjklcwcezv.supabase.co:5432/postgres

JWT_SECRET=seu-super-secret-jwt-key-mude-isso-em-producao-12345

JWT_REFRESH_SECRET=seu-super-secret-refresh-key-mude-isso-em-producao-67890

NODE_ENV=production

PORT=3001
```

## Referência
- https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#pgbouncer
- https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
