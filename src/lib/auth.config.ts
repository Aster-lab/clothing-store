import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    providers: [],
    callbacks: {
        // Add user data to jwt token
        async jwt({token,user}) {
            if(user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.storeId = (user as any).storeId;
            }
            return token;
        },

        // Add user data to session
        async session({session, token}) {
            if(token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.storeId = token.storeId as string;
            }
            return session;
        }
    }
    
} satisfies NextAuthConfig;