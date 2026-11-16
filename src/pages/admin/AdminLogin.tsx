import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@prithvigrid.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#ffffff] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background radial graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#F4A300_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-[#1E293B] border border-slate-700/60 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B3C5D] text-[#F4A300] mb-4 shadow-lg border border-[#F4A300]/20">
            <ShieldCheck size={28} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#F4A300] font-semibold block mb-2">
            Staff Portal
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#ffffff] tracking-wide">
            PrithviGrid Admin
          </h1>
          <p className="text-[#94a3b8] text-xs mt-2">
            Sign in to manage client inquiries, quotes, and project database.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#cbd5e1] block mb-2 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-12 py-3.5 text-sm text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#F4A300] transition-colors"
                placeholder="admin@prithvigrid.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#cbd5e1] block mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-12 py-3.5 text-sm text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#F4A300] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F4A300] text-[#000000] font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#e09400] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center text-xs text-[#94a3b8]">
          <p>
            Default Login:{' '}
            <span className="text-[#F4A300] font-mono font-bold">admin@prithvigrid.com</span> /{' '}
            <span className="text-[#F4A300] font-mono font-bold">Admin@12345</span>
          </p>
          <div className="mt-4">
            <Link to="/" className="text-[#cbd5e1] hover:text-[#ffffff] transition-colors underline">
              Return to Website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

