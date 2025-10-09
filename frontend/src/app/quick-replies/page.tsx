'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Zap, Search } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface QuickReply {
  id: string;
  shortcut: string;
  message: string;
  isGlobal: boolean;
  usageCount: number;
}

export default function QuickRepliesPage() {
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<QuickReply | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ shortcut: '', message: '', isGlobal: true });

  useEffect(() => {
    loadReplies();
  }, []);

  const loadReplies = async () => {
    const { data } = await api.get('/quick-replies');
    setReplies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/quick-replies/${editing.id}`, formData);
    } else {
      await api.post('/quick-replies', formData);
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ shortcut: '', message: '', isGlobal: true });
    loadReplies();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir resposta rápida?')) {
      await api.delete(`/quick-replies/${id}`);
      loadReplies();
    }
  };

  const openEdit = (reply: QuickReply) => {
    setEditing(reply);
    setFormData({ shortcut: reply.shortcut, message: reply.message, isGlobal: reply.isGlobal });
    setShowModal(true);
  };

  const filtered = replies.filter(r => 
    r.shortcut.toLowerCase().includes(search.toLowerCase()) ||
    r.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Respostas Rápidas</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <Plus size={20} /> Nova Resposta
          </button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-10 pr-3 py-2 border rounded-lg" />
        </div>

        <div className="space-y-3">
          {filtered.map(reply => (
            <div key={reply.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-500" size={20} />
                  <span className="font-mono font-bold text-blue-600">/{reply.shortcut}</span>
                  {reply.isGlobal && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Global</span>}
                  <span className="text-xs text-gray-500">{reply.usageCount} usos</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(reply)} className="text-blue-600 hover:text-blue-900">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(reply.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">{editing ? 'Editar' : 'Nova'} Resposta Rápida</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Atalho (sem /)</label>
                  <input type="text" value={formData.shortcut} onChange={e => setFormData({...formData, shortcut: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Ex: saudacao" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Mensagem</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border rounded px-3 py-2" rows={6} placeholder="Use {nome}, {atendente}, {data}, {hora}" required />
                </div>
                <div className="mb-4 flex items-center">
                  <input type="checkbox" checked={formData.isGlobal} onChange={e => setFormData({...formData, isGlobal: e.target.checked})} className="mr-2" />
                  <label className="text-sm">Disponível para todos os usuários</label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
