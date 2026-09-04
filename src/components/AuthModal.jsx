import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase'; 
import { Lock, Mail, UserPlus, LogIn, AlertCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error('Firebase Auth Error:', err);

      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Invalid email or password.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/Password sign-in is not enabled in Firebase Console.');
          break;
        case 'auth/invalid-api-key':
        case 'auth/api-key-not-valid':
          setError('Invalid Firebase API key in .env file.');
          break;
        default:
          setError(`Authentication failed: ${err.message || 'Please check your connection.'}`);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-[#1B3B2B]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-[#B89748]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#1B3B2B]/20 relative z-10 transition-all">
        
        {/* Header Section */}
        <div className="bg-[#1B3B2B] text-white p-6 sm:p-8 text-center border-b-4 border-[#B89748] relative">
          <div className="inline-flex items-center justify-center gap-1.5 bg-[#B89748]/20 text-[#B89748] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3 border border-[#B89748]/30">
            <Sparkles size={12} />
            <span>Official Portal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Life & Love Forum
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1 italic font-light">
            Attendance & Session Management
          </p>
        </div>

        {/* Form Body Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              {isSignUp 
                ? 'Sign up to create and manage your session logs' 
                : 'Sign in to access your program sessions'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-3.5 text-slate-400 group-focus-within:text-[#1B3B2B] transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete={isSignUp ? 'email' : 'email'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-[#1B3B2B]/20 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3B2B] focus:ring-4 focus:ring-[#1B3B2B]/10 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-3.5 text-slate-400 group-focus-within:text-[#1B3B2B] transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50/50 border border-[#1B3B2B]/20 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3B2B] focus:ring-4 focus:ring-[#1B3B2B]/10 focus:outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3B2B] hover:bg-[#142d21] active:scale-[0.99] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Section & Switch Mode Button */}
          <div className="pt-4 border-t border-[#B89748]/20 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-bold text-[#1B3B2B] hover:text-[#142d21] hover:underline focus:outline-none transition-colors ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}