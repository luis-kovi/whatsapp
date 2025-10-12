'use client';

import { useEffect } from 'react';
import { initSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    console.log('🔌 SocketProvider - Token:', token ? 'Existe' : 'Não existe');
    if (token) {
      console.log('🚀 Inicializando socket...');
      const socket = initSocket(token);

      // Solicitar permissão para notificações
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Listener para novas mensagens
      socket.on('message:new', (data: any) => {
        console.log('🔔 Nova mensagem recebida no SocketProvider:', data);
        
        // Notificar se a aba não estiver ativa
        if (document.hidden && Notification.permission === 'granted') {
          new Notification('Nova mensagem', {
            body: `${data.message.body || 'Mídia recebida'}`,
            icon: '/icon.png',
            tag: data.ticketId
          });
        }
      });

      return () => {
        socket.off('message:new');
      };
    }
  }, [token]);

  return <>{children}</>;
}
