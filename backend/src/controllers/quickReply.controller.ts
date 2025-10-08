import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getQuickReplies = async (req: Request, res: Response) => {
  try {
    const replies = await prisma.quickReply.findMany();
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar respostas rápidas' });
  }
};

export const createQuickReply = async (req: Request, res: Response) => {
  try {
    const reply = await prisma.quickReply.create({ data: req.body });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar resposta rápida' });
  }
};
