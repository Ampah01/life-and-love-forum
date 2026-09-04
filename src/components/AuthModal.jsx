import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase'; 
import { Lock, Mail, UserPlus, LogIn, AlertCircle, Eye, EyeOff, Loader2, Heart, CalendarCheck } from 'lucide-react';

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
          setError('Oops! That email or password doesn\'t look quite right.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Try signing in!');
          break;
        case 'auth/weak-password':
          setError('Please choose a password with at least 6 characters.');
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
    <div className="min-h-screen bg-[#F7F5EC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Soft Decorative Background Blobs */}
      <div className="absolute top-10 -left-16 w-80 h-80 bg-[#1B3B2B]/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 -right-16 w-80 h-80 bg-[#B89748]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Main Card Container */}
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-[#1B3B2B]/10 relative z-10 transition-all duration-300">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#1B3B2B] to-[#254d38] text-white p-8 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="inline-flex items-center justify-center gap-2 bg-[#B89748]/25 text-amber-200 text-xs font-medium tracking-wide px-4 py-1.5 rounded-full mb-4 border border-[#B89748]/30 shadow-inner">
            <Heart size={13} className="text-[#B89748] fill-[#B89748]" />
            <span>Life & Love Forum</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isSignUp ? 'Join Our Community' : 'Welcome Back!'}
          </h1>
          
          {/* Included Attendance Session Focus */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-100/90 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
            <CalendarCheck size={14} className="text-[#B89748]" />
            <span className="font-medium">Attendance Session Portal</span>
          </div>
        </div>

        {/* Form Body Section */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-4 text-slate-400 group-focus-within:text-[#1B3B2B] transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete={isSignUp ? 'email' : 'email'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3B2B] focus:ring-4 focus:ring-[#1B3B2B]/10 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 text-slate-400 group-focus-within:text-[#1B3B2B] transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3B2B] focus:ring-4 focus:ring-[#1B3B2B]/10 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-lg transition-colors"
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
              className="w-full bg-[#1B3B2B] hover:bg-[#142d21] active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Just a moment...</span>
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
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              {isSignUp ? 'Already part of the family?' : "New here?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-bold text-[#1B3B2B] hover:text-[#B89748] focus:outline-none transition-colors ml-1 underline underline-offset-4 decoration-2"
              >
                {isSignUp ? 'Sign In' : 'Create an Account'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}