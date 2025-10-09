'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, X, Shield, Users as UsersIcon } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'AGENT';
  status: 'ONLINE' | 'OFFLINE' | 'AWAY';
  isActive: boolean;
  maxTickets: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'AGENT', maxTickets: 5 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await api.put(`/users/${editingUser.id}`, formData);
    } else {
      await api.post('/users', formData);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'AGENT', maxTickets: 5 });
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente desativar este usuário?')) {
      await api.delete(`/users/${id}`);
      loadUsers();
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, maxTickets: user.maxTickets });
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-green-500" />
              Usuários
            </h1>
            <p className="text-gray-400 mt-1">Gerencie os usuários do sistema</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-whatsapp flex items-center gap-2">
            <Plus size={20} /> Novo Usuário
          </button>
        </div>

        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Max Tickets</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.isActive ? <UserCheck className="w-5 h-5 text-green-400" /> : <UserX className="w-5 h-5 text-red-400" />}
                      <span className="text-gray-200 font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      user.role === 'SUPERVISOR' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                      user.status === 'ONLINE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      user.status === 'AWAY' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${user.status === 'ONLINE' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.maxTickets}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(user)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-premium p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingUser(null); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-premium w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Senha {editingUser && <span className="text-gray-500 text-xs">(deixe em branco para não alterar)</span>}</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input-premium w-full" required={!editingUser} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Perfil</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="input-premium w-full">
                    <option value="AGENT">Atendente</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Máximo de Tickets</label>
                  <input type="number" value={formData.maxTickets} onChange={e => setFormData({...formData, maxTickets: parseInt(e.target.value)})} className="input-premium w-full" min="1" required />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-whatsapp flex-1">Salvar</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingUser(null); }} className="btn-secondary flex-1">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
