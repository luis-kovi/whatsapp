import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket, getAggregateVotesInPollMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';
import { prisma } from '../utils/prisma';
import { emitToAll } from './socket.service';
import path from 'path';
import fs from 'fs';

interface WhatsAppSession {
  id: string;
  socket: WASocket | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR_CODE';
  qrCode?: string;
}

const sessions = new Map<string, WhatsAppSession>();
const AUTH_DIR = path.join(process.cwd(), 'auth_sessions');

if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

export const initWhatsAppSession = async (connectionId: string) => {
  try {
    const connection = await prisma.whatsAppConnection.findUnique({ where: { id: connectionId } });
    if (!connection) throw new Error('Connection not found');

    const sessionPath = path.join(AUTH_DIR, connectionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const session: WhatsAppSession = {
      id: connectionId,
      socket: null,
      status: 'CONNECTING'
    };

    sessions.set(connectionId, session);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      defaultQueryTimeoutMs: undefined,
    });

    session.socket = sock;

    sock.ev.on('connection.update', async (update) => {
      const { connection: connStatus, lastDisconnect, qr } = update;

      if (qr) {
        session.status = 'QR_CODE';
        session.qrCode = await qrcode.toDataURL(qr);
        
        await prisma.whatsAppConnection.update({
          where: { id: connectionId },
          data: { status: 'QR_CODE', qrCode: session.qrCode }
        });
        
        emitToAll('whatsapp:qrcode', { connectionId, qrCode: session.qrCode });
      }

      if (connStatus === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          setTimeout(() => initWhatsAppSession(connectionId), 3000);
        } else {
          session.status = 'DISCONNECTED';
          sessions.delete(connectionId);
          
          await prisma.whatsAppConnection.update({
            where: { id: connectionId },
            data: { status: 'DISCONNECTED', qrCode: null }
          });
          
          emitToAll('whatsapp:disconnected', { connectionId });
        }
      } else if (connStatus === 'open') {
        session.status = 'CONNECTED';
        const phoneNumber = sock.user?.id.split(':')[0] || '';
        
        await prisma.whatsAppConnection.update({
          where: { id: connectionId },
          data: { status: 'CONNECTED', phoneNumber, qrCode: null }
        });
        
        emitToAll('whatsapp:connected', { connectionId, phoneNumber });
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;

        const phoneNumber = msg.key.remoteJid?.split('@')[0] || '';
        if (!phoneNumber) continue;

        let contact = await prisma.contact.findUnique({ where: { phoneNumber } });
        if (!contact) {
          let avatar = '';
          try {
            const profilePic = await sock.profilePictureUrl(msg.key.remoteJid!, 'image');
            avatar = profilePic || '';
          } catch (e) {
            console.log('No profile picture available');
          }

          contact = await prisma.contact.create({
            data: {
              name: msg.pushName || phoneNumber,
              phoneNumber,
              avatar
            }
          });
        } else if (!contact.avatar) {
          try {
            const profilePic = await sock.profilePictureUrl(msg.key.remoteJid!, 'image');
            if (profilePic) {
              await prisma.contact.update({
                where: { id: contact.id },
                data: { avatar: profilePic }
              });
              contact.avatar = profilePic;
            }
          } catch (e) {
            console.log('No profile picture available');
          }
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

        const messageText = msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.imageMessage?.caption || 
                           msg.message.videoMessage?.caption || 
                           msg.message.documentMessage?.caption || '';

        let mediaUrl = '';
        let mediaType = '';

        if (msg.message.imageMessage) {
          mediaType = 'image';
          mediaUrl = msg.message.imageMessage.url || '';
        } else if (msg.message.videoMessage) {
          mediaType = 'video';
          mediaUrl = msg.message.videoMessage.url || '';
        } else if (msg.message.audioMessage) {
          mediaType = 'audio';
          mediaUrl = msg.message.audioMessage.url || '';
        } else if (msg.message.documentMessage) {
          mediaType = 'document';
          mediaUrl = msg.message.documentMessage.url || '';
        }

        const message = await prisma.message.create({
          data: {
            ticketId: ticket.id,
            connectionId,
            body: messageText || `[${mediaType}]`,
            mediaUrl,
            mediaType,
            fromMe: false,
            status: 'RECEIVED',
            timestamp: new Date(msg.messageTimestamp as number * 1000)
          }
        });

        await prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            lastMessageAt: new Date(),
            unreadMessages: { increment: 1 }
          }
        });

        console.log('📨 Emitting message:new', { ticketId: ticket.id, messageId: message.id });
        emitToAll('message:new', { ticketId: ticket.id, message });
      }
    });

    return session;
  } catch (error) {
    console.error('Error initializing WhatsApp session:', error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (connectionId: string, phoneNumber: string, message: string, mediaUrl?: string, mediaType?: string) => {
  const session = sessions.get(connectionId);
  if (!session?.socket || session.status !== 'CONNECTED') {
    throw new Error('WhatsApp not connected');
  }

  const jid = `${phoneNumber}@s.whatsapp.net`;
  
  if (mediaUrl && mediaType) {
    if (mediaType === 'image') {
      await session.socket.sendMessage(jid, { image: { url: mediaUrl }, caption: message });
    } else if (mediaType === 'video') {
      await session.socket.sendMessage(jid, { video: { url: mediaUrl }, caption: message });
    } else if (mediaType === 'audio') {
      await session.socket.sendMessage(jid, { audio: { url: mediaUrl }, mimetype: 'audio/mp4' });
    } else if (mediaType === 'document') {
      await session.socket.sendMessage(jid, { document: { url: mediaUrl }, mimetype: 'application/pdf', caption: message });
    }
  } else {
    await session.socket.sendMessage(jid, { text: message });
  }
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
  
  emitToAll('whatsapp:disconnected', { connectionId });
};

export const getSession = (connectionId: string) => sessions.get(connectionId);
