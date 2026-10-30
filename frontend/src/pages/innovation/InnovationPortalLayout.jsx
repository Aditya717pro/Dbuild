import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const TABS = [
  { to: '/innovation/portal', label: 'Dashboard', end: true },
  { to: '/innovation/portal/ideas', label: 'Ideas' },
  { to: '/innovation/portal/projects', label: 'Projects' },
  { to: '/innovation/portal/startups', label: 'Startup Incubator' },
  { to: '/innovation/portal/mentors', label: 'Mentor Connect' },
  { to: '/innovation/portal/events', label: 'Events' },
  { to: '/innovation/portal/lab', label: 'IDEA Lab' },
  { to: '/innovation/portal/research', label: 'Research & Patents' },
  { to: '/innovation/portal/admin', label: 'Admin', adminOnly: true },
];

export default function InnovationPortalLayout() {
  const { user } = useAuth();
  const tabs = TABS.filter((tab) => !tab.adminOnly || user?.role === 'admin');

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Innovation & Startup Management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Build. Mentor. Incubate.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">
              Turn ideas into prototypes and ventures through the AICTE IDEA Lab,
              Startup TN pre-incubation support, mentors, events, research, and patents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 lg:text-center">
            {['Idea to prototype', 'Mentor network', 'Startup support', 'Innovation events'].map((item) => (
              <span key={item} className="rounded-lg bg-white/10 px-3 py-2 font-medium backdrop-blur">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
