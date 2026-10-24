import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Alert, PageLoader } from '../../components/States.jsx';
import { Field, TextInput } from '../../components/FormControls.jsx';
import { siteConfig } from '../../config/siteConfig.js';
import { api, setToken } from '../../services/api.js';

export default function AdminLoginPage() {
  const { user, loading, setSession, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader />;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      if (response?.user?.role !== 'admin') {
        logout();
        setError('This route is for administrators only.');
        return;
      }
      setToken(response.token);
      if (typeof setSession === 'function') {
        setSession(response.token, response.user);
      }
      const destination = location.state?.from;
      navigate(destination && destination !== '/admin/login' ? destination : '/admin/dashboard', { replace: true });
    } catch (err) {
      logout();
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
              {siteConfig.shortName}
            </div>
            <div>
              <h1 className="text-lg font-semibold">Admin Login</h1>
              <p className="text-xs text-white/70">Restricted access</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Alert message={error} onClose={() => setError('')} />

            <Field label="Email address" htmlFor="email">
              <TextInput id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@college.example" />
            </Field>

            <Field label="Password" htmlFor="password">
              <TextInput id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </Field>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
