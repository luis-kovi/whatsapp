import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const tag = await prisma.tag.create({ data: req.body });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tag' });
  }
};
