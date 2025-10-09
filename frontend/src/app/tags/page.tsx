'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

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
    setFormData({ name: '', color: '#3B82F6' });
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tags</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <Plus size={20} /> Nova Tag
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map(tag => (
            <div key={tag.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: tag.color }}>
                  <Tag className="text-white" size={20} />
                </div>
                <span className="font-medium">{tag.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(tag)} className="text-blue-600 hover:text-blue-900">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editingTag ? 'Editar Tag' : 'Nova Tag'}</h2>
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
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingTag(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
