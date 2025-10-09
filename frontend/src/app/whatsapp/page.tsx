'use client';

import { useEffect, useState } from 'react';
import { Plus, Smartphone, QrCode, Power, PowerOff, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { getSocket } from '@/lib/socket';

interface Connection {
  id: string;
  name: string;
  phoneNumber?: string;
  status: string;
  qrCode?: string;
}

export default function WhatsAppPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    loadConnections();

    const socket = getSocket();
    if (socket) {
      socket.on('whatsapp:qrcode', ({ connectionId, qrCode }) => {
        setConnections(prev => prev.map(c => c.id === connectionId ? { ...c, qrCode, status: 'QR_CODE' } : c));
      });

      socket.on('whatsapp:connected', ({ connectionId, phoneNumber }) => {
        setConnections(prev => prev.map(c => c.id === connectionId ? { ...c, phoneNumber, status: 'CONNECTED', qrCode: undefined } : c));
      });

      socket.on('whatsapp:disconnected', ({ connectionId }) => {
        setConnections(prev => prev.map(c => c.id === connectionId ? { ...c, status: 'DISCONNECTED', qrCode: undefined } : c));
      });

      return () => {
        socket.off('whatsapp:qrcode');
        socket.off('whatsapp:connected');
        socket.off('whatsapp:disconnected');
      };
    }
  }, []);

  const loadConnections = async () => {
    const { data } = await api.get('/whatsapp/connections');
    setConnections(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/whatsapp/connections', { name });
    setShowModal(false);
    setName('');
    loadConnections();
  };

  const handleStart = async (id: string) => {
    await api.post(`/whatsapp/connections/${id}/start`);
    loadConnections();
  };

  const handleStop = async (id: string) => {
    if (confirm('Desconectar WhatsApp?')) {
      await api.post(`/whatsapp/connections/${id}/stop`);
      loadConnections();
    }
  };

  const showQR = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowQRModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Conexões WhatsApp</h1>
          <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <Plus size={20} /> Nova Conexão
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map(conn => (
            <div key={conn.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    conn.status === 'CONNECTED' ? 'bg-green-100' :
                    conn.status === 'QR_CODE' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <Smartphone className={
                      conn.status === 'CONNECTED' ? 'text-green-600' :
                      conn.status === 'QR_CODE' ? 'text-yellow-600' :
                      'text-gray-600'
                    } size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">{conn.name}</h3>
                    {conn.phoneNumber && <p className="text-sm text-gray-600">{conn.phoneNumber}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  conn.status === 'CONNECTED' ? 'bg-green-100 text-green-800' :
                  conn.status === 'QR_CODE' ? 'bg-yellow-100 text-yellow-800' :
                  conn.status === 'CONNECTING' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {conn.status === 'CONNECTED' ? 'Conectado' :
                   conn.status === 'QR_CODE' ? 'Aguardando QR Code' :
                   conn.status === 'CONNECTING' ? 'Conectando...' :
                   'Desconectado'}
                </span>
              </div>

              <div className="flex gap-2">
                {conn.status === 'DISCONNECTED' && (
                  <button onClick={() => handleStart(conn.id)} className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2">
                    <Power size={16} /> Conectar
                  </button>
                )}
                {conn.status === 'QR_CODE' && (
                  <button onClick={() => showQR(conn)} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 flex items-center justify-center gap-2">
                    <QrCode size={16} /> Ver QR Code
                  </button>
                )}
                {conn.status === 'CONNECTED' && (
                  <button onClick={() => handleStop(conn.id)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2">
                    <PowerOff size={16} /> Desconectar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Nova Conexão</h2>
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nome da Conexão</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Ex: Atendimento Principal" required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">Criar</button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showQRModal && selectedConnection?.qrCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Escaneie o QR Code</h2>
              <p className="text-gray-600 mb-4">Abra o WhatsApp no seu celular e escaneie o código</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedConnection.qrCode)}`} alt="QR Code" className="w-64 h-64" />
              </div>
              <button onClick={() => setShowQRModal(false)} className="mt-4 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
