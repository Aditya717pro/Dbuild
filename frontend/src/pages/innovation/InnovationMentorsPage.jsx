import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import { StatusBadge } from './helpers.jsx';

const EMPTY_PROFILE = {
  user_id: '',
  expertise: '',
  bio: '',
  availability: '',
  max_mentees: 5,
  is_available: true,
};

const EMPTY_REQUEST = {
  mentor_id: '',
  idea_id: '',
  project_id: '',
  message: '',
};

function RequestDialog({ request, user, onClose, onChanged }) {
  const [scheduledAt, setScheduledAt] = useState(
    request.scheduled_at ? String(request.scheduled_at).replace(' ', 'T').slice(0, 16) : '',
  );
  const [notes, setNotes] = useState(request.mentor_notes || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isMentor = request.mentor_id === user.id;
  const isStudent = request.student_id === user.id;
  const canManage = user.role === 'admin' || isMentor;

  async function update(nextStatus) {
    setBusy(true);
    setError('');
    try {
      await api.put(`/innovation/mentor-requests/${request.id}`, {
        status: nextStatus,
        scheduled_at: scheduledAt || null,
        mentor_notes: notes || null,
      });
      await onChanged();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Mentoring request"
      size="lg"
      footer={(
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          {isStudent && !isMentor && ['pending', 'accepted'].includes(request.status) && (
            <button type="button" className="btn btn-danger" onClick={() => update('cancelled')} disabled={busy}>
              Cancel request
            </button>
          )}
          {canManage && request.status === 'pending' && (
            <>
              <button type="button" className="btn btn-secondary" onClick={() => update('rejected')} disabled={busy}>Decline</button>
              <button type="button" className="btn btn-primary" onClick={() => update('accepted')} disabled={busy}>Accept request</button>
            </>
          )}
          {canManage && request.status === 'accepted' && (
            <button type="button" className="btn btn-primary" onClick={() => update('completed')} disabled={busy}>Mark completed</button>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={request.status} />
          <span className="text-xs text-slate-500">Requested {formatDate(request.created_at, { withTime: true })}</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p><span className="font-semibold text-slate-800">Student:</span> {request.student_name}</p>
          <p className="mt-1"><span className="font-semibold text-slate-800">Mentor:</span> {request.mentor_name}</p>
          {request.idea_title && <p className="mt-1"><span className="font-semibold text-slate-800">Idea:</span> {request.idea_title}</p>}
          {request.project_title && <p className="mt-1"><span className="font-semibold text-slate-800">Project:</span> {request.project_title}</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student message</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{request.message}</p>
        </div>
        {canManage && (
          <>
            <Field label="Session date and time">
              <TextInput type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
            </Field>
            <Field label="Mentor notes">
              <TextArea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </Field>
          </>
        )}
        {!canManage && request.mentor_notes && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentor notes</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{request.mentor_notes}</p>
          </div>
        )}
        {request.scheduled_at && (
          <p className="text-sm text-indigo-700">
            Scheduled for {formatDate(request.scheduled_at, { withTime: true })}
          </p>
        )}
      </div>
    </Modal>
  );
}

export default function InnovationMentorsPage() {
  const { user } = useAuth();
  const mentorsQuery = useApiData('/innovation/mentors');
  const requestsQuery = useApiData('/innovation/mentor-requests');
  const facultyQuery = useApiData('/faculty', { enabled: user?.role === 'admin' });
  const ideasQuery = useApiData('/innovation/ideas', { enabled: user?.role === 'student' });
  const projectsQuery = useApiData('/innovation/projects', { enabled: user?.role === 'student' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState(EMPTY_REQUEST);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [busy, setBusy] = useState(false);

  const mentors = useMemo(() => mentorsQuery.data?.mentors || [], [mentorsQuery.data]);
  const requests = useMemo(() => requestsQuery.data?.requests || [], [requestsQuery.data]);
  const faculty = useMemo(() => facultyQuery.data?.faculty || [], [facultyQuery.data]);
  const ideas = useMemo(
    () => (ideasQuery.data?.ideas || []).filter((idea) => idea.submitted_by === user.id),
    [ideasQuery.data, user.id],
  );
  const projects = useMemo(
    () => (projectsQuery.data?.projects || []).filter((project) => project.owner_id === user.id),
    [projectsQuery.data, user.id],
  );

  const filteredMentors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mentors;
    return mentors.filter((mentor) => (
      [mentor.name, mentor.expertise, mentor.department_name, mentor.designation]
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [mentors, search]);

  function openProfileCreate() {
    setEditingProfile(null);
    setProfileForm(EMPTY_PROFILE);
    setProfileOpen(true);
  }

  function openProfileEdit(mentor) {
    setEditingProfile(mentor);
    setProfileForm({
      user_id: mentor.user_id,
      expertise: mentor.expertise || '',
      bio: mentor.bio || '',
      availability: mentor.availability || '',
      max_mentees: mentor.max_mentees || 5,
      is_available: Boolean(mentor.is_available),
    });
    setProfileOpen(true);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...profileForm,
        max_mentees: Number(profileForm.max_mentees),
      };
      if (editingProfile) {
        await api.put(`/innovation/mentors/${editingProfile.user_id}`, payload);
      } else {
        await api.post('/innovation/mentors', payload);
      }
      setProfileOpen(false);
      await mentorsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openRequest(mentor) {
    setRequestForm({ ...EMPTY_REQUEST, mentor_id: mentor.user_id });
    setRequestOpen(true);
  }

  async function sendRequest(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/innovation/mentor-requests', {
        ...requestForm,
        mentor_id: Number(requestForm.mentor_id),
        idea_id: requestForm.idea_id ? Number(requestForm.idea_id) : null,
        project_id: requestForm.project_id ? Number(requestForm.project_id) : null,
      });
      setRequestOpen(false);
      await requestsQuery.reload();
      await mentorsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function reloadRequests() {
    await requestsQuery.reload();
    await mentorsQuery.reload();
  }

  if (mentorsQuery.loading || requestsQuery.loading) return <PageLoader label="Loading mentor connect..." />;
  if (mentorsQuery.error) return <ErrorState message={mentorsQuery.error} onRetry={mentorsQuery.reload} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor connect"
        subtitle="Find faculty mentors, request support, and manage mentoring conversations."
        action={user.role === 'admin' ? (
          <button type="button" className="btn btn-primary" onClick={openProfileCreate}>Add mentor profile</button>
        ) : null}
      />

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div>
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search mentors by name, expertise, or department..."
          className="sm:max-w-md"
        />
      </div>

      {filteredMentors.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No mentors listed"
            message="Mentor profiles created by the innovation cell will appear here."
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <article key={mentor.user_id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                    {mentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-900">{mentor.name}</h2>
                    <p className="text-xs text-slate-500">{mentor.designation || 'Faculty mentor'}</p>
                  </div>
                </div>
                <span className={`badge ${mentor.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {mentor.is_available ? 'Available' : 'Full'}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-indigo-700">{mentor.expertise}</p>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                {mentor.bio || 'Faculty mentor supporting student innovation and startup teams.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{mentor.department_code || 'No department'}</span>
                <span>{mentor.active_requests} active request(s)</span>
                <span>Up to {mentor.max_mentees} mentees</span>
              </div>
              {mentor.availability && <p className="mt-2 text-xs text-slate-500">Availability: {mentor.availability}</p>}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                {user.role === 'student' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openRequest(mentor)}
                    disabled={!mentor.is_available}
                  >
                    Request mentoring
                  </button>
                )}
                {(user.role === 'admin' || mentor.user_id === user.id) && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openProfileEdit(mentor)}>
                    Edit profile
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Mentoring requests</h2>
          <p className="text-sm text-slate-500">
            {user.role === 'student' ? 'Your requests and mentor responses.' : user.role === 'faculty' ? 'Requests assigned to you.' : 'All mentoring requests across the portal.'}
          </p>
        </div>
        {requests.length === 0 ? (
          <EmptyState title="No mentoring requests" message="New requests will appear here." />
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((request) => (
              <div key={request.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {request.student_name} → {request.mentor_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {request.idea_title || request.project_title || 'General mentoring request'} · {formatDate(request.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={request.status} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedRequest(request)}>
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title={editingProfile ? 'Edit mentor profile' : 'Add mentor profile'}
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setProfileOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={saveProfile} disabled={busy}>
              {busy ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={saveProfile}>
          {!editingProfile && (
            <Field label="Faculty member">
              <SelectInput
                value={profileForm.user_id}
                onChange={(event) => setProfileForm({ ...profileForm, user_id: event.target.value })}
                required
              >
                <option value="">Select faculty member</option>
                {faculty.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.name} — {member.department_name || 'No department'}
                  </option>
                ))}
              </SelectInput>
            </Field>
          )}
          <Field label="Areas of expertise">
            <TextInput
              value={profileForm.expertise}
              onChange={(event) => setProfileForm({ ...profileForm, expertise: event.target.value })}
              placeholder="AI, product design, IoT, business strategy..."
              required
              maxLength={300}
            />
          </Field>
          <Field label="Short bio">
            <TextArea rows={3} value={profileForm.bio} onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })} maxLength={3000} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Availability">
              <TextInput
                value={profileForm.availability}
                onChange={(event) => setProfileForm({ ...profileForm, availability: event.target.value })}
                placeholder="Tue & Thu, 2–4 PM"
                maxLength={300}
              />
            </Field>
            <Field label="Maximum mentees">
              <TextInput
                type="number"
                min="1"
                max="100"
                value={profileForm.max_mentees}
                onChange={(event) => setProfileForm({ ...profileForm, max_mentees: event.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={profileForm.is_available}
              onChange={(event) => setProfileForm({ ...profileForm, is_available: event.target.checked })}
              className="rounded border-slate-300 text-indigo-600"
            />
            Currently accepting mentoring requests
          </label>
        </form>
      </Modal>

      <Modal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request a mentor"
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setRequestOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={sendRequest} disabled={busy}>
              {busy ? 'Sending...' : 'Send request'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={sendRequest}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Mentor">
            <SelectInput value={requestForm.mentor_id} onChange={(event) => setRequestForm({ ...requestForm, mentor_id: event.target.value })} required>
              <option value="">Select mentor</option>
              {mentors.filter((mentor) => mentor.is_available).map((mentor) => (
                <option key={mentor.user_id} value={mentor.user_id}>{mentor.name} — {mentor.expertise}</option>
              ))}
            </SelectInput>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Related idea" hint="Optional">
              <SelectInput value={requestForm.idea_id} onChange={(event) => setRequestForm({ ...requestForm, idea_id: event.target.value })}>
                <option value="">No specific idea</option>
                {ideas.map((idea) => <option key={idea.id} value={idea.id}>{idea.title}</option>)}
              </SelectInput>
            </Field>
            <Field label="Related project" hint="Optional">
              <SelectInput value={requestForm.project_id} onChange={(event) => setRequestForm({ ...requestForm, project_id: event.target.value })}>
                <option value="">No specific project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
              </SelectInput>
            </Field>
          </div>
          <Field label="What support do you need?">
            <TextArea
              rows={4}
              value={requestForm.message}
              onChange={(event) => setRequestForm({ ...requestForm, message: event.target.value })}
              required
              minLength={10}
              maxLength={3000}
              placeholder="Describe the guidance you are looking for..."
            />
          </Field>
        </form>
      </Modal>

      {selectedRequest && (
        <RequestDialog
          request={selectedRequest}
          user={user}
          onClose={() => setSelectedRequest(null)}
          onChanged={reloadRequests}
        />
      )}
    </div>
  );
}
