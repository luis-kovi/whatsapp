'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Zap, Search, X, Sparkles } from 'lucide-react';
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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              Respostas Rápidas
            </h1>
            <p className="text-gray-400 mt-1">Agilize seu atendimento com atalhos</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-whatsapp flex items-center gap-2">
            <Plus size={20} /> Nova Resposta
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar respostas..." className="input-premium w-full pl-12" />
        </div>

        <div className="space-y-3">
          {filtered.map(reply => (
            <div key={reply.id} className="card-premium p-5 hover:scale-[1.02] transition-transform duration-300 group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <Zap className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-green-400 text-lg">/{reply.shortcut}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {reply.isGlobal && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Global</span>}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Sparkles size={12} />
                        {reply.usageCount} usos
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(reply)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(reply.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">{reply.message}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-premium p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  {editing ? 'Editar' : 'Nova'} Resposta Rápida
                </h2>
                <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Atalho (sem /)</label>
                  <input type="text" value={formData.shortcut} onChange={e => setFormData({...formData, shortcut: e.target.value})} className="input-premium w-full" placeholder="Ex: saudacao" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="input-premium w-full" rows={6} placeholder="Use {nome}, {atendente}, {data}, {hora}" required />
                  <p className="text-xs text-gray-500 mt-2">Variáveis disponíveis: {'{nome}'}, {'{atendente}'}, {'{data}'}, {'{hora}'}</p>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <input type="checkbox" checked={formData.isGlobal} onChange={e => setFormData({...formData, isGlobal: e.target.checked})} className="w-4 h-4 rounded accent-green-500" />
                  <label className="text-sm text-gray-300">Disponível para todos os usuários</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-whatsapp flex-1">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="btn-secondary flex-1">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
