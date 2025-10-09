import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/hash/:password', async (req, res) => {
  const hash = await bcrypt.hash(req.params.password, 10);
  res.json({ password: req.params.password, hash });
});

router.get('/test-user', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: 'admin@whatsapp.com' } });
  res.json({ exists: !!user, user: user ? { id: user.id, email: user.email, isActive: user.isActive } : null });
});

router.post('/test-login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return res.json({ error: 'User not found' });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  res.json({ 
    userExists: true, 
    passwordMatch: valid,
    storedHash: user.password,
    isActive: user.isActive
  });
});

export default router;
