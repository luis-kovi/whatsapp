import { Home, MessageSquare, Users, Tag, Settings, LogOut, Smartphone, Zap, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">WhatsApp Manager</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </a>
        <a href="/tickets" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <MessageSquare className="w-5 h-5" />
          <span>Atendimentos</span>
        </a>
        <a href="/users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Users className="w-5 h-5" />
          <span>Usuários</span>
        </a>
        <a href="/tags" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Tag className="w-5 h-5" />
          <span>Tags</span>
        </a>
        <a href="/quick-replies" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Zap className="w-5 h-5" />
          <span>Respostas Rápidas</span>
        </a>
        <a href="/whatsapp" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Smartphone className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
        <a href="/reports" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <BarChart3 className="w-5 h-5" />
          <span>Relatórios</span>
        </a>
        <a href="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Settings className="w-5 h-5" />
          <span>Configurações</span>
        </a>
      </nav>
      <button
        onClick={logout}
        className="flex items-center space-x-3 p-4 hover:bg-gray-800 transition border-t border-gray-700"
      >
        <LogOut className="w-5 h-5" />
        <span>Sair</span>
      </button>
    </div>
  );
}
