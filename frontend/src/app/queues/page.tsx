'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6', description: '', greetingMessage: '' });

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
    setFormData({ name: '', color: '#3B82F6', description: '', greetingMessage: '' });
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Filas de Atendimento</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <Plus size={20} /> Nova Fila
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queues.map(queue => (
            <div key={queue.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: queue.color }}>
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{queue.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${queue.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {queue.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(queue)} className="text-blue-600 hover:text-blue-900">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(queue.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {queue.description && <p className="text-sm text-gray-600 mb-2">{queue.description}</p>}
              {queue.greetingMessage && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <span className="font-medium">Mensagem de saudação:</span>
                  <p className="text-gray-600 mt-1">{queue.greetingMessage}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{editingQueue ? 'Editar Fila' : 'Nova Fila'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Cor</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-16 h-10 border rounded cursor-pointer" />
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="flex-1 border rounded px-3 py-2" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2" rows={2} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Mensagem de Saudação</label>
                  <textarea value={formData.greetingMessage} onChange={e => setFormData({...formData, greetingMessage: e.target.value})} className="w-full border rounded px-3 py-2" rows={3} placeholder="Olá! Bem-vindo ao nosso atendimento..." />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingQueue(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
