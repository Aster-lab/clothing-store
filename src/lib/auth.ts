import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {authConfig} from './auth.config';
import {db} from './db';
import bcrypt from 'bcrypt';

export const {handlers, auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email', placeholder: 'Enter your email'},
                password: {label: 'Password', type: 'password', placeholder: 'Enter your password'},
            },
            async authorize(credentials) {
                // Validate structure first
                if(!credentials?.email || !credentials?.password) return null;
                

                const email = credentials.email as string;
                const password = credentials.password as string;
                // find user in database
                try {
                    const user = await db.user.findUnique({
                        where: {email},
                    });
                    if(!user) return null;

                    //compare password
                    const isValid = await bcrypt.compare(password, user.password);
                    if(!isValid) return null;
                
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            } catch (error){
                console.error("Authentication error: ", error);
                return null;
            }
            },      
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,

        // Add user data to jwt token
        async jwt({token,user}) {
            if(user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },

        // Add user data to session
        async session({session, token}) {
            if(token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    }
})