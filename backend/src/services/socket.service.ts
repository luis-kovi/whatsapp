import { Server, Socket } from 'socket.io';

let io: Server;

export const initializeSocket = (socketServer: Server) => {
  io = socketServer;

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  getIO().to(`user:${userId}`).emit(event, data);
};

export const emitToAll = (event: string, data: any) => {
  getIO().emit(event, data);
};
