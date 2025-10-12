'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Paperclip, ArrowLeft, CheckCircle, X, Zap } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { getSocket } from '@/lib/socket';

interface Ticket {
  id: string;
  contact: { id: string; name: string; phoneNumber: string };
  status: 'PENDING' | 'OPEN' | 'CLOSED';
  user?: { name: string };
  queue?: { name: string; color: string };
}

interface Message {
  id: string;
  body: string;
  mediaUrl?: string;
  mediaType?: string;
  fromMe: boolean;
  timestamp: string;
  user?: { name: string };
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTicket();
    loadMessages();
  }, [ticketId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      console.log('📨 Mensagem recebida no ticket:', data);
      if (data.ticketId === ticketId) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      const { data } = await api.get(`/tickets/${ticketId}`);
      setTicket(data);
    } catch (error) {
      router.push('/tickets');
    }
  };

  const loadMessages = async () => {
    const { data } = await api.get(`/tickets/${ticketId}/messages`);
    setMessages(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await api.post('/upload', formData);
      await api.post('/messages', {
        ticketId,
        body: messageText || file.name,
        mediaUrl: data.url,
        mediaType: data.mediaType
      });

      setMessageText('');
    } catch (error) {
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await api.post('/messages', { ticketId, body: messageText });
    setMessageText('');
  };

  const handleAcceptTicket = async () => {
    await api.put(`/tickets/${ticketId}/accept`);
    loadTicket();
  };

  const handleCloseTicket = async () => {
    if (!confirm('Finalizar atendimento?')) return;
    await api.put(`/tickets/${ticketId}/close`);
    router.push('/tickets');
  };

  if (!ticket) return <div>Carregando...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/tickets')} className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="font-bold text-lg">{ticket.contact.name}</h3>
              <p className="text-sm text-gray-600">{ticket.contact.phoneNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {ticket.status === 'PENDING' && (
              <button onClick={handleAcceptTicket} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                <CheckCircle size={18} className="inline mr-1" /> Aceitar
              </button>
            )}
            {ticket.status === 'OPEN' && (
              <button onClick={handleCloseTicket} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                <X size={18} className="inline mr-1" /> Finalizar
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className={`mb-3 flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-2 rounded-lg ${msg.fromMe ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                {!msg.fromMe && msg.user && <div className="text-xs opacity-75 mb-1">{msg.user.name}</div>}
                {msg.mediaUrl && (
                  <div className="mb-2">
                    {msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="Imagem" className="max-w-full rounded" />}
                    {msg.mediaType === 'video' && <video src={msg.mediaUrl} controls className="max-w-full rounded" />}
                    {msg.mediaType === 'audio' && <audio src={msg.mediaUrl} controls className="w-full" />}
                    {msg.mediaType === 'document' && <a href={msg.mediaUrl} target="_blank" className="text-blue-300 underline">📄 Documento</a>}
                  </div>
                )}
                <div>{msg.body}</div>
                <div className={`text-xs mt-1 ${msg.fromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
          <div className="flex gap-2">
            <label className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Paperclip size={20} />
              <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 border rounded-lg px-4 py-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
