import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { prisma } from '../utils/prisma';
import { emitToAll } from './socket.service';
import path from 'path';

interface WhatsAppSession {
  id: string;
  socket: WASocket | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR_CODE';
  qrCode?: string;
  retries: number;
}

const sessions = new Map<string, WhatsAppSession>();

export const initWhatsAppSession = async (connectionId: string) => {
  try {
    const connection = await prisma.whatsAppConnection.findUnique({ where: { id: connectionId } });
    if (!connection) throw new Error('Connection not found');

    const authPath = path.join(__dirname, '../../.wwebjs_auth', connectionId);
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    const session: WhatsAppSession = {
      id: connectionId,
      socket,
      status: 'CONNECTING',
      retries: 0
    };

    sessions.set(connectionId, session);

    socket.ev.on('connection.update', async (update) => {
      const { connection: connStatus, lastDisconnect, qr } = update;

      if (qr) {
        session.status = 'QR_CODE';
        session.qrCode = qr;
        await prisma.whatsAppConnection.update({
          where: { id: connectionId },
          data: { status: 'QR_CODE', qrCode: qr }
        });
        emitToAll('whatsapp:qrcode', { connectionId, qrCode: qr });
      }

      if (connStatus === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect && session.retries < 5) {
          session.retries++;
          setTimeout(() => initWhatsAppSession(connectionId), 3000);
        } else {
          session.status = 'DISCONNECTED';
          await prisma.whatsAppConnection.update({
            where: { id: connectionId },
            data: { status: 'DISCONNECTED', qrCode: null }
          });
          emitToAll('whatsapp:disconnected', { connectionId });
        }
      }

      if (connStatus === 'open') {
        session.status = 'CONNECTED';
        session.retries = 0;
        const phoneNumber = socket.user?.id.split(':')[0];
        await prisma.whatsAppConnection.update({
          where: { id: connectionId },
          data: { status: 'CONNECTED', phoneNumber, qrCode: null }
        });
        emitToAll('whatsapp:connected', { connectionId, phoneNumber });
      }
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;

        const phoneNumber = msg.key.remoteJid?.split('@')[0];
        if (!phoneNumber) continue;

        let contact = await prisma.contact.findUnique({ where: { phoneNumber } });
        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              name: msg.pushName || phoneNumber,
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
            body: msg.message.conversation || msg.message.extendedTextMessage?.text || '',
            fromMe: false,
            status: 'RECEIVED',
            timestamp: new Date(msg.messageTimestamp! * 1000)
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
      }
    });

    return session;
  } catch (error) {
    console.error('Error initializing WhatsApp session:', error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (connectionId: string, phoneNumber: string, message: string) => {
  const session = sessions.get(connectionId);
  if (!session || !session.socket || session.status !== 'CONNECTED') {
    throw new Error('WhatsApp not connected');
  }

  const jid = `${phoneNumber}@s.whatsapp.net`;
  await session.socket.sendMessage(jid, { text: message });
};

export const disconnectWhatsApp = async (connectionId: string) => {
  const session = sessions.get(connectionId);
  if (session?.socket) {
    await session.socket.logout();
    sessions.delete(connectionId);
  }
  await prisma.whatsAppConnection.update({
    where: { id: connectionId },
    data: { status: 'DISCONNECTED', qrCode: null }
  });
};

export const getSession = (connectionId: string) => sessions.get(connectionId);
