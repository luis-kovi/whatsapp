'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle, TrendingUp, Users, Activity, Zap, ArrowUp } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const [stats, setStats] = useState({ openTickets: 0, pendingTickets: 0, closedToday: 0 });

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  const cards = [
    { icon: MessageSquare, label: 'Atendimentos Abertos', value: stats.openTickets, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', trend: '+12%' },
    { icon: Clock, label: 'Em Espera', value: stats.pendingTickets, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', trend: '-5%' },
    { icon: CheckCircle, label: 'Finalizados Hoje', value: stats.closedToday, color: 'from-green-500 to-green-600', bg: 'bg-green-500/10', border: 'border-green-500/30', trend: '+23%' },
    { icon: TrendingUp, label: 'Taxa de Conversão', value: '94%', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/30', trend: '+8%' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-b border-gray-800/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-400 mt-1">Visão geral do sistema em tempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Sistema Online</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="card-premium p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                      <ArrowUp className="w-4 h-4" />
                      {card.trend}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{card.label}</p>
                  <p className="text-4xl font-bold text-white">{card.value}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <a href="/tickets" className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 group-hover:text-white">Ver Atendimentos</span>
                  </div>
                  <ArrowUp className="w-4 h-4 text-gray-500 rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/whatsapp" className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 group-hover:text-white">Conexões WhatsApp</span>
                  </div>
                  <ArrowUp className="w-4 h-4 text-gray-500 rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/reports" className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300 group-hover:text-white">Relatórios</span>
                  </div>
                  <ArrowUp className="w-4 h-4 text-gray-500 rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Atividade Recente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Novo ticket criado #1234</span>
                  <span className="text-xs text-gray-500 ml-auto">2 min</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm text-gray-300">Ticket #1230 finalizado</span>
                  <span className="text-xs text-gray-500 ml-auto">5 min</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm text-gray-300">Novo usuário conectado</span>
                  <span className="text-xs text-gray-500 ml-auto">12 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
