import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) return socket;

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 
                process.env.NEXT_PUBLIC_API_URL?.replace('/api', '').replace('https://', 'wss://').replace('http://', 'ws://') || 
                'http://localhost:3001';
  
  console.log('🔗 Conectando WebSocket em:', wsUrl);
  
  socket = io(wsUrl, {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('✅ Socket conectado - ID:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Erro de conexão Socket:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
