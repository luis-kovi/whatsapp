'use client';

import { Home, MessageSquare, Users, Tag, Settings, LogOut, Smartphone, Zap, BarChart3, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Atendimentos', path: '/tickets' },
    { icon: Users, label: 'Usuários', path: '/users' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Zap, label: 'Respostas', path: '/quick-replies' },
    { icon: Smartphone, label: 'WhatsApp', path: '/whatsapp' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex flex-col transition-all duration-300 border-r border-gray-800/50 shadow-2xl`}>
      <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">WhatsApp</h2>
              <p className="text-xs text-gray-400">Manager Pro</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                active
                  ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 shadow-lg shadow-green-500/10'
                  : 'hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              {active && <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent" />}
              <Icon className={`w-5 h-5 relative z-10 ${active ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'} transition-colors`} />
              {!collapsed && <span className={`relative z-10 ${active ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>{item.label}</span>}
            </a>
          );
        })}
      </nav>
      
      <button
        onClick={logout}
        className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-4 hover:bg-red-500/10 transition-all duration-300 border-t border-gray-800/50 group`}
      >
        <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
        {!collapsed && <span className="text-gray-300 group-hover:text-red-400 transition-colors">Sair</span>}
      </button>
    </div>
  );
}
