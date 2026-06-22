import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;

            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            const isSuperAdminRoute = nextUrl.pathname.startsWith('/superadmin');
            const isOnLogin = nextUrl.pathname === '/login';
            const isRegister = nextUrl.pathname === '/register';
            const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

            // 1. Allow all default NextAuth API flows
            if (isApiAuthRoute) return true;

            // 2. Redirect logged-in users away from auth pages
            if (isOnLogin || isRegister) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            // 3. Global Auth Guard: Catch all unauthenticated requests
            if (!isLoggedIn) {
                if (nextUrl.pathname.startsWith('/api')) {
                    return Response.json({ error: 'Unauthorized' }, { status: 401 });
                }
                return Response.redirect(new URL('/login', nextUrl));
            }

            // -----------------------------------------------------------------
            // Safe Zone: From here down, the user is GUARANTEED to be logged in
            // -----------------------------------------------------------------

            // 4. Protect Admin Routes
            if (isAdminRoute) {
                if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
                    return Response.redirect(new URL("/", nextUrl)); // Kick to home page
                }
            }

            // 5. Protect Superadmin Routes
            if (isSuperAdminRoute) {
                if (userRole !== "SUPERADMIN") {
                    return Response.redirect(new URL("/admin", nextUrl)); // Kick to regular admin dashboard
                }
            }
     
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;