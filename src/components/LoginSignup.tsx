import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Heart, Mail, Lock, User, UserCircle } from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface Props {
  onSuccess: () => void;
}

export function LoginSignup({ onSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      } else {
        // Sign up
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-62259918/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ email, password, name, role })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Signup failed');
        } else {
          // Auto login after signup
          await supabase.auth.signInWithPassword({ email, password });
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">HealthSync</h1>
          <p className="text-gray-600">Smart Health Data Management Platform</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">I am a</label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={role === 'patient'}
                        onChange={(e) => setRole(e.target.value as 'patient')}
                        className="text-indigo-600"
                      />
                      <span className="text-gray-700">Patient</span>
                    </label>
                    <label className="flex-1 flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="doctor"
                        checked={role === 'doctor'}
                        onChange={(e) => setRole(e.target.value as 'doctor')}
                        className="text-indigo-600"
                      />
                      <span className="text-gray-700">Doctor</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900 mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-blue-700">Doctor: sarah.johnson@healthsync.com</p>
              <p className="text-blue-700">Password: demo123</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            ⚠️ <strong>Demo Only:</strong> This is a prototype. Do not use for real medical data.
            Site Under Maintenence!!! Copyright To Shivamsingh @Team RhytmBytes 
          </p>
        </div>
      </div>
    </div>
  );
}
