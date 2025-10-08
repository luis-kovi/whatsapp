import { useEffect, useState } from 'react';
import { Clock, User } from 'lucide-react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Ticket {
  id: string;
  contact: { name: string; phoneNumber: string };
  status: string;
  unreadMessages: number;
  lastMessageAt: string;
  user?: { name: string };
}

export default function TicketList({ onSelectTicket }: { onSelectTicket: (id: string) => void }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    api.get(`/tickets?status=${filter}`).then(({ data }) => setTickets(data));
  }, [filter]);

  return (
    <div className="w-96 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Conversas</h2>
        <div className="flex space-x-2">
          {['PENDING', 'OPEN', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm ${
                filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {status === 'PENDING' ? 'Pendentes' : status === 'OPEN' ? 'Abertos' : 'Fechados'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold">{ticket.contact.name}</h3>
              {ticket.unreadMessages > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {ticket.unreadMessages}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{ticket.contact.phoneNumber}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(ticket.lastMessageAt), { addSuffix: true, locale: ptBR })}
              </span>
              {ticket.user && (
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {ticket.user.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
