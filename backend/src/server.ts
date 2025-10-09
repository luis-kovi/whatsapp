import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import queueRoutes from './routes/queue.routes';
import ticketRoutes from './routes/ticket.routes';
import messageRoutes from './routes/message.routes';
import contactRoutes from './routes/contact.routes';
import tagRoutes from './routes/tag.routes';
import quickReplyRoutes from './routes/quickReply.routes';
import whatsappRoutes from './routes/whatsapp.routes';
import dashboardRoutes from './routes/dashboard.routes';
import settingRoutes from './routes/setting.routes';
import { initializeSocket } from './services/socket.service';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeSocket(io);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'WhatsApp Manager API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/quick-replies', quickReplyRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
