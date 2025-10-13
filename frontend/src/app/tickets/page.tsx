'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Phone, MoreVertical, Send, Paperclip, Smile, Mic, Check, CheckCheck, Reply, Heart, X, User, Clock, Plus, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { getSocket } from '@/lib/socket';

interface Ticket {
  id: string;
  contact: { id: string; name: string; phoneNumber: string; avatar?: string };
  status: 'PENDING' | 'OPEN' | 'CLOSED';
  unreadMessages: number;
  lastMessageAt: string;
  user?: { name: string };
  queue?: { name: string; color: string };
  lastMessage?: string;
}

interface Message {
  id: string;
  body: string;
  mediaUrl?: string;
  mediaType?: string;
  fromMe: boolean;
  status: string;
  timestamp: string;
  user?: { name: string };
  quotedMessageId?: string;
}

function TicketsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'OPEN'>('all');
  const [uploading, setUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [newTicketData, setNewTicketData] = useState({ contactId: '', phone: '', name: '' });

  useEffect(() => {
    loadTickets();
    loadContacts();
    const ticketId = searchParams.get('id');
    if (ticketId) {
      loadTicketById(ticketId);
    }
  }, [filter]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      console.log('📨 Mensagem recebida:', data);
      if (selectedTicket && data.ticketId === selectedTicket.id) {
        const message = data.message || data;
        if (message && typeof message.fromMe !== 'undefined') {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      }
      loadTickets();
    };

    const handleTicketUpdate = () => loadTickets();

    socket.on('message:new', handleNewMessage);
    socket.on('ticket:update', handleTicketUpdate);
    socket.on('ticket:new', handleTicketUpdate);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('ticket:update', handleTicketUpdate);
      socket.off('ticket:new', handleTicketUpdate);
    };
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTickets = async () => {
    const params = filter !== 'all' ? { status: filter } : {};
    const { data } = await api.get('/tickets', { params });
    setTickets(data);
  };

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const loadTicketById = async (id: string) => {
    try {
      const { data: ticketData } = await api.get(`/tickets/${id}`);
      setSelectedTicket(ticketData);
      const { data: messagesData } = await api.get(`/tickets/${id}/messages`);
      setMessages(messagesData);
    } catch (error) {
      console.error('Erro ao carregar ticket:', error);
    }
  };

  const selectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    router.push(`/tickets?id=${ticket.id}`, { scroll: false });
    loadTicketById(ticket.id);
    setShowContactInfo(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTicket) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await api.post('/upload', formData);
      await api.post('/messages', {
        ticketId: selectedTicket.id,
        body: messageText || file.name,
        mediaUrl: data.url,
        mediaType: data.mediaType,
        quotedMessageId: replyingTo?.id
      });

      setMessageText('');
      setReplyingTo(null);
    } catch (error) {
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTicket) return;
    
    await api.post('/messages', { 
      ticketId: selectedTicket.id, 
      body: messageText,
      quotedMessageId: replyingTo?.id
    });
    
    setMessageText('');
    setReplyingTo(null);
  };

  const handleAcceptTicket = async () => {
    if (!selectedTicket) return;
    await api.put(`/tickets/${selectedTicket.id}/accept`);
    loadTickets();
    loadTicketById(selectedTicket.id);
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket || !confirm('Finalizar atendimento?')) return;
    await api.put(`/tickets/${selectedTicket.id}/close`);
    setSelectedTicket(null);
    router.push('/tickets', { scroll: false });
    loadTickets();
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const phone = newTicketData.contactId ? 
        contacts.find(c => c.id === newTicketData.contactId)?.phoneNumber : 
        newTicketData.phone;
      
      if (!phone) {
        alert('Telefone é obrigatório');
        return;
      }

      await api.post('/tickets', {
        contactPhone: phone,
        contactName: newTicketData.contactId ? 
          contacts.find(c => c.id === newTicketData.contactId)?.name : 
          newTicketData.name
      });
      
      setShowCreateTicketModal(false);
      setNewTicketData({ contactId: '', phone: '', name: '' });
      loadTickets();
      alert('Ticket criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      alert('Erro ao criar ticket de atendimento.');
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.contact.name.toLowerCase().includes(search.toLowerCase()) ||
    t.contact.phoneNumber.includes(search)
  );

  const getMessageStatus = (msg: Message) => {
    if (!msg.fromMe) return null;
    if (msg.status === 'READ') return <CheckCheck size={16} className="text-blue-400" />;
    if (msg.status === 'RECEIVED') return <CheckCheck size={16} className="text-gray-400" />;
    return <Check size={16} className="text-gray-400" />;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      {/* Lista de Tickets */}
      <div className="w-96 bg-white border-r flex flex-col">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Conversas</h2>
            <button
              onClick={() => setShowCreateTicketModal(true)}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
              title="Novo Ticket"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Buscar conversa..." 
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`flex-1 py-2 text-sm rounded-lg font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              Todas
            </button>
            <button onClick={() => setFilter('PENDING')} className={`flex-1 py-2 text-sm rounded-lg font-medium ${filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              Pendentes
            </button>
            <button onClick={() => setFilter('OPEN')} className={`flex-1 py-2 text-sm rounded-lg font-medium ${filter === 'OPEN' ? 'bg-green-500 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              Abertas
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => selectTicket(ticket)} 
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex gap-3">
                {ticket.contact.avatar ? (
                  <img src={ticket.contact.avatar} alt={ticket.contact.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {ticket.contact.name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 truncate">{ticket.contact.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {new Date(ticket.lastMessageAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{ticket.lastMessage || ticket.contact.phoneNumber}</p>
                    {ticket.unreadMessages > 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2">
                        {ticket.unreadMessages}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col bg-[#e5ddd5]">
          {/* Header do Chat */}
          <div className="bg-white border-b p-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowContactInfo(!showContactInfo)}>
              {selectedTicket.contact.avatar ? (
                <img src={selectedTicket.contact.avatar} alt={selectedTicket.contact.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedTicket.contact.name[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{selectedTicket.contact.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedTicket.status === 'OPEN' ? 'Online' : selectedTicket.contact.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M20 20h60v60H20z\' fill=\'%23d1c7b7\' opacity=\'.05\'/%3E%3C/svg%3E")' }}>
            {selectedTicket.status === 'PENDING' && (
              <div className="flex justify-center mb-4">
                <button onClick={handleAcceptTicket} className="bg-green-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2">
                  <CheckCheck size={18} /> Aceitar Conversa
                </button>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-md relative ${msg.fromMe ? 'bg-[#d9fdd3]' : 'bg-white'} rounded-lg shadow-sm p-3`}>
                  {msg.quotedMessageId && (
                    <div className="bg-gray-100 border-l-4 border-green-500 p-2 mb-2 rounded text-xs">
                      <p className="text-gray-600">Mensagem citada</p>
                    </div>
                  )}
                  
                  {!msg.fromMe && msg.user && (
                    <div className="text-xs font-semibold text-blue-600 mb-1">{msg.user.name}</div>
                  )}
                  
                  {msg.mediaUrl && (
                    <div className="mb-2 rounded overflow-hidden">
                      {msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="Imagem" className="max-w-full rounded" />}
                      {msg.mediaType === 'video' && <video src={msg.mediaUrl} controls className="max-w-full rounded" />}
                      {msg.mediaType === 'audio' && <audio src={msg.mediaUrl} controls className="w-full" />}
                      {msg.mediaType === 'document' && (
                        <a href={msg.mediaUrl} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                          <Paperclip size={16} /> Documento
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-900 break-words">{msg.body}</div>
                  
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {getMessageStatus(msg)}
                  </div>

                  {/* Botões de ação */}
                  <div className="absolute -right-16 top-2 hidden group-hover:flex gap-1">
                    <button onClick={() => setReplyingTo(msg)} className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Responder">
                      <Reply size={14} className="text-gray-600" />
                    </button>
                    <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Curtir">
                      <Heart size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div className="bg-white border-t p-3">
            {replyingTo && (
              <div className="bg-gray-100 border-l-4 border-green-500 p-2 mb-2 rounded flex justify-between items-center">
                <div className="text-sm">
                  <p className="text-gray-600 font-semibold">Respondendo</p>
                  <p className="text-gray-800 truncate">{replyingTo.body}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 rounded">
                  <X size={16} />
                </button>
              </div>
            )}

            {selectedTicket.status === 'OPEN' && (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition">
                  <Smile size={24} className="text-gray-600" />
                </button>
                
                <label className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
                  <Paperclip size={24} className="text-gray-600" />
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>

                <input 
                  type="text" 
                  value={messageText} 
                  onChange={e => setMessageText(e.target.value)} 
                  placeholder="Digite uma mensagem..." 
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
                />

                {messageText.trim() ? (
                  <button type="submit" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-lg">
                    <Send size={20} />
                  </button>
                ) : (
                  <button type="button" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-lg">
                    <Mic size={20} />
                  </button>
                )}
              </form>
            )}

            {selectedTicket.status === 'PENDING' && (
              <div className="text-center text-gray-500 py-2">
                Aceite a conversa para enviar mensagens
              </div>
            )}

            {selectedTicket.status === 'CLOSED' && (
              <div className="text-center text-gray-500 py-2">
                Esta conversa foi finalizada
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8 opacity-20">
              <svg viewBox="0 0 303 172" fill="none">
                <path d="M118.5 77.5C118.5 77.5 118.5 77.5 118.5 77.5C118.5 77.5 118.5 77.5 118.5 77.5Z" fill="#DFE5E7"/>
              </svg>
            </div>
            <h2 className="text-3xl font-light text-gray-600 mb-2">WhatsApp Manager</h2>
            <p className="text-gray-500">Selecione uma conversa para começar</p>
          </div>
        </div>
      )}

      {/* Painel de Informações do Contato */}
      {showContactInfo && selectedTicket && (
        <div className="w-96 bg-white border-l p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Informações do Contato</h3>
            <button onClick={() => setShowContactInfo(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="text-center mb-6">
            {selectedTicket.contact.avatar ? (
              <img src={selectedTicket.contact.avatar} alt={selectedTicket.contact.name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4" />
            ) : (
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-5xl mb-4">
                {selectedTicket.contact.name[0].toUpperCase()}
              </div>
            )}
            <h4 className="text-xl font-semibold mb-1">{selectedTicket.contact.name}</h4>
            <p className="text-gray-600">{selectedTicket.contact.phoneNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="font-medium">{selectedTicket.contact.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="font-medium">{selectedTicket.contact.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium capitalize">{selectedTicket.status.toLowerCase()}</p>
              </div>
            </div>

            {selectedTicket.status === 'OPEN' && (
              <button onClick={handleCloseTicket} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium">
                Finalizar Atendimento
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Criar Ticket */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Ticket de Atendimento</h2>
            
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Selecionar Contato</label>
                <select
                  value={newTicketData.contactId}
                  onChange={(e) => setNewTicketData({ ...newTicketData, contactId: e.target.value, phone: '', name: '' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione um contato ou digite manualmente</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              {!newTicketData.contactId && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      required={!newTicketData.contactId}
                      value={newTicketData.name}
                      onChange={(e) => setNewTicketData({ ...newTicketData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nome do contato"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Telefone *</label>
                    <input
                      type="tel"
                      required={!newTicketData.contactId}
                      value={newTicketData.phone}
                      onChange={(e) => setNewTicketData({ ...newTicketData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Número do telefone"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTicketModal(false);
                    setNewTicketData({ contactId: '', phone: '', name: '' });
                  }}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Criar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
      <TicketsContent />
    </Suspense>
  );
}
