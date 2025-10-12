import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('✅ Socket conectado - ID:', socket.id);
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
