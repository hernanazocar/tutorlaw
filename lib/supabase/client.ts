import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient() {
  const supabaseUrl = 'https://kzwtmnwmndupbctchwne.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d3RtbndtbmR1cGJjdGNod25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDY0NzIsImV4cCI6MjA5MTMyMjQ3Mn0.pi3bF2qMRD_Ab-8yXNaenrKNbCsuDNdoav3-ratltx4';

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
}
