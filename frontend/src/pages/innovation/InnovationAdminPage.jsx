import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  InnovationStat,
  StatusBadge,
  prettyLabel,
} from './helpers.jsx';

const MODULES = [
  ['Ideas', '/innovation/portal/ideas', 'Review submissions and assign mentors'],
  ['Projects', '/innovation/portal/projects', 'Feature prototypes and track progress'],
  ['Startups', '/innovation/portal/startups', 'Pre-incubation applications and stages'],
  ['Mentors', '/innovation/portal/mentors', 'Mentor profiles and requests'],
  ['Events', '/innovation/portal/events', 'Create events and manage registrations'],
  ['IDEA Lab', '/innovation/portal/lab', 'Equipment inventory and bookings'],
  ['Research', '/innovation/portal/research', 'Research records and patent filings'],
];

export default function InnovationAdminPage() {
  const dashboard = useApiData('/innovation/dashboard');
  const ideasQuery = useApiData('/innovation/ideas');
  const startupsQuery = useApiData('/innovation/startups');
  const requestsQuery = useApiData('/innovation/mentor-requests');
  const bookingsQuery = useApiData('/innovation/lab/bookings');
  const [broadcast, setBroadcast] = useState({ audience: 'all', title: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (dashboard.loading) return <PageLoader label="Loading admin console..." />;
  if (dashboard.error) return <ErrorState message={dashboard.error} onRetry={dashboard.reload} />;

  const stats = dashboard.data?.stats || {};
  const ideas = (ideasQuery.data?.ideas || []).filter((idea) => ['submitted', 'under_review'].includes(idea.status));
  const startups = (startupsQuery.data?.startups || []).filter((startup) => ['submitted', 'under_review'].includes(startup.application_status));
  const mentorRequests = (requestsQuery.data?.requests || []).filter((request) => request.status === 'pending');
  const labBookings = (bookingsQuery.data?.bookings || []).filter((booking) => booking.status === 'pending');

  async function sendBroadcast(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await api.post('/innovation/notifications/broadcast', broadcast);
      setBroadcast({ audience: 'all', title: '', message: '' });
      setNotice('Broadcast notification sent.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Innovation admin console"
        subtitle="Moderation queues, incubation decisions, and portal-wide communication."
      />

      <div className="space-y-3">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={notice} onClose={() => setNotice('')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InnovationStat label="Ideas awaiting action" value={ideas.length} hint="Submitted or under review" tone="amber" />
        <InnovationStat label="Startup applications" value={startups.length} hint="Submitted or under review" tone="emerald" />
        <InnovationStat label="Mentor requests" value={mentorRequests.length} hint="Pending faculty response" tone="indigo" />
        <InnovationStat label="Lab bookings" value={labBookings.length} hint="Awaiting approval" tone="sky" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Idea moderation queue</h2>
            <Link to="/innovation/portal/ideas" className="text-sm font-semibold text-indigo-600">Open ideas</Link>
          </div>
          {ideas.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No ideas awaiting review.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {ideas.slice(0, 6).map((idea) => (
                <div key={idea.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{idea.title}</p>
                    <p className="text-xs text-slate-500">{idea.owner_name} · {idea.category} · {formatDate(idea.created_at)}</p>
                  </div>
                  <StatusBadge value={idea.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Startup applications</h2>
            <Link to="/innovation/portal/startups" className="text-sm font-semibold text-indigo-600">Open startups</Link>
          </div>
          {startups.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No startup applications awaiting review.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {startups.slice(0, 6).map((startup) => (
                <div key={startup.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{startup.name}</p>
                    <p className="text-xs text-slate-500">{startup.founder_name} · {prettyLabel(startup.stage)}</p>
                  </div>
                  <StatusBadge value={startup.application_status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Mentoring requests</h2>
            <Link to="/innovation/portal/mentors" className="text-sm font-semibold text-indigo-600">Open mentor connect</Link>
          </div>
          {mentorRequests.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No pending mentoring requests.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {mentorRequests.slice(0, 6).map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{request.student_name} → {request.mentor_name}</p>
                    <p className="text-xs text-slate-500">{request.idea_title || request.project_title || 'General mentoring'}</p>
                  </div>
                  <StatusBadge value={request.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">IDEA Lab approvals</h2>
            <Link to="/innovation/portal/lab" className="text-sm font-semibold text-indigo-600">Open lab bookings</Link>
          </div>
          {labBookings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No pending lab booking requests.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {labBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{booking.user_name}</p>
                    <p className="text-xs text-slate-500">
                      {booking.equipment_name || booking.facility} · {formatDate(booking.requested_date)} · {booking.start_time}–{booking.end_time}
                    </p>
                  </div>
                  <StatusBadge value={booking.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Portal management</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MODULES.map(([label, to, description]) => (
              <Link
                key={to}
                to={to}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900">Send broadcast</h2>
          <p className="mt-1 text-sm text-slate-500">Notify portal users about deadlines, events, or incubation updates.</p>
          <form className="mt-4 space-y-3" onSubmit={sendBroadcast}>
            <Field label="Audience">
              <SelectInput
                value={broadcast.audience}
                onChange={(event) => setBroadcast({ ...broadcast, audience: event.target.value })}
              >
                <option value="all">Everyone</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admins</option>
              </SelectInput>
            </Field>
            <Field label="Title">
              <TextInput
                value={broadcast.title}
                onChange={(event) => setBroadcast({ ...broadcast, title: event.target.value })}
                required
                maxLength={200}
              />
            </Field>
            <Field label="Message">
              <TextArea
                rows={4}
                value={broadcast.message}
                onChange={(event) => setBroadcast({ ...broadcast, message: event.target.value })}
                required
                minLength={3}
                maxLength={3000}
              />
            </Field>
            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              {busy ? 'Sending...' : 'Send notification'}
            </button>
          </form>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-800">Portal totals</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <p>Projects: {stats.projects || 0}</p>
              <p>Startups: {stats.startups || 0}</p>
              <p>Research: {stats.research || 0}</p>
              <p>Patents: {stats.patents || 0}</p>
              <p>Mentors: {stats.mentors || 0}</p>
              <p>Events: {stats.upcoming_events || 0} upcoming</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
