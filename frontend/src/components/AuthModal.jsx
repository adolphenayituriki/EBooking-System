import { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash, FaSpinner, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { signup, signin, guestSignup } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, onDone }) {
  const { login } = useAuth();
  const [tab, setTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (tab === 'signup') {
      if (!form.name.trim()) errs.name = 'Name is required';
    }
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password.trim()) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fn = tab === 'signin' ? signin : signup;
      const { user } = await fn(form);
      login(user);
      toast.success(tab === 'signin' ? 'Welcome back!' : 'Account created!');
      onDone?.(user);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const { user } = await guestSignup({
        name: 'Guest',
        email: 'guest-' + Date.now() + '@akarabo.rw',
        phone: '',
      });
      login(user);
      onDone?.(user);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-black px-5 pt-5 pb-4 text-white relative">
          <button onClick={onClose} className="absolute top-3 right-3 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes className="text-[10px] text-white/70" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
              <FaUserCircle className="text-gray-400 text-base" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold">{tab === 'signin' ? 'Welcome Back' : 'Create Account'}</h3>
              <p className="text-gray-400 text-[11px] mt-0.5">
                {tab === 'signin' ? 'Sign in to manage your bookings' : 'Register to track your reservations'}
              </p>
            </div>
          </div>
          {/* Tab switcher */}
          <div className="flex bg-gray-800 rounded-lg p-0.5 mt-1">
            {['signin', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                  tab === t ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
          {tab === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1"><FaUser className="inline mr-1 text-gray-400 text-[10px]" />Name</label>
                <input
                  className={`w-full px-3 py-2 bg-slate-50/80 border rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}`}
                  value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1"><FaPhone className="inline mr-1 text-gray-400 text-[10px]" />Phone</label>
                <input
                  className="w-full px-3 py-2 bg-slate-50/80 border border-gray-200 rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all"
                  value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+250 788..."
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1"><FaEnvelope className="inline mr-1 text-gray-400 text-[10px]" />Email</label>
            <input
              type="email"
              className={`w-full px-3 py-2 bg-slate-50/80 border rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}`}
              value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1"><FaLock className="inline mr-1 text-gray-400 text-[10px]" />Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className={`w-full px-3 py-2 bg-slate-50/80 border rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all pr-9 ${errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}`}
                value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 6 characters" minLength={6}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative text-center"><span className="bg-white px-2 text-[10px] text-gray-400">or</span></div>
          </div>

          <button type="button" onClick={handleGuest} disabled={loading} className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-xs hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-1.5">
            Continue as Guest <FaArrowRight className="text-[9px]" />
          </button>

          {tab === 'signin' && (
            <p className="text-center text-[10px] text-gray-400">
              No account?{' '}
              <button type="button" onClick={() => { setTab('signup'); setErrors({}); }} className="text-gray-900 font-semibold hover:text-black">Create one</button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
