import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if Supabase is properly configured
    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
      setError('Supabase configuration error. Please check environment variables.');
      setLoading(false);
      return;
    }

    // Skip connection test for now to avoid timeout issues
    console.log('Skipping connection test, proceeding directly with auth...');

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 5000); // 5 second timeout

    try {
      if (isSignUp) {
        console.log('Attempting signup with email:', email);
        console.log('Current origin:', window.location.origin);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        console.log('Signup response:', { data, error });
        
        if (error) {
          throw error;
        }
        
        if (data.user && !data.session) {
          // Email confirmation required
          setError('Please check your email for a confirmation link and click it to activate your account. Then try signing in again.');
          setLoading(false);
          return;
        }
        
        if (data.session) {
          // User is automatically signed in (email confirmation disabled)
          onAuthSuccess();
        }
        
        // If neither condition is met, try to sign in directly
        if (data.user) {
          console.log('Attempting direct signin after signup...');
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            setError('Account created but sign-in failed. Please try signing in manually.');
          } else {
            onAuthSuccess();
          }
        }
      } else {
        console.log('Attempting signin with email:', email);
        console.log('Current origin:', window.location.origin);
        
        // Try a more direct approach with better error handling
        try {
          console.log('Attempting to sign in with existing credentials...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          console.log('Signin response:', { data, error });
          
          if (error) {
            console.error('Signin error details:', error);
            if (error.message.includes('Invalid login credentials')) {
              setError('Invalid email or password. Please try again.');
              return;
            } else {
              throw error;
            }
          }
          
          if (data?.user) {
            console.log('Signin successful:', data.user.email);
            onAuthSuccess();
          } else {
            setError('Authentication failed. Please try again.');
          }
        } catch (authError) {
          console.error('Auth error:', authError);
          if (authError instanceof Error) {
            setError(authError.message);
          } else {
            setError('Authentication failed. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.error('Supabase Anon Key length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('timeout')) {
          setError('Connection timeout. Please try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

    return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-600">
          {isSignUp 
            ? 'Sign up to save your prompts and access your history' 
            : 'Sign in to continue using Prompthis'
          }
        </p>
        {!isSignUp && (
          <p className="text-sm text-gray-500 mt-2">
            Don't have an account? The system will create one for you automatically.
          </p>
        )}
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {error && (
          <div className={`border rounded-lg p-3 ${
            error.includes('Account created successfully') 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm ${
              error.includes('Account created successfully') 
                ? 'text-gray-700' 
                : 'text-red-700'
            }`}>{error}</p>
            {error.includes('Account created successfully') && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  💡 Tip: You can try signing in directly with your email and password, or check your email for the confirmation link.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Try Sign In Instead
                </button>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              {isSignUp ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </button>
      </div>
    </div>
  );
}; 