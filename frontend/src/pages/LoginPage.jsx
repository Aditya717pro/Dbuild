import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PageLoader } from '../components/States.jsx';
import { api } from '../services/api.js';
import collegeBuilding from '../assets/college-building.jpg';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    allowed: ['student'],
    userPlaceholder: 'Roll No / Email',
  },
  {
    id: 'staff',
    label: 'Staff',
    allowed: ['faculty'],
    userPlaceholder: 'Staff ID / Email',
  },
  {
    id: 'admin',
    label: 'Admin',
    allowed: ['admin'],
    userPlaceholder: 'Admin Email',
  },
];

function dashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'faculty') return '/faculty/dashboard';
  return '/student/dashboard';
}

export default function LoginPage({ defaultRole = 'student' }) {
  const { user, loading, setSession } = useAuth();
  const navigate = useNavigate();

  const initialRoleId =
    defaultRole === 'admin' ? 'admin' : defaultRole === 'faculty' ? 'staff' : 'student';

  const [role, setRole] = useState(initialRoleId);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const selectedRole = ROLES.find((item) => item.id === role) || ROLES[0];

  function selectRole(nextRole) {
    setRole(nextRole);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', {
        email: identifier.trim(),
        password,
      });

      if (!selectedRole.allowed.includes(response.user.role)) {
        setError(`This login is for ${selectedRole.label.toLowerCase()} accounts only. Select the correct tab above.`);
        return;
      }

      if (typeof setSession === 'function') {
        setSession(response.token, response.user);
      }
      navigate(dashboardPath(response.user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat overflow-x-hidden selection:bg-indigo-500 selection:text-white"
      style={{ backgroundImage: `url(${collegeBuilding})` }}
    >
      {/* Light, crystal-clear subtle ambient layer to ensure text contrast while keeping amphitheater and campus bright & vibrant */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-black/10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Left Navigation Link */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-indigo-600 hover:shadow-lg active:scale-95"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>Back to Portal Home</span>
      </Link>

      {/* Transparent / Frosted Glass Login Box */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[400px]">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 hover:bg-white/85">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-800 sm:text-4xl">
              HIT
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
              Sign in to continue
            </p>
          </div>

          {/* Segmented Role Switcher: Student | Staff | Admin */}
          <div className="mt-6 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-1.5 backdrop-blur-sm">
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => selectRole('student')}
              className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all duration-200 ${
                role === 'student'
                  ? 'bg-white shadow-sm ring-1 ring-slate-900/5 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:bg-white/40 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[#059669] mb-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs tracking-tight">Student</span>
            </button>

            {/* Staff Tab */}
            <button
              type="button"
              onClick={() => selectRole('staff')}
              className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all duration-200 ${
                role === 'staff'
                  ? 'bg-white shadow-sm ring-1 ring-slate-900/5 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:bg-white/40 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-[#7c3aed] mb-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 11l-3 3-2-2" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs tracking-tight">Staff</span>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => selectRole('admin')}
              className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-white shadow-sm ring-1 ring-slate-900/5 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:bg-white/40 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-[#0284c7] mb-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs tracking-tight">Admin</span>
            </button>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 backdrop-blur-sm animate-fadeIn">
                <svg className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* User ID Field */}
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={selectedRole.userPlaceholder}
                aria-label={`${selectedRole.label} ID or email`}
                className="w-full rounded-2xl border border-slate-200/90 bg-white/75 px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 shadow-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-indigo-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                aria-label={`${selectedRole.label} password`}
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

            {/* Sign In Button */}
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

          {/* App Version matching screenshot */}
          <div className="mt-8 text-center">
            <p className="text-[11px] font-mono tracking-wide text-slate-400">
              App Version: v1.0.35+56
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

