import { create } from 'zustand';
import api from '@/lib/api';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    initSocket(data.token);
  },
  logout: () => {
    localStorage.removeItem('token');
    disconnectSocket();
    set({ user: null, token: null });
  },
  setUser: (user) => set({ user }),
}));

