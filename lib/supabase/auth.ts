import { createSupabaseClient } from './client';
import type { Profile } from '../types';

export async function signUpWithEmail(
  email: string,
  password: string,
  nombre: string,
  universidad?: string
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        nombre,
        universidad: universidad || '',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = createSupabaseClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates: Partial<Profile>) {
  const supabase = createSupabaseClient();
  const user = await getCurrentUser();

  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function resetConsultasMes() {
  const supabase = createSupabaseClient();
  const user = await getCurrentUser();

  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('profiles')
    .update({ consultas_mes: 0 })
    .eq('id', user.id);

  if (error) throw error;
  return data;
}
