import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow access to all pages
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /app/* routes - require authentication
    if (request.nextUrl.pathname.startsWith('/app') && !user) {
      console.log('No user found in middleware, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to app if already logged in and trying to access login/registro
    if (
      (request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/registro') &&
      user
    ) {
      console.log('User already logged in, redirecting to app');
      return NextResponse.redirect(new URL('/app/chat', request.url));
    }

    console.log('Middleware passed, user:', user?.email || 'none');
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: ['/app/:path*', '/login', '/registro'],
};
