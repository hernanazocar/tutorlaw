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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

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
