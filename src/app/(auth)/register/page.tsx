
import Link from 'next/link';
import {authStyles as s } from '@/styles/auth';
import {RegisterForm} from '@/components/auth/registerForm';
import {ThemeToggle} from '@/components/theme-toggle';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle} from '@/components/ui/card';


// function for submit button
// function SubmitButton(){
//   const {pending} = useFormStatus();

//   return (
//     <button type='submit' disabled={pending}
//     className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
//       {pending? 'Registering account....':'Sign Up'}
//     </button>
//   );
// }

export default function RegisterPage(){

  return (
    <div className={s.container}>
      <div className = {s.theme}>
        <ThemeToggle/>
      </div>
      <Card className={s.card}>
        
        <CardHeader className={s.header}>
          <CardTitle className={s.title}>Create your account</CardTitle>
          <CardDescription className={s.description}>Get started with your new profile instantly.</CardDescription>
        </CardHeader>

        {/* 3. Pass the formAction directly to the action attribute */}
        <CardContent className = 'px-4 sm:px-6'>
          <RegisterForm/>
        </CardContent>

        <CardFooter className={s.footer}>
          <p className = {s.footerText}>
          Already registered?{" "}
          <Link href="/login" className={s.footerLink}>
            Sign in here
          </Link>
        </p>
        </CardFooter>

      </Card>
    </div>
  ); 
}