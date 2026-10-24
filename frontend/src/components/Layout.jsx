import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RoleBadge } from './States.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'faculty', 'student'] },
  { to: '/departments/manage', label: 'Departments', roles: ['admin'] },
  { to: '/courses', label: 'Courses', roles: ['admin', 'faculty', 'student'] },
  { to: '/students', label: 'Students', roles: ['admin', 'faculty'] },
  { to: '/students/manage', label: 'Manage Students', roles: ['admin'] },
  { to: '/faculty/manage-list', label: 'Manage Faculty', roles: ['admin'] },
  { to: '/faculty/manage', label: 'Faculty', roles: ['admin'] },
  { to: '/enrollments', label: 'Enrollments', roles: ['admin', 'faculty'] },
  { to: '/enrollments/manage', label: 'Manage Enrollments', roles: ['admin'] },
  { to: '/attendance', label: 'Attendance', roles: ['admin', 'faculty', 'student'] },
  { to: '/announcements', label: 'Announcements', roles: ['admin', 'faculty', 'student'] },
];

function MenuIcon({ open }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            CP
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">College Portal</p>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2">
              <RoleBadge role={user?.role} />
            </div>
          </div>
          <button type="button" className="btn btn-secondary w-full" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <MenuIcon open={sidebarOpen} />
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Sign out
            </button>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <RoleBadge role={user?.role} />
          </div>
          <button type="button" className="btn btn-ghost hidden md:inline-flex" onClick={handleLogout}>
            Sign out
          </button>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 md:px-6">
          College Management Portal
        </footer>
      </div>
    </div>
  );
}
