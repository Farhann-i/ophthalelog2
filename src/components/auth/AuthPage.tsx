import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Eye } from 'lucide-react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Eye className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' && 'Sign in to your account'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'signin' && <SignInForm />}
          {mode === 'signup' && <SignUpForm />}
          {mode === 'forgot' && <ForgotPasswordForm />}
          
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Need an account? Sign up
                </button>
                <button
                  onClick={() => setMode('forgot')}
                  className="block w-full text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
              </>
            )}
            {(mode === 'signup' || mode === 'forgot') && (
              <button
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-500"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}