import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert } from '../components/States.jsx';
import { Field, TextInput } from '../components/FormControls.jsx';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    setError('Please use Student Login or Faculty Login from the navbar.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-indigo-700 p-8 text-white md:flex">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">
              CP
            </div>
            <h1 className="mt-8 text-3xl font-bold leading-tight">College Management Portal</h1>
            <p className="mt-3 text-sm text-indigo-100">
              Enrollment, faculty records, courses, attendance and announcements — all in one place.
            </p>
          </div>
          <ul className="mt-10 space-y-2 text-sm text-indigo-100">
            <li>Administrators manage the institution</li>
            <li>Faculty mark attendance and post updates</li>
            <li>Students track their own courses and attendance</li>
          </ul>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Use the Login dropdown in the top bar to choose Student or Faculty login.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Alert message={error} onClose={() => setError('')} />

            <Field label="Email address" htmlFor="email">
              <TextInput
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@college.example"
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <TextInput
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </Field>

            <button type="button" className="btn btn-primary w-full" onClick={() => navigate('/login/student')}>
              Go to Student Login
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-400">
            Contact your department administrator if you cannot access your account.
          </p>
        </div>
      </div>
    </div>
  );
}

