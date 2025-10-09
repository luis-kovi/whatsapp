'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag, X, Hash } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface TagType {
  id: string;
  name: string;
  color: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#25D366' });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const { data } = await api.get('/tags');
    setTags(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      await api.put(`/tags/${editingTag.id}`, formData);
    } else {
      await api.post('/tags', formData);
    }
    setShowModal(false);
    setEditingTag(null);
    setFormData({ name: '', color: '#25D366' });
    loadTags();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta tag?')) {
      await api.delete(`/tags/${id}`);
      loadTags();
    }
  };

  const openEditModal = (tag: TagType) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <Hash className="w-8 h-8 text-green-500" />
              Tags
            </h1>
            <p className="text-gray-400 mt-1">Organize seus atendimentos com tags</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-whatsapp flex items-center gap-2">
            <Plus size={20} /> Nova Tag
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map(tag => (
            <div key={tag.id} className="card-premium p-4 hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: tag.color }}>
                    <Tag className="text-white" size={24} />
                  </div>
                  <span className="font-semibold text-gray-200">{tag.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(tag)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <span>{tag.color}</span>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-premium p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Tag className="w-6 h-6 text-green-400" />
                  {editingTag ? 'Editar Tag' : 'Nova Tag'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingTag(null); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium w-full" placeholder="Ex: Urgente" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cor</label>
                  <div className="flex gap-3">
                    <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-20 h-12 rounded-xl border-2 border-gray-700 cursor-pointer" />
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="input-premium flex-1" placeholder="#25D366" required />
                  </div>
                  <div className="mt-3 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: formData.color + '20', borderColor: formData.color + '50', borderWidth: '1px' }}>
                    <Tag size={16} style={{ color: formData.color }} />
                    <span style={{ color: formData.color }} className="text-sm font-medium">Preview: {formData.name || 'Nome da Tag'}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-whatsapp flex-1">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingTag(null); }} className="btn-secondary flex-1">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
