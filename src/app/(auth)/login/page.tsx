import Link from 'next/link';
import {authStyles as s } from '@/styles/auth';
import {LoginForm}  from '@/components/auth/LoginForm';
import {ThemeToggle} from '@/components/theme-toggle';
import  {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from '@/components/ui/card';

export default function LoginPage(){
    return (
    <div className={s.container}>
      {/* Theme toggle*/}
      <div className = {s.theme}>
        <ThemeToggle/>
      </div>
      <Card className={s.card}>
        <CardHeader className={s.header}>
          <CardTitle className={s.title}>Sign in</CardTitle>
          <CardDescription className={s.description}>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className = 'px-4 sm:px-6'>
          <LoginForm/>
        </CardContent>

        <CardFooter className={s.footer}>
          <p className={s.footerText}>
            New here?{" "}
            <Link href="/register" className={s.footerLink}>
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  ); 
}