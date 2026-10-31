import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  STARTUP_STAGES,
  StatusBadge,
  formatCurrency,
  prettyLabel,
} from './helpers.jsx';

const EMPTY_FORM = {
  name: '',
  tagline: '',
  description: '',
  problem: '',
  solution: '',
  market_opportunity: '',
  business_model: '',
  team_members: '',
  funding_required: '',
  stage: 'idea_generation',
  website_url: '',
};

function startupToForm(startup) {
  return {
    name: startup.name || '',
    tagline: startup.tagline || '',
    description: startup.description || '',
    problem: startup.problem || '',
    solution: startup.solution || '',
    market_opportunity: startup.market_opportunity || '',
    business_model: startup.business_model || '',
    team_members: startup.team_members || '',
    funding_required: startup.funding_required ?? '',
    stage: startup.stage || 'idea_generation',
    website_url: startup.website_url || '',
  };
}

function StartupDetail({ startup, user, mentors, onClose, onChanged, onEdit }) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState(startup.application_status === 'draft' ? 'under_review' : startup.application_status);
  const [stage, setStage] = useState(startup.stage || 'idea_generation');
  const [mentorId, setMentorId] = useState(startup.mentor_id || '');
  const [note, setNote] = useState(startup.review_note || '');
  const [busy, setBusy] = useState(false);

  async function review(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/startups/${startup.id}/review`, {
        application_status: status,
        review_note: note || null,
        stage,
        mentor_id: mentorId || null,
      });
      setNotice('Startup review saved.');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isOwner = startup.founder_id === user.id;
  const canEdit = user.role === 'admin' || (isOwner && ['draft', 'rejected'].includes(startup.application_status));

  return (
    <Modal open onClose={onClose} title={startup.name} size="xl">
      <div className="space-y-5">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={notice} onClose={() => setNotice('')} />

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={startup.application_status} />
          <span className="badge bg-indigo-50 text-indigo-700">{prettyLabel(startup.stage)}</span>
          <span className="text-xs text-slate-500">
            Founded by {startup.founder_name} · {formatDate(startup.created_at)}
          </span>
        </div>

        {startup.tagline && <p className="text-lg font-medium text-slate-700">{startup.tagline}</p>}

        {startup.review_note && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <strong>Review note:</strong> {startup.review_note}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ['Description', startup.description],
            ['Problem', startup.problem || 'Not documented'],
            ['Solution', startup.solution || 'Not documented'],
            ['Market opportunity', startup.market_opportunity || 'Not documented'],
            ['Business model', startup.business_model || 'Not documented'],
            ['Team', startup.team_members || 'Not documented'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Funding required</p>
            <p className="mt-1 text-sm text-slate-800">{formatCurrency(startup.funding_required)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Mentor</p>
            <p className="mt-1 text-sm text-slate-800">{startup.mentor_name || 'Not assigned'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Website</p>
            {startup.website_url ? (
              <a href={startup.website_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-indigo-600">
                {startup.website_url}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-800">Not set</p>
            )}
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Submitted</p>
            <p className="mt-1 text-sm text-slate-800">{startup.submitted_at ? formatDate(startup.submitted_at) : 'Not submitted'}</p>
          </div>
        </div>

        {user.role === 'admin' && (
          <form className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4" onSubmit={review}>
            <h3 className="text-sm font-semibold text-indigo-900">Pre-incubation review</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="Application status">
                <SelectInput value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="under_review">Under review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </SelectInput>
              </Field>
              <Field label="Incubation stage">
                <SelectInput value={stage} onChange={(event) => setStage(event.target.value)}>
                  {STARTUP_STAGES.map((option) => <option key={option} value={option}>{prettyLabel(option)}</option>)}
                </SelectInput>
              </Field>
              <Field label="Mentor">
                <SelectInput value={mentorId} onChange={(event) => setMentorId(event.target.value)}>
                  <option value="">Keep current</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.user_id} value={mentor.user_id}>{mentor.name}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <Field label="Review note">
              <TextArea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            <button type="submit" className="btn btn-primary btn-sm mt-3" disabled={busy}>Save review</button>
          </form>
        )}

        {canEdit && (
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="button" className="btn btn-primary" onClick={onEdit}>Edit application</button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function InnovationStartupsPage() {
  const { user } = useAuth();
  const startupsQuery = useApiData('/innovation/startups');
  const mentorsQuery = useApiData('/innovation/mentors', { enabled: user?.role === 'admin' });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const startups = useMemo(() => startupsQuery.data?.startups || [], [startupsQuery.data]);
  const mentors = useMemo(() => mentorsQuery.data?.mentors || [], [mentorsQuery.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return startups;
    return startups.filter((startup) => (
      [startup.name, startup.tagline, startup.founder_name, startup.stage]
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [startups, search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(startup) {
    setEditing(startup);
    setForm(startupToForm(startup));
    setFormError('');
    setDetailId(null);
    setFormOpen(true);
  }

  async function openDetail(startup) {
    setDetailId(startup.id);
    setDetail(null);
    setDetailLoading(true);
    try {
      setDetail(await api.get(`/innovation/startups/${startup.id}`));
    } catch (err) {
      setError(err.message);
      setDetailId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function reloadDetail() {
    if (!detailId) return;
    const result = await api.get(`/innovation/startups/${detailId}`);
    setDetail(result);
    await startupsQuery.reload();
  }

  async function saveStartup(applicationStatus) {
    setBusy(true);
    setFormError('');
    const payload = {
      ...form,
      funding_required: form.funding_required === '' ? null : Number(form.funding_required),
      tagline: form.tagline || null,
      problem: form.problem || null,
      solution: form.solution || null,
      market_opportunity: form.market_opportunity || null,
      business_model: form.business_model || null,
      team_members: form.team_members || null,
      website_url: form.website_url || null,
      application_status: editing && user.role === 'admin' ? undefined : applicationStatus,
    };
    try {
      if (editing) {
        await api.put(`/innovation/startups/${editing.id}`, payload);
      } else {
        await api.post('/innovation/startups', payload);
      }
      setFormOpen(false);
      await startupsQuery.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteStartup(startup) {
    if (!window.confirm(`Delete "${startup.name}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/startups/${startup.id}`);
      if (detailId === startup.id) setDetailId(null);
      await startupsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (startupsQuery.loading) return <PageLoader label="Loading startups..." />;
  if (startupsQuery.error) return <ErrorState message={startupsQuery.error} onRetry={startupsQuery.reload} />;

  return (
    <div>
      <PageHeader
        title="Startup TN pre-incubation"
        subtitle="Apply for incubation support, track venture stages, and connect with mentors."
        action={user.role === 'student' ? <button type="button" className="btn btn-primary" onClick={openCreate}>New application</button> : null}
      />

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="mb-4">
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search startups..."
          className="sm:max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={startups.length ? 'No matching startups' : 'No startup applications yet'}
            message={user.role === 'student' ? 'Apply to the Startup TN pre-incubation programme.' : 'Student applications will appear here.'}
            action={user.role === 'student' ? <button type="button" className="btn btn-primary" onClick={openCreate}>New application</button> : null}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((startup) => (
            <article key={startup.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="badge bg-violet-50 text-violet-700">{prettyLabel(startup.stage)}</span>
                <StatusBadge value={startup.application_status} />
              </div>
              <button type="button" className="mt-3 text-left" onClick={() => openDetail(startup)}>
                <h2 className="text-lg font-semibold text-slate-900 hover:text-indigo-700">{startup.name}</h2>
              </button>
              {startup.tagline && <p className="mt-1 text-sm font-medium text-indigo-600">{startup.tagline}</p>}
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{startup.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{startup.founder_name}</span>
                <span>{formatCurrency(startup.funding_required)}</span>
                {startup.mentor_name && <span>Mentor: {startup.mentor_name}</span>}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDetail(startup)}>View application</button>
                {(user.role === 'admin' || (startup.founder_id === user.id && ['draft', 'rejected'].includes(startup.application_status))) && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(startup)}>Edit</button>
                )}
                {(user.role === 'admin' || startup.founder_id === user.id) && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteStartup(startup)} disabled={busy}>Delete</button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit startup application' : 'Startup TN application'}
        size="xl"
        footer={(
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-secondary" onClick={() => saveStartup('draft')} disabled={busy}>
              Save draft
            </button>
            <button type="button" className="btn btn-primary" onClick={() => saveStartup('submitted')} disabled={busy}>
              {busy ? 'Saving...' : 'Submit application'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Alert type="error" message={formError} onClose={() => setFormError('')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Startup name">
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={200} />
            </Field>
            <Field label="Tagline">
              <TextInput value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} maxLength={200} />
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
            <Field label="Problem">
              <TextArea rows={3} value={form.problem} onChange={(event) => setForm({ ...form, problem: event.target.value })} maxLength={5000} />
            </Field>
            <Field label="Solution">
              <TextArea rows={3} value={form.solution} onChange={(event) => setForm({ ...form, solution: event.target.value })} maxLength={5000} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Market opportunity">
              <TextArea rows={3} value={form.market_opportunity} onChange={(event) => setForm({ ...form, market_opportunity: event.target.value })} maxLength={5000} />
            </Field>
            <Field label="Business model">
              <TextArea rows={3} value={form.business_model} onChange={(event) => setForm({ ...form, business_model: event.target.value })} maxLength={5000} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team members">
              <TextInput value={form.team_members} onChange={(event) => setForm({ ...form, team_members: event.target.value })} maxLength={500} />
            </Field>
            <Field label="Funding required (INR)">
              <TextInput
                type="number"
                min="0"
                value={form.funding_required}
                onChange={(event) => setForm({ ...form, funding_required: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stage">
              <SelectInput value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value })}>
                {STARTUP_STAGES.map((stage) => <option key={stage} value={stage}>{prettyLabel(stage)}</option>)}
              </SelectInput>
            </Field>
            <Field label="Website">
              <TextInput
                type="url"
                value={form.website_url}
                onChange={(event) => setForm({ ...form, website_url: event.target.value })}
                placeholder="https://..."
                maxLength={500}
              />
            </Field>
          </div>
        </form>
      </Modal>

      {detailId && detail && (
        <StartupDetail
          startup={detail.startup}
          user={user}
          mentors={mentors}
          onClose={() => setDetailId(null)}
          onChanged={reloadDetail}
          onEdit={() => openEdit(detail.startup)}
        />
      )}
      {detailId && detailLoading && !detail && <PageLoader label="Loading application..." />}
    </div>
  );
}
