-- Execute este SQL no Supabase SQL Editor
-- Atualiza a senha do admin com o hash correto gerado pelo backend

UPDATE users 
SET password = '$2a$10$FnQnVhL362K0O772bWnJP.8ODVUcoLgtUnfe.rLMXylzQeFuM1Yna'
WHERE email = 'admin@whatsapp.com';

-- Verificar se foi atualizado
SELECT id, email, password, "isActive" FROM users WHERE email = 'admin@whatsapp.com';
