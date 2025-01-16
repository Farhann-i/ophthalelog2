import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (data: { email: string; password: string; role: string; name: string; phone: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      set({ 
        user: { 
          ...data.user,
          username: profile?.name || data.user.email?.split('@')[0] || '',
          role: profile?.role || 'resident'
        } as User, 
        isAuthenticated: true 
      });
    }
  },

  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  },

  signup: async ({ email, password, role, name, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role,
          phone
        }
      }
    });
    if (error) throw error;
    
    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert([{
        id: data.user.id,
        email,
        name,
        role,
        phone
      }]);

      set({ 
        user: {
          ...data.user,
          username: name,
          role
        } as User, 
        isAuthenticated: true 
      });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  },
}));