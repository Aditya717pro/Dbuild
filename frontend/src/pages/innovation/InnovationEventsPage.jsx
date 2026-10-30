import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate, todayISO } from '../../utils/format.js';
import {
  EVENT_TYPES,
  StatusBadge,
  prettyLabel,
} from './helpers.jsx';

const EMPTY_EVENT = {
  title: '',
  type: 'hackathon',
  description: '',
  event_date: todayISO(),
  start_time: '',
  end_time: '',
  venue: '',
  registration_deadline: '',
  max_participants: '',
  team_size_min: 1,
  team_size_max: 1,
  status: 'upcoming',
};

const EMPTY_REGISTRATION = { team_name: '', team_members: '' };

function eventToForm(event) {
  return {
    title: event.title || '',
    type: event.type || 'hackathon',
    description: event.description || '',
    event_date: event.event_date || todayISO(),
    start_time: event.start_time ? String(event.start_time).slice(0, 5) : '',
    end_time: event.end_time ? String(event.end_time).slice(0, 5) : '',
    venue: event.venue || '',
    registration_deadline: event.registration_deadline || '',
    max_participants: event.max_participants ?? '',
    team_size_min: event.team_size_min || 1,
    team_size_max: event.team_size_max || 1,
    status: event.status || 'upcoming',
  };
}

function RegistrationsDialog({ event, onClose }) {
  const registrationsQuery = useApiData(`/innovation/events/${event.id}/registrations`);
  const [error, setError] = useState('');
  const registrations = registrationsQuery.data?.registrations || [];

  async function changeStatus(registration, status) {
    setError('');
    try {
      await api.put(`/innovation/events/${event.id}/registrations/${registration.id}`, { status });
      await registrationsQuery.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Registrations — ${event.title}`} size="xl">
      <div className="space-y-4">
        <Alert type="error" message={error} onClose={() => setError('')} />
        {registrationsQuery.error && <ErrorState message={registrationsQuery.error} onRetry={registrationsQuery.reload} />}
        {registrationsQuery.loading ? (
          <PageLoader label="Loading registrations..." />
        ) : registrations.length === 0 ? (
          <EmptyState title="No registrations yet" message="Participant registrations will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Participant</th>
                  <th className="th">Team</th>
                  <th className="th">Registered</th>
                  <th className="th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="td">
                      <p className="font-medium text-slate-900">{registration.user_name}</p>
                      <p className="text-xs text-slate-500">{registration.user_email}</p>
                    </td>
                    <td className="td">
                      <p>{registration.team_name || 'Individual'}</p>
                      {registration.team_members && <p className="text-xs text-slate-500">{registration.team_members}</p>}
                    </td>
                    <td className="td text-xs text-slate-500">{formatDate(registration.created_at)}</td>
                    <td className="td">
                      <SelectInput
                        className="w-auto min-w-[8rem]"
                        value={registration.status}
                        onChange={(changeEvent) => changeStatus(registration, changeEvent.target.value)}
                      >
                        {['registered', 'waitlisted', 'attended', 'cancelled'].map((status) => (
                          <option key={status} value={status}>{prettyLabel(status)}</option>
                        ))}
                      </SelectInput>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function InnovationEventsPage() {
  const { user } = useAuth();
  const eventsQuery = useApiData('/innovation/events');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [eventOpen, setEventOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [busy, setBusy] = useState(false);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [registration, setRegistration] = useState(EMPTY_REGISTRATION);
  const [registrationsEvent, setRegistrationsEvent] = useState(null);

  const events = useMemo(() => eventsQuery.data?.events || [], [eventsQuery.data]);
  const isAdmin = user.role === 'admin';

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      if (statusFilter && event.status !== statusFilter) return false;
      if (!term) return true;
      return [event.title, event.venue, event.type, event.description]
        .some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [events, search, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_EVENT);
    setEventOpen(true);
  }

  function openEdit(event) {
    setEditing(event);
    setForm(eventToForm(event));
    setEventOpen(true);
  }

  async function saveEvent() {
    setBusy(true);
    setError('');
    const payload = {
      ...form,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      registration_deadline: form.registration_deadline || null,
      max_participants: form.max_participants === '' ? null : Number(form.max_participants),
      team_size_min: Number(form.team_size_min),
      team_size_max: Number(form.team_size_max),
    };
    try {
      if (editing) {
        await api.put(`/innovation/events/${editing.id}`, payload);
      } else {
        await api.post('/innovation/events', payload);
      }
      setEventOpen(false);
      await eventsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteEvent(event) {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/events/${event.id}`);
      await eventsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openRegister(event) {
    setRegistration(EMPTY_REGISTRATION);
    setRegisterEvent(event);
  }

  async function submitRegistration(submitEvent) {
    submitEvent.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api.post(`/innovation/events/${registerEvent.id}/register`, registration);
      setRegisterEvent(null);
      setNotice(
        result.registration?.status === 'waitlisted'
          ? 'Event is full — you have been added to the waitlist.'
          : 'Registration confirmed.',
      );
      await eventsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (eventsQuery.loading) return <PageLoader label="Loading innovation events..." />;
  if (eventsQuery.error) return <ErrorState message={eventsQuery.error} onRetry={eventsQuery.reload} />;

  return (
    <div>
      <PageHeader
        title="Innovation events"
        subtitle="Hackathons, ideathons, workshops, and entrepreneurship challenges."
        action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openCreate}>Create event</button> : null}
      />

      <div className="space-y-3">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={notice} onClose={() => setNotice('')} />
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events..."
          className="sm:max-w-sm"
        />
        <SelectInput value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="sm:max-w-xs">
          <option value="">All statuses</option>
          {['upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
            <option key={status} value={status}>{prettyLabel(status)}</option>
          ))}
        </SelectInput>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={events.length ? 'No matching events' : 'No events scheduled'}
            message="New innovation events will appear here."
            action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openCreate}>Create event</button> : null}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <article key={event.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="badge bg-indigo-50 text-indigo-700">{prettyLabel(event.type)}</span>
                <StatusBadge value={event.status} />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{event.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{event.description}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>{formatDate(event.event_date)}{event.start_time ? ` · ${String(event.start_time).slice(0, 5)}` : ''}</p>
                <p>{event.venue}</p>
                {event.registration_deadline && <p>Registration closes {formatDate(event.registration_deadline)}</p>}
                <p>
                  {event.registration_count} registered
                  {event.max_participants ? ` of ${event.max_participants}` : ''}
                  {event.team_size_max > 1 ? ` · Teams of ${event.team_size_min}–${event.team_size_max}` : ' · Individual'}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                {event.is_registered ? (
                  <span className="badge bg-emerald-100 text-emerald-700">You are registered</span>
                ) : ['completed', 'cancelled'].includes(event.status) ? (
                  <span className="text-xs text-slate-400">Registration closed</span>
                ) : (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openRegister(event)}>
                    Register
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(event)}>Edit</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRegistrationsEvent(event)}>
                      Registrations
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteEvent(event)} disabled={busy}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        title={editing ? 'Edit event' : 'Create innovation event'}
        size="xl"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setEventOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={saveEvent} disabled={busy}>
              {busy ? 'Saving...' : editing ? 'Save changes' : 'Create event'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Event title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength={200} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event type">
              <SelectInput value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                {EVENT_TYPES.map((type) => <option key={type} value={type}>{prettyLabel(type)}</option>)}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
                  <option key={status} value={status}>{prettyLabel(status)}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <Field label="Description">
            <TextArea
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
              minLength={20}
              maxLength={5000}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event date">
              <TextInput type="date" value={form.event_date} onChange={(event) => setForm({ ...form, event_date: event.target.value })} required />
            </Field>
            <Field label="Venue">
              <TextInput value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} required maxLength={200} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start time">
              <TextInput type="time" value={form.start_time} onChange={(event) => setForm({ ...form, start_time: event.target.value })} />
            </Field>
            <Field label="End time">
              <TextInput type="time" value={form.end_time} onChange={(event) => setForm({ ...form, end_time: event.target.value })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Registration deadline">
              <TextInput
                type="date"
                value={form.registration_deadline}
                onChange={(event) => setForm({ ...form, registration_deadline: event.target.value })}
                max={form.event_date}
              />
            </Field>
            <Field label="Maximum participants" hint="Leave blank for unlimited.">
              <TextInput
                type="number"
                min="1"
                value={form.max_participants}
                onChange={(event) => setForm({ ...form, max_participants: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum team size">
              <TextInput
                type="number"
                min="1"
                value={form.team_size_min}
                onChange={(event) => setForm({ ...form, team_size_min: event.target.value })}
              />
            </Field>
            <Field label="Maximum team size">
              <TextInput
                type="number"
                min="1"
                value={form.team_size_max}
                onChange={(event) => setForm({ ...form, team_size_max: event.target.value })}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(registerEvent)}
        onClose={() => setRegisterEvent(null)}
        title={registerEvent ? `Register — ${registerEvent.title}` : 'Event registration'}
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setRegisterEvent(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={submitRegistration} disabled={busy}>
              {busy ? 'Registering...' : 'Confirm registration'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={submitRegistration}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          {registerEvent && (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {formatDate(registerEvent.event_date)} · {registerEvent.venue}
              {registerEvent.team_size_max > 1 ? ` · Teams of ${registerEvent.team_size_min}–${registerEvent.team_size_max}` : ' · Individual entry'}
            </p>
          )}
          <Field label="Team name" hint={registerEvent?.team_size_max > 1 ? 'Required for team events.' : 'Optional for individual events.'}>
            <TextInput
              value={registration.team_name}
              onChange={(event) => setRegistration({ ...registration, team_name: event.target.value })}
              maxLength={120}
              required={registerEvent?.team_size_max > 1}
            />
          </Field>
          <Field label="Team members" hint="Names and roll numbers, separated by commas.">
            <TextArea
              rows={3}
              value={registration.team_members}
              onChange={(event) => setRegistration({ ...registration, team_members: event.target.value })}
              maxLength={3000}
            />
          </Field>
        </form>
      </Modal>

      {registrationsEvent && (
        <RegistrationsDialog event={registrationsEvent} onClose={() => setRegistrationsEvent(null)} />
      )}
    </div>
  );
}
