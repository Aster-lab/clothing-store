"use client";

import {useState,useActionState} from 'react';
import Link from 'next/link';
import {registerAction} from '@/app/actions/auth';


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
    const [state,formAction,isPending] = useActionState(registerAction,undefined);
    const [email,setEmail] = useState("");
    const [name,setName] = useState("");
    const [storeName,setStoreName] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with your new profile instantly.</p>
        </div>

        {/* 3. Pass the formAction directly to the action attribute */}
        <form className="mt-8 space-y-6" action={formAction} noValidate>
          
          {/* 4. Display any errors returned by the Server Action */}
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200" role="alert">
              {state.error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Full Name Field*/}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value = {name|| state?.fields?.name || ''}
                onChange={(e)=>setName(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="John Doe"
              />
            </div>

            {/*Email Address Field*/}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value = {email || state?.fields?.email || ''}
                onChange = {(e)=>setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/*Store name field*/}
             <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                id="storeName"
                name="storeName"
                type="text"
                required
                value = {storeName || state?.fields?.storeName || ''}
                onChange = {(e)=>setStoreName(e.target.value)}
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Store Name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
             {/* 5. Insert our smart button */}
            <button type = 'submit' disabled = {isPending}
            className = "flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isPending ? 'Registering account and store' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  ); 
}