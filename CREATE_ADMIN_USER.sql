-- Execute este SQL no Supabase SQL Editor para criar o usuário admin
-- Senha: admin123

INSERT INTO "users" (id, name, email, password, role, "maxTickets", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'admin@whatsapp.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'ADMIN',
  999,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT id, name, email, role, "isActive" FROM users WHERE email = 'admin@whatsapp.com';
