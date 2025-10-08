import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getQueues = async (req: Request, res: Response) => {
  try {
    const queues = await prisma.queue.findMany({
      include: { queueUsers: { include: { user: { select: { id: true, name: true } } } } }
    });
    res.json(queues);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filas' });
  }
};

export const createQueue = async (req: Request, res: Response) => {
  try {
    const queue = await prisma.queue.create({ data: req.body });
    res.status(201).json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fila' });
  }
};

export const updateQueue = async (req: Request, res: Response) => {
  try {
    const queue = await prisma.queue.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fila' });
  }
};

export const deleteQueue = async (req: Request, res: Response) => {
  try {
    await prisma.queue.delete({ where: { id: req.params.id } });
    res.json({ message: 'Fila excluída' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fila' });
  }
};
