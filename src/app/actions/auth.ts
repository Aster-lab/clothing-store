'use server';

import {signIn, signOut} from '@/lib/auth';
import {AuthError} from 'next-auth';
import {db} from '@/lib/db';
import bcrypt  from 'bcryptjs';

export interface ActionState {
    error?: string;
    success? : boolean;
    fields?: {
        name?: string;
        email?: string;
        storeName?: string;
    }
}

//LogIn action
export async function logInAction(
    prevState : ActionState |undefined,
    formData: FormData 
) : Promise<ActionState> {
        const email = (formData.get("email") as string)?.trim().toLowerCase();
        const password = formData.get('password') as string;

        const fields = {email}
        if(!email || ! password) return {error: 'Please fill in all fields.'};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return {error: 'Please enter a valid email address. '};
        
        try {

            const user =await db.user.findUnique({ where: {email}});
            if(!user) return {error:'Invalid email or password'};
            
            let destination = '/';
            if (user.role === 'SUPERADMIN') {
                destination = '/superadmin/dashboard';
            } else if (user.role === 'ADMIN') {
                destination = '/admin/dashboard';
            }
            await signIn('credentials',{
                email : email,
                password: password,
                redirectTo : destination,
            });
            return {success: true};
        } catch(error) {
            if(error instanceof AuthError){
                switch(error.type){
                    case 'CredentialsSignin':
                        return {error: 'Invalid email or password'};
                    default:
                        return {error: 'Unexpected Authentication error occured.'}
                }
            }
            throw error;
    }
}

// Register Action
export async function registerAction(
    prevState: ActionState | undefined,
    formData : FormData
) : Promise<ActionState> {
    const name = (formData.get('name')as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = formData.get('password') as string;
    const storeName = (formData.get('storeName') as string)?.trim();

    const fields = {name,email,storeName};

    if(!name||!email||!password||!storeName) {
        return {error: 'All fields are required.'};
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))    return {error: 'Invalid email format.'};

    if (password.length<8) return { error: 'Password must be at least 8 characters long.'};

    if(name.length>20) return {error: 'User names must be less than 20 characters.'}

    try {
        const existingUser = await db.user.findUnique({ where: {email}});
        if(existingUser) return {error: 'This email is already in use.'};

        const hashedPassword = await bcrypt.hash(password,10);

        //create both user and store row - if one fails, both fail
        await db.$transaction(async (tx)=>{
            //create store first
            const newStore = await tx.store.create({
                data: { name: storeName},
            });

            await tx.user.create({
                data: { name,email,password:hashedPassword,role:'ADMIN',storeId: newStore.id,}
            })
        })

        await signIn('credentials',{
            email: email,
            password: password,
            redirectTo : '/',
        });
        return {success: true};
    } catch(error) {
        if (error instanceof AuthError) {
            return {error: 'Account Created.but auto-login failed.'};
        }
        throw error;
    }
    
}



//LogOut action
export async function logoutAction() {
    await signOut({redirectTo: '/login'});
}