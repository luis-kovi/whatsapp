import { prisma } from '../utils/prisma';
import { emitToAll } from './socket.service';

interface WhatsAppSession {
  id: string;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR_CODE';
  qrCode?: string;
}

const sessions = new Map<string, WhatsAppSession>();

export const initWhatsAppSession = async (connectionId: string) => {
  try {
    const connection = await prisma.whatsAppConnection.findUnique({ where: { id: connectionId } });
    if (!connection) throw new Error('Connection not found');

    const session: WhatsAppSession = {
      id: connectionId,
      status: 'QR_CODE',
      qrCode: `whatsapp-qr-${connectionId}-${Date.now()}`
    };

    sessions.set(connectionId, session);

    await prisma.whatsAppConnection.update({
      where: { id: connectionId },
      data: { status: 'QR_CODE', qrCode: session.qrCode }
    });

    emitToAll('whatsapp:qrcode', { connectionId, qrCode: session.qrCode });

    setTimeout(async () => {
      session.status = 'CONNECTED';
      const phoneNumber = `55${Math.floor(Math.random() * 10000000000)}`;
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: { status: 'CONNECTED', phoneNumber, qrCode: null }
      });
      emitToAll('whatsapp:connected', { connectionId, phoneNumber });
    }, 5000);

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
  console.log(`[MOCK] Sending message to ${phoneNumber}: ${message}`);
};

export const disconnectWhatsApp = async (connectionId: string) => {
  sessions.delete(connectionId);
  await prisma.whatsAppConnection.update({
    where: { id: connectionId },
    data: { status: 'DISCONNECTED', qrCode: null }
  });
  emitToAll('whatsapp:disconnected', { connectionId });
};

export const getSession = (connectionId: string) => sessions.get(connectionId);
