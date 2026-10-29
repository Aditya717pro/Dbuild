import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../../components/States.jsx';
import collegeBuilding from '../../assets/college-building.jpg';

function dashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'faculty') return '/faculty/dashboard';
  return '/student/dashboard';
}

const LOGIN_OPTIONS = [
  {
    to: '/login/student',
    title: 'Student Login',
    description: 'View your enrolled courses and your own attendance record.',
    badge: 'Student',
    accent: 'from-amber-500 to-orange-500',
    ring: 'ring-amber-200 hover:ring-amber-300',
    icon: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
  },
  {
    to: '/login/teacher',
    title: 'Teacher Login',
    description: 'Mark attendance and review attendance for every student.',
    badge: 'Teacher',
    accent: 'from-emerald-500 to-teal-500',
    ring: 'ring-emerald-200 hover:ring-emerald-300',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 11l-3 3-2-2" />
      </>
    ),
  },
  {
    to: '/login/admin',
    title: 'Admin Login',
    description: 'Manage departments, courses, students, faculty and attendance.',
    badge: 'Admin',
    accent: 'from-sky-600 to-indigo-600',
    ring: 'ring-sky-200 hover:ring-sky-300',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

export default function LoginPortalPage() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6"
      style={{ backgroundImage: `url(${collegeBuilding})` }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/10"
        aria-hidden="true"
      />

      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md transition hover:bg-white hover:text-indigo-600 sm:left-6 sm:top-6"
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

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center text-white">
          <h1 className="font-serif text-4xl font-bold tracking-wider drop-shadow-md sm:text-5xl">
            HIT
          </h1>
          <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
            Choose your portal to sign in
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {LOGIN_OPTIONS.map((option) => (
            <Link
              key={option.to}
              to={option.to}
              className={`group flex flex-col rounded-3xl border border-white/70 bg-white/85 p-6 text-left shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-2 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:bg-white/95 ${option.ring}`}
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${option.accent} text-white shadow-md`}
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {option.icon}
                </svg>
              </span>

              <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {option.badge}
              </span>
              <span className="mt-1 text-xl font-bold text-slate-800">{option.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                {option.description}
              </span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                Continue
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
