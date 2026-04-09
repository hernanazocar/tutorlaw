import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('DEBUG - Supabase URL:', supabaseUrl);
  console.log('DEBUG - Anon Key exists:', !!supabaseAnonKey);
  console.log('DEBUG - Anon Key length:', supabaseAnonKey?.length);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Autenticación no disponible. Por favor contacta al administrador para configurar las credenciales.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
