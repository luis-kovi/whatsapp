'use client';

import { useState } from 'react';
import { Save, Bell, Clock, MessageSquare, Smartphone } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'WhatsApp Manager',
    autoCloseInactive: true,
    inactiveTimeout: 24,
    maxTicketsPerUser: 5,
    enableSatisfactionSurvey: true,
    enableSoundNotifications: true,
    enableEmailNotifications: false,
    emailSMTP: '',
    emailPort: 587,
    emailUser: '',
    emailPassword: ''
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
              <Save size={20} /> Salvar Alterações
            </button>
          </div>

          {/* Configurações Gerais */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={20} /> Configurações Gerais
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                <input type="text" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Máximo de Tickets por Usuário</label>
                <input type="number" value={settings.maxTicketsPerUser} onChange={e => setSettings({...settings, maxTicketsPerUser: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" min="1" />
              </div>
            </div>
          </div>

          {/* Configurações de Atendimento */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock size={20} /> Configurações de Atendimento
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Fechamento Automático</div>
                  <div className="text-sm text-gray-600">Fechar tickets inativos automaticamente</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.autoCloseInactive} onChange={e => setSettings({...settings, autoCloseInactive: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {settings.autoCloseInactive && (
                <div>
                  <label className="block text-sm font-medium mb-1">Tempo de Inatividade (horas)</label>
                  <input type="number" value={settings.inactiveTimeout} onChange={e => setSettings({...settings, inactiveTimeout: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" min="1" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Pesquisa de Satisfação</div>
                  <div className="text-sm text-gray-600">Enviar pesquisa ao finalizar atendimento</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.enableSatisfactionSurvey} onChange={e => setSettings({...settings, enableSatisfactionSurvey: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell size={20} /> Notificações
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificações Sonoras</div>
                  <div className="text-sm text-gray-600">Tocar som ao receber mensagens</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.enableSoundNotifications} onChange={e => setSettings({...settings, enableSoundNotifications: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificações por Email</div>
                  <div className="text-sm text-gray-600">Enviar notificações por email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.enableEmailNotifications} onChange={e => setSettings({...settings, enableEmailNotifications: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Conexões WhatsApp */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Smartphone size={20} /> Conexões WhatsApp
            </h2>
            <p className="text-gray-600 mb-4">Gerencie suas conexões do WhatsApp</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              + Nova Conexão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
