'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, X, Layers } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface Queue {
  id: string;
  name: string;
  color: string;
  description?: string;
  greetingMessage?: string;
  isActive: boolean;
}

export default function QueuesPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#25D366', description: '', greetingMessage: '' });

  useEffect(() => {
    loadQueues();
  }, []);

  const loadQueues = async () => {
    const { data } = await api.get('/queues');
    setQueues(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQueue) {
      await api.put(`/queues/${editingQueue.id}`, formData);
    } else {
      await api.post('/queues', formData);
    }
    setShowModal(false);
    setEditingQueue(null);
    setFormData({ name: '', color: '#25D366', description: '', greetingMessage: '' });
    loadQueues();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta fila?')) {
      await api.delete(`/queues/${id}`);
      loadQueues();
    }
  };

  const openEditModal = (queue: Queue) => {
    setEditingQueue(queue);
    setFormData({ name: queue.name, color: queue.color, description: queue.description || '', greetingMessage: queue.greetingMessage || '' });
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <Layers className="w-8 h-8 text-green-500" />
              Filas de Atendimento
            </h1>
            <p className="text-gray-400 mt-1">Organize o fluxo de atendimentos</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-whatsapp flex items-center gap-2">
            <Plus size={20} /> Nova Fila
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map(queue => (
            <div key={queue.id} className="card-premium p-6 hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: queue.color }}>
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-200">{queue.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${queue.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                      {queue.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(queue)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(queue.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {queue.description && <p className="text-sm text-gray-400 mb-3">{queue.description}</p>}
              {queue.greetingMessage && (
                <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-500 mb-1">Mensagem de saudação:</p>
                  <p className="text-sm text-gray-300">{queue.greetingMessage}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-premium p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-green-400" />
                  {editingQueue ? 'Editar Fila' : 'Nova Fila'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingQueue(null); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium w-full" placeholder="Ex: Suporte Técnico" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cor</label>
                  <div className="flex gap-3">
                    <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-20 h-12 rounded-xl border-2 border-gray-700 cursor-pointer" />
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="input-premium flex-1" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-premium w-full" rows={2} placeholder="Descreva o propósito desta fila..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem de Saudação</label>
                  <textarea value={formData.greetingMessage} onChange={e => setFormData({...formData, greetingMessage: e.target.value})} className="input-premium w-full" rows={3} placeholder="Olá! Bem-vindo ao nosso atendimento..." />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-whatsapp flex-1">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingQueue(null); }} className="btn-secondary flex-1">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
