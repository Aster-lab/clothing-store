import NextAuth,{type DefaultSession } from 'next-auth';
import {type JWT as DefaultJWT} from 'next-auth/jwt';

declare module 'next-auth' {
    interface User{
        id?: string;
        email?: string |null;
        name?: string | null;
        role:string;
        storeId: string |null;
    }
    interface Session {
        user: {
            id:string;
            role?:string;
            storeId: string;
        } & DefaultSession["user"];
    }
    

}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id?:string;
        role?:string;
        storeId : string |null;
    }
}
