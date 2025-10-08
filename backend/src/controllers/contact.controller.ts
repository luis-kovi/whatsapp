import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({ include: { contactTags: { include: { tag: true } } } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
};
