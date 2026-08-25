"use client";

import {useState,useActionState} from 'react';
import {registerAction} from '@/app/actions/auth';
import {Eye,EyeOff} from 'lucide-react';
import {authStyles as s } from '@/styles/auth';

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';

export function RegisterForm(){
    const [state,formAction,isPending] = useActionState(registerAction,undefined);
    const [email,setEmail] = useState("");
    const [name,setName] = useState("");
    const [storeName,setStoreName] = useState('');
    const [showPassword,setShowPassword] = useState(false);

    return(
        <form className={s.form} action={formAction} noValidate>
          
          {/* 4. Display any errors returned by the Server Action */}
          {state?.error && (
            <div className={s.errorBanner} role="alert">
              {state.error}
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-4">
            {/* Full Name Field*/}
            <div>
              <Label htmlFor="name" className={s.label}>Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value = {name|| state?.fields?.name || ''}
                onChange={(e)=>setName(e.target.value)}
                className={s.input}
                placeholder="John Doe"
              />
            </div>

            {/*Email Address Field*/}
            <div>
              <Label htmlFor="email" className={s.label}>Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value = {email || state?.fields?.email || ''}
                onChange = {(e)=>setEmail(e.target.value)}
                className={s.input}
                placeholder="you@example.com"
              />
            </div>

            {/*Store name field*/}
             <div>
              <Label htmlFor="storeName" className={s.label}>Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                type="text"
                required
                value = {storeName || state?.fields?.storeName || ''}
                onChange = {(e)=>setStoreName(e.target.value)}
                placeholder="Store Name"
                className = {s.input}
              />
            </div>

            <div>
              <Label htmlFor="password" className={s.label}>Password</Label>
              <div className = {s.passwordContainer}>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text':'password'}
                required
                className={s.passwordInput}
                placeholder="••••••••"
              />
              <Button 
                type = "button" 
                variant = "ghost" 
                size = "icon" 
                className = {s.passwordToggle}
                onClick ={()=>setShowPassword(!showPassword)}
                aria-label = {showPassword ? 'Hide password': 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className = 'h-4 w-4'/>
                  ): (
                    <Eye className = 'h-4 w-4'/>
                  )}
                </Button>
              </div>
            </div>
          </div>

          
            {/* 5. Insert our smart button */}
          <Button type = 'submit' disabled = {isPending}
            className = {s.submitBtn}>
              {isPending ? 'Registering account and store' : 'Sign Up'}
          </Button>
          
        </form>
    )
}