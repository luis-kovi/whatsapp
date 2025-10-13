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

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const firstName = user?.name.split(' ')[0] || 'Atendente';
    const formattedMessage = `*${firstName} - Kovi:*\n\n${body}`;

    await sendWhatsAppMessage(ticket.connectionId, ticket.contact.phoneNumber, formattedMessage, mediaUrl, mediaType);

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

    emitToAll('message:new', { ticketId, message });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};
