import { supabase } from '../config/supabase';

export interface UserSignUp {
  email: string;
  password: string;
  role: 'mentor' | 'resident';
  name: string;
  phone: string;
}

export const authService = {
  async signUp({ email, password, role, name, phone }: UserSignUp) {
    // First create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
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

    if (signUpError) throw signUpError;

    // Create user profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: authData.user?.id,
        email,
        role,
        name,
        phone,
        created_at: new Date().toISOString()
      }]);

    if (profileError) throw profileError;

    return authData.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cerulean-tapioca-0823c0.netlify.app/auth/callback'
      }
    });
    if (error) throw error;
    return data;
  },

  async signInWithPhone(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone
    });
    if (error) throw error;
    return data;
  },

  async verifyOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }


};