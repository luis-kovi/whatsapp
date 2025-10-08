import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@whatsapp.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@whatsapp.com',
      password: hashedPassword,
      role: 'ADMIN',
      maxTickets: 10
    }
  });

  const queue = await prisma.queue.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Suporte',
      color: '#3b82f6',
      description: 'Fila de suporte geral',
      greetingMessage: 'Olá! Bem-vindo ao nosso atendimento.'
    }
  });

  console.log('✅ Seed concluído!');
  console.log('Admin:', admin.email, '/ Senha: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
