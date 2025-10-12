import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { emitToAll } from '../services/socket.service';
import { sendWhatsAppMessage } from '../services/whatsapp.service';

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { ticketId, body, mediaUrl, mediaType } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { contact: true }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    await sendWhatsAppMessage(ticket.connectionId, ticket.contact.phoneNumber, body, mediaUrl, mediaType);

    const message = await prisma.message.create({
      data: {
        ticketId,
        userId: req.userId,
        connectionId: ticket.connectionId,
        body,
        mediaUrl,
        mediaType,
        fromMe: true,
        status: 'SENT'
      }
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { lastMessageAt: new Date() }
    });

    emitToAll('message:new', message);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};
