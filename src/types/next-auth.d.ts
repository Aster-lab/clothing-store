import NextAuth,{type DefaultSession } from 'next-auth';
import {type JWT as DefaultJWT} from 'next-auth/jwt';

declare module 'next-auth' {
    interface User{
        role?:string;
    }
    interface Session {
        user: {
            id:string;
            role?:string;
        } & DefaultSession["user"];
    }

    interface User {
        id? : string;
        role? : string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id?:string;
        role?:string;
    }
}
