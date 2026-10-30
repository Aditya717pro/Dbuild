import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import { EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  InnovationStat,
  StatusBadge,
  prettyLabel,
} from './helpers.jsx';

const STATUS_COLORS = {
  draft: '#94a3b8',
  submitted: '#0ea5e9',
  under_review: '#f59e0b',
  approved: '#10b981',
  rejected: '#f43f5e',
  prototype_development: '#8b5cf6',
  completed: '#059669',
};

function StatusChart({ breakdown }) {
  const entries = Object.entries(breakdown || {}).filter(([, count]) => Number(count) > 0);
  const total = entries.reduce((sum, [, count]) => sum + Number(count), 0);

  if (!total) {
    return (
      <EmptyState
        title="No idea activity yet"
        message="Status analytics will appear as ideas move through review."
      />
    );
  }

  let cursor = 0;
  const segments = entries.map(([status, count]) => {
    const start = cursor;
    const size = (Number(count) / total) * 100;
    cursor += size;
    return `${STATUS_COLORS[status] || '#6366f1'} ${start}% ${cursor}%`;
  });

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div
        className="relative mx-auto h-36 w-36 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${segments.join(', ')})` }}
        aria-label="Idea status distribution"
      >
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">ideas</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {entries.map(([status, count]) => (
          <div key={status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[status] || '#6366f1' }}
              />
              {prettyLabel(status)}
            </span>
            <span className="font-semibold text-slate-900">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ role }) {
  const actions = role === 'admin'
    ? [
      ['Review ideas', '/innovation/portal/admin'],
      ['Manage events', '/innovation/portal/events'],
      ['IDEA Lab requests', '/innovation/portal/lab'],
      ['Mentor network', '/innovation/portal/mentors'],
    ]
    : role === 'faculty'
      ? [
        ['Mentoring requests', '/innovation/portal/mentors'],
        ['Assigned projects', '/innovation/portal/projects'],
        ['Research & patents', '/innovation/portal/research'],
        ['Upcoming events', '/innovation/portal/events'],
      ]
      : [
        ['Submit an idea', '/innovation/portal/ideas'],
        ['Find a mentor', '/innovation/portal/mentors'],
        ['Register for event', '/innovation/portal/events'],
        ['Book IDEA Lab', '/innovation/portal/lab'],
      ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {actions.map(([label, to]) => (
        <Link key={to} to={to} className="btn btn-secondary justify-start">
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function InnovationDashboardPage() {
  const { user } = useAuth();
  const dashboard = useApiData('/innovation/dashboard');
  const data = dashboard.data;

  if (dashboard.loading) return <PageLoader label="Loading innovation dashboard..." />;
  if (dashboard.error) return <ErrorState message={dashboard.error} onRetry={dashboard.reload} />;

  const stats = data?.stats || {};

  async function markRead(id) {
    await api.post(`/innovation/notifications/${id}/read`);
    await dashboard.reload();
  }

  async function markAllRead() {
    await api.post('/innovation/notifications/read-all');
    await dashboard.reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${user?.name?.split(' ')[0] || 'Innovation'} dashboard`}
        subtitle="A live view of ideas, projects, mentors, events, and incubation activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InnovationStat
          label={user?.role === 'faculty' ? 'Assigned ideas' : 'Innovation ideas'}
          value={stats.ideas}
          hint={`${stats.approved_ideas || 0} approved`}
          tone="indigo"
        />
        <InnovationStat
          label="Active projects"
          value={stats.active_projects}
          hint={`${stats.projects || 0} total projects`}
          tone="sky"
        />
        <InnovationStat
          label="Startups"
          value={stats.startups}
          hint={`${stats.approved_startups || 0} approved ventures`}
          tone="emerald"
        />
        <InnovationStat
          label="Upcoming events"
          value={stats.upcoming_events}
          hint={`${stats.mentors || 0} mentors available`}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Idea pipeline</h2>
              <p className="text-sm text-slate-500">Where ideas currently stand.</p>
            </div>
            <Link to="/innovation/portal/ideas" className="text-sm font-semibold text-indigo-600">
              View ideas
            </Link>
          </div>
          <StatusChart breakdown={data?.status_breakdown} />
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            {(data?.notifications || []).some((item) => !item.is_read) && (
              <button type="button" className="text-xs font-semibold text-indigo-600" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          {!data?.notifications?.length ? (
            <EmptyState title="You're all caught up" message="New updates will appear here." />
          ) : (
            <div className="space-y-2">
              {data.notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => !notification.is_read && markRead(notification.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    notification.is_read
                      ? 'border-slate-100 bg-white'
                      : 'border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                    {!notification.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.message}</p>
                  <p className="mt-2 text-[11px] text-slate-400">{formatDate(notification.created_at, { withTime: true })}</p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent ideas</h2>
            <Link to="/innovation/portal/ideas" className="text-sm font-semibold text-indigo-600">
              All ideas
            </Link>
          </div>
          {!data?.recent_ideas?.length ? (
            <EmptyState
              title="No ideas yet"
              message={user?.role === 'student' ? 'Submit your first idea to get started.' : 'Student ideas will appear here.'}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent_ideas.map((idea) => (
                <Link
                  key={idea.id}
                  to="/innovation/portal/ideas"
                  className="flex flex-col gap-2 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{idea.title}</p>
                    <p className="text-xs text-slate-500">
                      {idea.category} · {idea.owner_name} {idea.department_code ? `· ${idea.department_code}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.attachment_count > 0 && (
                      <span className="text-xs text-slate-400">{idea.attachment_count} file(s)</span>
                    )}
                    <StatusBadge value={idea.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4">
              <QuickActions role={user?.role} />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming events</h2>
            {!data?.upcoming_events?.length ? (
              <p className="mt-3 text-sm text-slate-500">No upcoming events scheduled.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {data.upcoming_events.map((event) => (
                  <div key={event.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                      <StatusBadge value={event.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(event.event_date)} · {event.venue}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {(stats.pending_mentor_requests > 0 || stats.pending_lab_bookings > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/innovation/portal/mentors" className="card flex items-center justify-between p-5 transition hover:border-indigo-200">
            <div>
              <p className="font-semibold text-slate-900">Pending mentor requests</p>
              <p className="text-sm text-slate-500">Keep mentoring conversations moving.</p>
            </div>
            <span className="text-3xl font-bold text-amber-600">{stats.pending_mentor_requests}</span>
          </Link>
          <Link to="/innovation/portal/lab" className="card flex items-center justify-between p-5 transition hover:border-indigo-200">
            <div>
              <p className="font-semibold text-slate-900">IDEA Lab requests</p>
              <p className="text-sm text-slate-500">Review equipment and facility bookings.</p>
            </div>
            <span className="text-3xl font-bold text-indigo-600">{stats.pending_lab_bookings}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
