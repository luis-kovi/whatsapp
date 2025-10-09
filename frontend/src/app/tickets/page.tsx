'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, Send, Paperclip, Tag as TagIcon, UserPlus, X } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface Ticket {
  id: string;
  contact: { id: string; name: string; phoneNumber: string };
  status: 'PENDING' | 'OPEN' | 'CLOSED';
  unreadMessages: number;
  lastMessageAt: string;
  user?: { name: string };
  queue?: { name: string; color: string };
}

interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  timestamp: string;
  user?: { name: string };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'OPEN' | 'CLOSED'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTickets();
  }, [filter]);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const loadTickets = async () => {
    const params = filter !== 'all' ? { status: filter } : {};
    const { data } = await api.get('/tickets', { params });
    setTickets(data);
  };

  const loadMessages = async (ticketId: string) => {
    const { data } = await api.get(`/tickets/${ticketId}/messages`);
    setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTicket) return;
    await api.post('/messages', { ticketId: selectedTicket.id, body: messageText });
    setMessageText('');
    loadMessages(selectedTicket.id);
  };

  const handleAcceptTicket = async () => {
    if (!selectedTicket) return;
    await api.put(`/tickets/${selectedTicket.id}/accept`);
    loadTickets();
    setSelectedTicket({ ...selectedTicket, status: 'OPEN' });
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket || !confirm('Finalizar atendimento?')) return;
    await api.put(`/tickets/${selectedTicket.id}/close`);
    loadTickets();
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter(t => 
    t.contact.name.toLowerCase().includes(search.toLowerCase()) ||
    t.contact.phoneNumber.includes(search)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        {/* Lista de Tickets */}
        <div className="w-96 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-3">Atendimentos</h2>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-10 pr-3 py-2 border rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`flex-1 py-1.5 text-sm rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>Todos</button>
              <button onClick={() => setFilter('PENDING')} className={`flex-1 py-1.5 text-sm rounded ${filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>Pendentes</button>
              <button onClick={() => setFilter('OPEN')} className={`flex-1 py-1.5 text-sm rounded ${filter === 'OPEN' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>Abertos</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">{ticket.contact.name}</span>
                  {ticket.unreadMessages > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{ticket.unreadMessages}</span>}
                </div>
                <div className="text-sm text-gray-600 mb-2">{ticket.contact.phoneNumber}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{ticket.status}</span>
                  {ticket.queue && <span className="px-2 py-1 rounded" style={{ backgroundColor: ticket.queue.color + '20', color: ticket.queue.color }}>{ticket.queue.name}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {selectedTicket ? (
            <>
              <div className="bg-white border-b p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{selectedTicket.contact.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTicket.contact.phoneNumber}</p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status === 'PENDING' && (
                    <button onClick={handleAcceptTicket} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Aceitar</button>
                  )}
                  {selectedTicket.status === 'OPEN' && (
                    <button onClick={handleCloseTicket} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Finalizar</button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`mb-3 flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-4 py-2 rounded-lg ${msg.fromMe ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                      {!msg.fromMe && msg.user && <div className="text-xs opacity-75 mb-1">{msg.user.name}</div>}
                      <div>{msg.body}</div>
                      <div className={`text-xs mt-1 ${msg.fromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="bg-white border-t p-4 flex gap-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded"><Paperclip size={20} /></button>
                <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 border rounded-lg px-4 py-2" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"><Send size={20} /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
                <p>Selecione um atendimento para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
