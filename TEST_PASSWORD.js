// Teste rápido para verificar se a senha bcrypt está correta
const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

bcrypt.compare(password, hash).then(result => {
  console.log('Senha correta?', result);
});

// Gerar novo hash
bcrypt.hash(password, 10).then(newHash => {
  console.log('Novo hash:', newHash);
});
