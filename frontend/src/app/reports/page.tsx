'use client';

import { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const params = { dateFrom, dateTo, type: reportType, format };
      const { data } = await api.get('/reports/export', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${reportType}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Erro ao exportar relatório');
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Início</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="general">Geral</option>
                <option value="agents">Por Atendente</option>
                <option value="queues">Por Fila</option>
                <option value="tags">Por Tag</option>
                <option value="satisfaction">Satisfação</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => handleExport('pdf')} disabled={loading} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 disabled:opacity-50">
              <Download size={18} /> Exportar PDF
            </button>
            <button onClick={() => handleExport('excel')} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 disabled:opacity-50">
              <Download size={18} /> Exportar Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Atendimentos por Período</h3>
              <BarChart3 className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">Visualize o volume de atendimentos ao longo do tempo</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Desempenho de Atendentes</h3>
              <Users className="text-green-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">Compare produtividade e tempo médio de resposta</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Tempo Médio</h3>
              <Clock className="text-yellow-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">Análise de tempo de primeira resposta e resolução</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Satisfação do Cliente</h3>
              <TrendingUp className="text-purple-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">NPS e avaliações dos clientes</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Análise por Fila</h3>
              <BarChart3 className="text-indigo-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">Distribuição e performance por fila de atendimento</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Horários de Pico</h3>
              <Calendar className="text-red-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">Identifique os horários de maior demanda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
