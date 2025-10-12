import { prisma } from '../utils/prisma';
import { initWhatsAppSession } from './whatsapp.service';

export const initializeActiveConnections = async () => {
  try {
    const activeConnections = await prisma.whatsAppConnection.findMany({
      where: {
        status: { in: ['CONNECTED', 'QR_CODE'] }
      }
    });

    console.log(`🔄 Reconectando ${activeConnections.length} conexões WhatsApp...`);

    for (const connection of activeConnections) {
      try {
        await initWhatsAppSession(connection.id);
        console.log(`✅ Conexão ${connection.name} iniciada`);
      } catch (error) {
        console.error(`❌ Erro ao iniciar conexão ${connection.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar conexões WhatsApp:', error);
  }
};
