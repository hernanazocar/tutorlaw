import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Autenticación no disponible. Por favor contacta al administrador para configurar las credenciales.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const value = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
        return value ? decodeURIComponent(value) : undefined;
      },
      set(name: string, value: string, options: any) {
        let cookie = `${name}=${encodeURIComponent(value)}`;
        if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options?.path) cookie += `; path=${options.path}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
        if (options?.secure) cookie += '; secure';
        document.cookie = cookie;
      },
      remove(name: string, options: any) {
        this.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}
