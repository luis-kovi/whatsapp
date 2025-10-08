import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getConnections = async (req: Request, res: Response) => {
  try {
    const connections = await prisma.whatsAppConnection.findMany();
    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar conexões' });
  }
};

export const createConnection = async (req: Request, res: Response) => {
  try {
    const connection = await prisma.whatsAppConnection.create({
      data: { name: req.body.name }
    });
    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conexão' });
  }
};
