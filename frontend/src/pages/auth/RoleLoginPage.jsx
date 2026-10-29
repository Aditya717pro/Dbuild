import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Alert, PageLoader } from '../../components/States.jsx';
import { api, setToken } from '../../services/api.js';
import collegeBuilding from '../../assets/college-building.jpg';

function getDashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'faculty') return '/faculty/dashboard';
  return '/student/dashboard';
}

export default function RoleLoginPage({ allowedRole, title, subtitle }) {
  const { user, loading, setSession, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader />;
  if (user) {
    if (user.role === allowedRole || (allowedRole === 'faculty' && user.role === 'admin')) {
      return <Navigate to={getDashboardPath(user.role)} replace />;
    }
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      if (response?.user?.role !== allowedRole) {
        logout();
        const roleLabel = allowedRole === 'faculty' ? 'teachers' : `${allowedRole}s`;
        setError(`This login is only for ${roleLabel}. Please use the correct login page.`);
        return;
      }
      setToken(response.token);
      if (typeof setSession === 'function') {
        setSession(response.token, response.user);
      }
      const destination = location.state?.from;
      navigate(destination && destination !== '/login' ? destination : getDashboardPath(response.user.role), { replace: true });
    } catch (err) {
      logout();
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat overflow-x-hidden selection:bg-indigo-500 selection:text-white"
      style={{ backgroundImage: `url(${collegeBuilding})` }}
    >
      {/* Light subtle ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-black/10 pointer-events-none" aria-hidden="true" />

      {/* Back button */}
      <Link
        to="/login"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-indigo-600 hover:shadow-lg active:scale-95"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>All Logins</span>
      </Link>

      {/* Transparent Glass Box */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[400px]">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-800">HIT</h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">{title || 'Sign in to continue'}</p>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Alert message={error} onClose={() => setError('')} />

            <div className="relative">
              <input
                id="email"
                type="text"
                autoComplete="off"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={allowedRole === 'student' ? 'Student ID' : 'Email'}
                className="w-full rounded-2xl border border-slate-200/90 bg-white/75 px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 shadow-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-indigo-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200/90 bg-white/75 px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-indigo-400 hover:text-indigo-600 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366f1] py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:bg-[#5254e0] hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[11px] font-mono tracking-wide text-slate-400">App Version: v1.0.35+56</p>
          </div>
        </div>
      </div>
    </div>
  );
}

