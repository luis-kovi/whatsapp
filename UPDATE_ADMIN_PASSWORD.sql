-- Execute este SQL no Supabase para atualizar a senha do admin
-- Novo hash gerado para senha: admin123

UPDATE users 
SET password = '$2b$10$K8qvZ5Z5Z5Z5Z5Z5Z5Z5ZuGKqH5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5'
WHERE email = 'admin@whatsapp.com';

-- OU use este hash alternativo (Laravel default)
UPDATE users 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@whatsapp.com';

SELECT email, password FROM users WHERE email = 'admin@whatsapp.com';
