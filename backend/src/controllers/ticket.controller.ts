import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { emitToAll, emitToUser } from '../services/socket.service';

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const { status, queueId, userId } = req.query;
    const userRole = req.userRole;

    const where: any = {};
    
    if (status) where.status = status;
    if (queueId) where.queueId = queueId;
    if (userRole === 'AGENT') where.userId = req.userId;
    else if (userId) where.userId = userId;

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        contact: true,
        user: { select: { id: true, name: true, avatar: true } },
        queue: true,
        ticketTags: { include: { tag: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tickets' });
  }
};

export const getTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        contact: true,
        user: { select: { id: true, name: true, avatar: true } },
        queue: true,
        ticketTags: { include: { tag: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ticket' });
  }
};

export const acceptTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        userId: req.userId,
        status: 'OPEN'
      },
      include: {
        contact: true,
        user: { select: { id: true, name: true, avatar: true } },
        queue: true
      }
    });

    emitToAll('ticket:update', ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aceitar ticket' });
  }
};

export const closeTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date()
      },
      include: {
        contact: true,
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    emitToAll('ticket:update', ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fechar ticket' });
  }
};

export const transferTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, queueId } = req.body;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        userId: userId || null,
        queueId: queueId || undefined,
        status: userId ? 'OPEN' : 'PENDING'
      },
      include: {
        contact: true,
        user: { select: { id: true, name: true, avatar: true } },
        queue: true
      }
    });

    await prisma.transfer.create({
      data: {
        ticketId: id,
        fromUserId: req.userId,
        toUserId: userId
      }
    });

    if (userId) {
      emitToUser(userId, 'ticket:transfer', ticket);
    }
    emitToAll('ticket:update', ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao transferir ticket' });
  }
};
