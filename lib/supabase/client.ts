import { createClient } from '@supabase/supabase-js';

// Hardcoded values for testing - TEMPORARY
const SUPABASE_URL = 'https://kzwtmnwmndupbctchwne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d3RtbndtbmR1cGJjdGNod25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDY0NzIsImV4cCI6MjA5MTMyMjQ3Mn0.pi3bF2qMRD_Ab-8yXNaenrKNbCsuDNdoav3-ratltx4';

// Create singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function createSupabaseClient() {
  // Return existing instance if available
  if (supabaseInstance) return supabaseInstance;

  console.log('Creating Supabase client with URL:', SUPABASE_URL);

  // Create new instance with hardcoded values
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  return supabaseInstance;
}
