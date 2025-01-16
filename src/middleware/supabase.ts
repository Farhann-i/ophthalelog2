import { supabase } from '../config/supabase';

export const withAuth = async (callback: Function) => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('Unauthorized');
  }
  
  return callback(session.user);
};

export const getUserProfile = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
};

export const updateUserProfile = async (updates: any) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('No user logged in');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id);

  if (error) throw error;
  return data;
};