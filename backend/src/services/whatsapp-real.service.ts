import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { prisma } from '../utils/prisma';
import { emitToAll } from './socket.service';
import qrcode from 'qrcode';

interface WhatsAppSession {
  id: string;
  client: Client;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR_CODE';
  qrCode?: string;
}

const sessions = new Map<string, WhatsAppSession>();

export const initWhatsAppSession = async (connectionId: string) => {
  try {
    const connection = await prisma.whatsAppConnection.findUnique({ where: { id: connectionId } });
    if (!connection) throw new Error('Connection not found');

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: connectionId }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    const session: WhatsAppSession = {
      id: connectionId,
      client,
      status: 'CONNECTING'
    };

    sessions.set(connectionId, session);

    client.on('qr', async (qr) => {
      session.status = 'QR_CODE';
      session.qrCode = await qrcode.toDataURL(qr);
      
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: { status: 'QR_CODE', qrCode: session.qrCode }
      });
      
      emitToAll('whatsapp:qrcode', { connectionId, qrCode: session.qrCode });
    });

    client.on('ready', async () => {
      session.status = 'CONNECTED';
      const info = client.info;
      const phoneNumber = info.wid.user;
      
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: { status: 'CONNECTED', phoneNumber, qrCode: null }
      });
      
      emitToAll('whatsapp:connected', { connectionId, phoneNumber });
    });

    client.on('disconnected', async () => {
      session.status = 'DISCONNECTED';
      sessions.delete(connectionId);
      
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: { status: 'DISCONNECTED', qrCode: null }
      });
      
      emitToAll('whatsapp:disconnected', { connectionId });
    });

    client.on('message', async (msg: Message) => {
      if (msg.fromMe) return;

      const phoneNumber = msg.from.split('@')[0];
      
      let contact = await prisma.contact.findUnique({ where: { phoneNumber } });
      if (!contact) {
        const contactInfo = await msg.getContact();
        contact = await prisma.contact.create({
          data: {
            name: contactInfo.pushname || phoneNumber,
            phoneNumber
          }
        });
      }

      let ticket = await prisma.ticket.findFirst({
        where: {
          contactId: contact.id,
          connectionId,
          status: { in: ['PENDING', 'OPEN'] }
        }
      });

      if (!ticket) {
        ticket = await prisma.ticket.create({
          data: {
            contactId: contact.id,
            connectionId,
            status: 'PENDING',
            lastMessageAt: new Date()
          },
          include: { contact: true, queue: true }
        });
        emitToAll('ticket:new', ticket);
      }

      const message = await prisma.message.create({
        data: {
          ticketId: ticket.id,
          connectionId,
          body: msg.body,
          fromMe: false,
          status: 'RECEIVED',
          timestamp: new Date(msg.timestamp * 1000)
        }
      });

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          lastMessageAt: new Date(),
          unreadMessages: { increment: 1 }
        }
      });

      emitToAll('message:new', { ticketId: ticket.id, message });
    });

    await client.initialize();
    return session;
  } catch (error) {
    console.error('Error initializing WhatsApp session:', error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (connectionId: string, phoneNumber: string, message: string) => {
  const session = sessions.get(connectionId);
  if (!session || session.status !== 'CONNECTED') {
    throw new Error('WhatsApp not connected');
  }

  const chatId = `${phoneNumber}@c.us`;
  await session.client.sendMessage(chatId, message);
};

export const disconnectWhatsApp = async (connectionId: string) => {
  const session = sessions.get(connectionId);
  if (session?.client) {
    await session.client.destroy();
    sessions.delete(connectionId);
  }
  
  await prisma.whatsAppConnection.update({
    where: { id: connectionId },
    data: { status: 'DISCONNECTED', qrCode: null }
  });
  
  emitToAll('whatsapp:disconnected', { connectionId });
};

export const getSession = (connectionId: string) => sessions.get(connectionId);
