import { useEffect, useState } from 'react';
import { Send, CheckCheck, X } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  timestamp: string;
  status: string;
}

export default function ChatArea({ ticketId }: { ticketId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (ticketId) {
      api.get(`/tickets/${ticketId}`).then(({ data }) => {
        setTicket(data);
        setMessages(data.messages);
      });
    }
  }, [ticketId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !ticketId) return;

    await api.post('/messages', { ticketId, body: newMessage });
    setNewMessage('');
    api.get(`/tickets/${ticketId}`).then(({ data }) => setMessages(data.messages));
  };

  const handleAccept = async () => {
    await api.put(`/tickets/${ticketId}/accept`);
    api.get(`/tickets/${ticketId}`).then(({ data }) => setTicket(data));
  };

  const handleClose = async () => {
    await api.put(`/tickets/${ticketId}/close`);
    api.get(`/tickets/${ticketId}`).then(({ data }) => setTicket(data));
  };

  if (!ticketId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Selecione uma conversa</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{ticket?.contact.name}</h2>
          <p className="text-sm text-gray-500">{ticket?.contact.phoneNumber}</p>
        </div>
        <div className="flex space-x-2">
          {ticket?.status === 'PENDING' && (
            <button onClick={handleAccept} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Aceitar
            </button>
          )}
          {ticket?.status === 'OPEN' && (
            <button onClick={handleClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Finalizar
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.fromMe ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <p>{msg.body}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs opacity-70">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                {msg.fromMe && <CheckCheck className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border-t flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
