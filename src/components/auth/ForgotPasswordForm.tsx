import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const resetPassword = useAuthStore(state => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await resetPassword(email);
      setStatus('success');
    } catch (err) {
      setError('Failed to send reset password email');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Password reset instructions have been sent to your email
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Reset Instructions'}
      </button>
    </form>
  );
}