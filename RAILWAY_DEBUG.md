# Debug Railway - Rotas WhatsApp 404

## Problema
Rota `/api/whatsapp/connections/:id/start` retorna 404

## Verificações

1. **Testar se API está rodando:**
   ```
   https://whatsapp-production-685a.up.railway.app/
   ```
   Deve retornar: `{"status":"ok","message":"WhatsApp Manager API"}`

2. **Testar rota de conexões:**
   ```
   https://whatsapp-production-685a.up.railway.app/api/whatsapp/connections
   ```
   Deve retornar lista de conexões (precisa de token)

3. **Verificar logs do Railway:**
   - Procurar por "✅ WhatsApp routes loaded"
   - Verificar se há erros de compilação TypeScript

## Possíveis Causas

1. **Build não completou** - Railway pode estar usando build antigo
2. **Erro de TypeScript** - Arquivo whatsapp-mock.service.ts pode ter erro
3. **Cache do Railway** - Precisa limpar cache

## Solução Temporária

Se continuar com 404, usar rota de debug:
```
https://whatsapp-production-685a.up.railway.app/api/debug/test-user
```

Se debug funciona mas whatsapp não, o problema é específico das rotas WhatsApp.
