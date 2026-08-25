import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { response, redirect } from '@/lib/utils';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

// routes
const ROUTES = {
    public: new Set(['/login', '/register']),
    admin: '/dashboard',
    superadmin: '/superadmin',
    api: '/api',
    authApi: '/api/auth',
    default: '/',
}

export default auth((req) => {
    const { nextUrl } = req;
    const { pathname } = nextUrl;

    const isLoggedIn = !!req.auth?.user;
    const user = req.auth?.user as any;
    const userRole = user?.role;
    const storeId = user?.storeId;

    const apiRoute = pathname.startsWith(ROUTES.api);

    console.log('debug: ',{isLoggedIn,userRole,pathname})

    // 1. Bypass the auth api endpoints entirely
    if (pathname.startsWith(ROUTES.authApi)) return NextResponse.next();

    // 2. If user already logged in and attempts to hit a public page (login/register)
    if (ROUTES.public.has(pathname)) {
        // 🚀 FIX: Swapped nextUrl for req.url to resolve the absolute redirect root properly
        if (isLoggedIn) return redirect(ROUTES.admin, req.url);  
        return NextResponse.next();  
    }

    // 3. Protection Layer: If user is not logged in
    if (!isLoggedIn) {
        if (apiRoute) return response({ error: 'Unauthorized: Access token missing or invalid' }, 401);
        // 🚀 FIX: Swapped nextUrl for req.url to cleanly prevent the loop
        return redirect('/login', req.url);
    }

    // Look for where you handle public routes/login routes in middleware.ts:
    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    if (isLoggedIn) {
        // 🚀 Fix: Use an absolute URL constructor here to prevent relative routing glitches
        return NextResponse.redirect(new URL('/dashboard/products', req.url));
    }
    return NextResponse.next();
}

    // 4. Admin Role Verification
   if (pathname.startsWith(ROUTES.admin)) {
    // If the user isn't an ADMIN or SUPERADMIN
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        if (apiRoute) {
            return response({ error: 'Forbidden: Admin access required' }, 403);
        }
        
        // 🚀 THE FIX: Convert the destination route into an absolute Next.js URL
        console.log("🛑 Redirecting unauthorized user from admin panel to fallback.");
        return NextResponse.redirect(new URL(ROUTES.default, req.url));
    }
    
    // Clear passage! The user is an ADMIN, let them pass to the layout page files
        return NextResponse.next();
    }
    
    // 5. SuperAdmin Role Verification
    if (pathname.startsWith(ROUTES.superadmin)) {
        if (userRole !== 'SUPERADMIN') {
            if (apiRoute) return response({ error: 'Forbidden: SuperAdmin access required' }, 403);
            return redirect(ROUTES.admin + '/dashboard', req.url);
        }
    }

    return NextResponse.next();
});

export const config = {
  // This regex matches all routes EXCEPT api, _next/static, _next/image, and favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};