import { createClient } from '@supabase/supabase-js';

// Custom storage that syncs to cookies
const cookieStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;

    // Try localStorage first
    const item = window.localStorage.getItem(key);
    if (item) {
      // Also set as cookie for server-side access
      document.cookie = `${key}=${encodeURIComponent(item)}; path=/; max-age=31536000; SameSite=Lax`;
    }
    return item;
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;

    // Set in localStorage
    window.localStorage.setItem(key, value);

    // Also set as cookie for server-side access
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;

    // Remove from localStorage
    window.localStorage.removeItem(key);

    // Remove cookie
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};

export function createSupabaseClient() {
  const supabaseUrl = 'https://kzwtmnwmndupbctchwne.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d3RtbndtbmR1cGJjdGNod25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDY0NzIsImV4cCI6MjA5MTMyMjQ3Mn0.pi3bF2qMRD_Ab-8yXNaenrKNbCsuDNdoav3-ratltx4';

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: cookieStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });
}
