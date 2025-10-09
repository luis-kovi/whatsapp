import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { initWhatsAppSession, disconnectWhatsApp, getSession } from '../services/whatsapp-mock.service';

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

export const startConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await initWhatsAppSession(id);
    res.json({ message: 'Conexão iniciada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao iniciar conexão' });
  }
};

export const stopConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await disconnectWhatsApp(id);
    res.json({ message: 'Conexão encerrada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encerrar conexão' });
  }
};

export const getQRCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = getSession(id);
    if (!session || !session.qrCode) {
      return res.status(404).json({ error: 'QR Code não disponível' });
    }
    res.json({ qrCode: session.qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar QR Code' });
  }
};
