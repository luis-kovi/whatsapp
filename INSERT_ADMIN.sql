-- Copie e cole este SQL no Supabase SQL Editor
-- Clique em "New Query" e cole tudo de uma vez

DELETE FROM users WHERE email = 'admin@whatsapp.com';

INSERT INTO users (id, name, email, password, role, "maxTickets", "isActive", "createdAt", "updatedAt")
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
);

SELECT * FROM users WHERE email = 'admin@whatsapp.com';
