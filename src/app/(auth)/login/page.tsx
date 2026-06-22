'use client';

import {useState,useActionState} from 'react';
import Link from 'next/link';
import {Eye,EyeOff} from 'lucide-react';
import {logInAction} from '@/app/actions/auth';
import {authStyles as s } from '@/styles/auth';

import {Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import  {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from '@/components/ui/card';

export default function LoginPage(){
    const [state,formAction,isPending] = useActionState(logInAction,undefined)
    const [email,setEmail] = useState('');
    const [showPassword,setShowPassword] = useState(false);

    return (
    <div className={s.container}>
      <Card className={s.card}>
        <CardHeader className={s.header}>
          <CardTitle className={s.title}>Sign in</CardTitle>
          <CardDescription className={s.description}>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className = 'px-4 sm:px-6'>
          <form action={formAction} noValidate className={s.form}>
            
            {/* Error Banner styled with Tailwind color variables */}
            {state?.error && (
              <div className={s.errorBanner} role="alert">
                {state.error}
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {/* Email Field */}
              <div className={s.inputGroup}>
                <Label htmlFor="email" className={s.label}>Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email || state?.fields?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className = {s.input}
                />
              </div>

              {/* Password Field */}
              <div className={s.inputGroup}>
                <Label htmlFor="password" className={s.label}>Password</Label>
                <div className={s.passwordContainer}>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className={s.passwordInput}// Keeps text from hiding under the icon
                  />
                  {/* Shadcn Ghost Button positioned absolutely */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={s.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className={s.submitBtn} disabled={isPending}>
              {isPending ? "Verifying..." : "Sign In"}
            </Button>
          </form>
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