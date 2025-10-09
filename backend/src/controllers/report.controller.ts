import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../utils/prisma';

export const exportReport = async (req: AuthRequest, res: Response) => {
  try {
    const { dateFrom, dateTo, type } = req.query;

    const where: any = {};
    if (dateFrom) where.createdAt = { gte: new Date(dateFrom as string) };
    if (dateTo) where.createdAt = { ...where.createdAt, lte: new Date(dateTo as string) };

    let data: any = {};

    switch (type) {
      case 'general':
        data = await prisma.ticket.groupBy({
          by: ['status'],
          _count: true,
          where
        });
        break;

      case 'agents':
        data = await prisma.ticket.groupBy({
          by: ['userId'],
          _count: true,
          where: { ...where, userId: { not: null } }
        });
        break;

      case 'queues':
        data = await prisma.ticket.groupBy({
          by: ['queueId'],
          _count: true,
          where: { ...where, queueId: { not: null } }
        });
        break;

      case 'satisfaction':
        data = await prisma.rating.findMany({
          where: {
            createdAt: where.createdAt
          },
          include: {
            ticket: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        });
        break;
    }

    res.json({ data, type, dateFrom, dateTo });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};
