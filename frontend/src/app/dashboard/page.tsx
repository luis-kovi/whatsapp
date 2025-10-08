'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import TicketList from '@/components/TicketList';
import ChatArea from '@/components/ChatArea';

export default function DashboardPage() {
  const [stats, setStats] = useState({ openTickets: 0, pendingTickets: 0, closedToday: 0 });
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <MessageSquare className="w-12 h-12 text-blue-500" />
            <div>
              <p className="text-gray-500 text-sm">Atendimentos Abertos</p>
              <p className="text-3xl font-bold">{stats.openTickets}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <Clock className="w-12 h-12 text-yellow-500" />
            <div>
              <p className="text-gray-500 text-sm">Em Espera</p>
              <p className="text-3xl font-bold">{stats.pendingTickets}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Finalizados Hoje</p>
              <p className="text-3xl font-bold">{stats.closedToday}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <TicketList onSelectTicket={setSelectedTicket} />
          <ChatArea ticketId={selectedTicket} />
        </div>
      </div>
    </div>
  );
}
