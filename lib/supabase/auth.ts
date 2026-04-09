import { createSupabaseClient } from './client';
import type { Profile } from '../types';

export async function signUpWithEmail(
  email: string,
  password: string,
  nombre: string,
  universidad?: string
) {
  try {
    const supabase = createSupabaseClient();
    console.log('Supabase client created successfully');

    console.log('Attempting sign up with email:', email);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log('Sign up response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Caught error in signUpWithEmail:', err);
    throw err;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = createSupabaseClient();
    console.log('Attempting sign in with email:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response:', { data, error });

    if (error) {
      console.error('Supabase sign in error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Caught error in signInWithEmail:', err);
    throw err;
  }
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
