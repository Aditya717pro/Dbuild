import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  IDEA_YEARS,
  INNOVATION_CATEGORIES,
  StatusBadge,
  mediaUrl,
  prepareDocument,
  prepareImage,
  prettyLabel,
} from './helpers.jsx';

const EMPTY_FORM = {
  title: '',
  category: 'Software & Apps',
  problem_statement: '',
  proposed_solution: '',
  technology: '',
  team_members: '',
  department_id: '',
  year_of_study: '',
  expected_outcome: '',
};

const REVIEW_STATUSES = ['under_review', 'approved', 'rejected', 'prototype_development', 'completed'];

function ideaToForm(idea) {
  return {
    title: idea.title || '',
    category: idea.category || 'Software & Apps',
    problem_statement: idea.problem_statement || '',
    proposed_solution: idea.proposed_solution || '',
    technology: idea.technology || '',
    team_members: idea.team_members || '',
    department_id: idea.department_id || '',
    year_of_study: idea.year_of_study || '',
    expected_outcome: idea.expected_outcome || '',
  };
}

function AttachmentInputs({ images, setImages, document, setDocument, busy, setBusy, setError }) {
  async function handleImages(event) {
    const files = Array.from(event.target.files || []).slice(0, 2);
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const prepared = [];
      for (const file of files) {
        prepared.push(await prepareImage(file));
      }
      setImages(prepared);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDocument(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      setDocument(await prepareDocument(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Prototype images" hint="Up to 2 PNG, JPEG, or WebP images. Compressed automatically.">
        <input
          type="file"
          className="input file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-indigo-700"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleImages}
          disabled={busy}
        />
        {images.length > 0 && <p className="mt-1 text-xs text-emerald-600">{images.length} image(s) ready</p>}
      </Field>
      <Field label="Supporting document" hint="Optional PDF, maximum 3 MB.">
        <input
          type="file"
          className="input file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-indigo-700"
          accept="application/pdf,.pdf"
          onChange={handleDocument}
          disabled={busy}
        />
        {document && <p className="mt-1 truncate text-xs text-emerald-600">{document.file_name}</p>}
      </Field>
    </div>
  );
}

function IdeaDetail({
  detail,
  loading,
  user,
  mentors,
  onClose,
  onChanged,
}) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('under_review');
  const [reviewNote, setReviewNote] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [busy, setBusy] = useState(false);

  const idea = detail?.idea;
  const canFeedback = user.role === 'admin' || user.role === 'faculty';

  async function sendFeedback(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/ideas/${idea.id}/feedback`, { message: feedback });
      setFeedback('');
      setNotice('Feedback added.');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function review(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/ideas/${idea.id}/review`, {
        status: reviewStatus,
        review_note: reviewNote || null,
        mentor_id: mentorId || null,
      });
      setNotice('Review saved.');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeMedia(mediaId) {
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/ideas/${idea.id}/media/${mediaId}`);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={idea?.title || 'Idea details'} size="xl">
      {loading && !idea ? (
        <PageLoader label="Loading idea..." />
      ) : (
        <div className="space-y-5">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={notice} onClose={() => setNotice('')} />

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={idea.status} />
            <span className="badge bg-slate-100 text-slate-600">{idea.category}</span>
            {idea.year_of_study && <span className="badge bg-slate-100 text-slate-600">{idea.year_of_study}</span>}
            <span className="text-xs text-slate-500">
              by {idea.owner_name} · {formatDate(idea.created_at)}
            </span>
          </div>

          {idea.review_note && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <strong>Review note:</strong> {idea.review_note}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Problem statement</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{idea.problem_statement}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Proposed solution</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{idea.proposed_solution}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Department', idea.department_code || 'Not set'],
              ['Technology', idea.technology || 'Not set'],
              ['Team', idea.team_members || 'Not set'],
              ['Mentor', idea.mentor_name || 'Not assigned'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {idea.expected_outcome && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Expected outcome</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{idea.expected_outcome}</p>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Attachments</h3>
            {!detail?.media?.length ? (
              <p className="text-sm text-slate-500">No attachments uploaded.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {detail.media.map((file) => (
                  <div key={file.id} className="rounded-lg border border-slate-200 p-3">
                    {file.kind === 'image' ? (
                      <img
                        src={mediaUrl('idea', file.id)}
                        alt={file.file_name}
                        className="mb-2 h-36 w-full rounded object-cover"
                      />
                    ) : null}
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={mediaUrl('idea', file.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-medium text-indigo-600"
                      >
                        {file.file_name}
                      </a>
                      {(user.role === 'admin' || idea.submitted_by === user.id) && (
                        <button
                          type="button"
                          className="text-xs font-semibold text-rose-600"
                          onClick={() => removeMedia(file.id)}
                          disabled={busy}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Feedback</h3>
            {!detail?.feedback?.length ? (
              <p className="text-sm text-slate-500">No feedback yet.</p>
            ) : (
              <div className="space-y-2">
                {detail.feedback.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{item.author_name}</p>
                      <span className="text-[11px] text-slate-400">{formatDate(item.created_at, { withTime: true })}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
            {canFeedback && (
              <form className="mt-3 space-y-2" onSubmit={sendFeedback}>
                <TextArea
                  rows={3}
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Share constructive feedback with the student..."
                  required
                  minLength={3}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
                  Add feedback
                </button>
              </form>
            )}
          </div>

          {user.role === 'admin' && (
            <form className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4" onSubmit={review}>
              <h3 className="text-sm font-semibold text-indigo-900">Admin review</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Decision">
                  <SelectInput value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)}>
                    {REVIEW_STATUSES.map((status) => (
                      <option key={status} value={status}>{prettyLabel(status)}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Assign mentor">
                  <SelectInput value={mentorId} onChange={(event) => setMentorId(event.target.value)}>
                    <option value="">Keep current mentor</option>
                    {(mentors || []).map((mentor) => (
                      <option key={mentor.user_id} value={mentor.user_id}>
                        {mentor.name} — {mentor.expertise}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
              <Field label="Review note">
                <TextArea
                  rows={3}
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Explain the decision or next steps..."
                />
              </Field>
              <button type="submit" className="btn btn-primary btn-sm mt-3" disabled={busy}>
                Save review
              </button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function InnovationIdeasPage({ initialCreate = false }) {
  const { user } = useAuth();
  const ideasQuery = useApiData('/innovation/ideas');
  const departmentsQuery = useApiData('/departments');
  const mentorsQuery = useApiData('/innovation/mentors', { enabled: user?.role === 'admin' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(initialCreate);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [fileBusy, setFileBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const ideas = useMemo(() => ideasQuery.data?.ideas || [], [ideasQuery.data]);
  const departments = useMemo(
    () => departmentsQuery.data?.departments || [],
    [departmentsQuery.data],
  );
  const mentors = useMemo(() => mentorsQuery.data?.mentors || [], [mentorsQuery.data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (statusFilter && idea.status !== statusFilter) return false;
      if (!term) return true;
      return [idea.title, idea.category, idea.owner_name, idea.department_code, idea.technology]
        .some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [ideas, search, statusFilter]);

  const counts = useMemo(() => {
    const result = {};
    for (const idea of ideas) result[idea.status] = (result[idea.status] || 0) + 1;
    return result;
  }, [ideas]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setDocument(null);
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(idea) {
    setEditing(idea);
    setForm(ideaToForm(idea));
    setImages([]);
    setDocument(null);
    setFormError('');
    setFormOpen(true);
  }

  async function openDetail(idea) {
    setDetailId(idea.id);
    setDetail(null);
    setDetailLoading(true);
    try {
      setDetail(await api.get(`/innovation/ideas/${idea.id}`));
    } catch (err) {
      setError(err.message);
      setDetailId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function reloadDetail() {
    if (!detailId) return;
    setDetail(await api.get(`/innovation/ideas/${detailId}`));
    await ideasQuery.reload();
  }

  async function saveIdea(status) {
    setBusy(true);
    setFormError('');
    const payload = {
      ...form,
      department_id: form.department_id ? Number(form.department_id) : null,
      technology: form.technology || null,
      team_members: form.team_members || null,
      year_of_study: form.year_of_study || null,
      expected_outcome: form.expected_outcome || null,
      status,
    };
    try {
      if (editing) {
        await api.put(`/innovation/ideas/${editing.id}`, payload);
      } else {
        await api.post('/innovation/ideas', { ...payload, images, document });
      }
      setFormOpen(false);
      await ideasQuery.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitIdea(idea) {
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/ideas/${idea.id}/submit`);
      await ideasQuery.reload();
      if (detailId === idea.id) await reloadDetail();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteIdea(idea) {
    if (!window.confirm(`Delete "${idea.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/ideas/${idea.id}`);
      if (detailId === idea.id) setDetailId(null);
      await ideasQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (ideasQuery.loading) return <PageLoader label="Loading innovation ideas..." />;
  if (ideasQuery.error) return <ErrorState message={ideasQuery.error} onRetry={ideasQuery.reload} />;

  const canCreate = user.role === 'student';

  return (
    <div>
      <PageHeader
        title="Innovation ideas"
        subtitle={canCreate ? 'Submit ideas, refine them with feedback, and track approvals.' : 'Review and mentor student innovation ideas.'}
        action={canCreate ? <button type="button" className="btn btn-primary" onClick={openCreate}>Submit idea</button> : null}
      />

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="mb-4 flex flex-wrap gap-2">
        {['', 'draft', 'submitted', 'under_review', 'approved', 'rejected'].map((status) => (
          <button
            key={status || 'all'}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === status
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status ? `${prettyLabel(status)} (${counts[status] || 0})` : `All (${ideas.length})`}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, student, category, or department..."
          className="sm:max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={ideas.length ? 'No matching ideas' : 'No ideas yet'}
            message={canCreate ? 'Submit your first idea to start the innovation journey.' : 'Student ideas will appear here.'}
            action={canCreate && !ideas.length ? <button type="button" className="btn btn-primary" onClick={openCreate}>Submit idea</button> : null}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea) => (
            <article key={idea.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="badge bg-indigo-50 text-indigo-700">{idea.category}</span>
                <StatusBadge value={idea.status} />
              </div>
              <button type="button" className="mt-3 text-left" onClick={() => openDetail(idea)}>
                <h2 className="text-lg font-semibold text-slate-900 hover:text-indigo-700">{idea.title}</h2>
              </button>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                {idea.problem_statement}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{idea.owner_name}</span>
                {idea.department_code && <span>{idea.department_code}</span>}
                {idea.year_of_study && <span>{idea.year_of_study}</span>}
                <span>{formatDate(idea.created_at)}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDetail(idea)}>
                  View details
                </button>
                {canCreate && idea.submitted_by === user.id && ['draft', 'rejected'].includes(idea.status) && (
                  <>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(idea)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => submitIdea(idea)} disabled={busy}>
                      Submit
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteIdea(idea)} disabled={busy}>
                      Delete
                    </button>
                  </>
                )}
                {idea.feedback_count > 0 && (
                  <span className="ml-auto text-xs text-slate-400">{idea.feedback_count} feedback</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit idea' : 'Submit an innovation idea'}
        size="xl"
        footer={(
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => saveIdea('draft')} disabled={busy || fileBusy}>
              Save draft
            </button>
            <button type="button" className="btn btn-primary" onClick={() => saveIdea('submitted')} disabled={busy || fileBusy}>
              {busy ? 'Saving...' : 'Submit for review'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Alert type="error" message={formError} onClose={() => setFormError('')} />
          <Field label="Idea title">
            <TextInput
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              maxLength={200}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <SelectInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {INNOVATION_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Department">
              <SelectInput
                value={form.department_id}
                onChange={(event) => setForm({ ...form, department_id: event.target.value })}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.code} — {department.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Year of study">
              <SelectInput
                value={form.year_of_study}
                onChange={(event) => setForm({ ...form, year_of_study: event.target.value })}
              >
                <option value="">Select year</option>
                {IDEA_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
              </SelectInput>
            </Field>
            <Field label="Technology / tools">
              <TextInput
                value={form.technology}
                onChange={(event) => setForm({ ...form, technology: event.target.value })}
                placeholder="React, Arduino, TensorFlow..."
                maxLength={300}
              />
            </Field>
          </div>
          <Field label="Problem statement" hint="At least 20 characters describing the real problem.">
            <TextArea
              rows={4}
              value={form.problem_statement}
              onChange={(event) => setForm({ ...form, problem_statement: event.target.value })}
              required
              minLength={20}
              maxLength={5000}
            />
          </Field>
          <Field label="Proposed solution">
            <TextArea
              rows={4}
              value={form.proposed_solution}
              onChange={(event) => setForm({ ...form, proposed_solution: event.target.value })}
              required
              minLength={20}
              maxLength={5000}
            />
          </Field>
          <Field label="Team members" hint="Separate names and roles with commas.">
            <TextInput
              value={form.team_members}
              onChange={(event) => setForm({ ...form, team_members: event.target.value })}
              maxLength={500}
            />
          </Field>
          <Field label="Expected outcome">
            <TextArea
              rows={3}
              value={form.expected_outcome}
              onChange={(event) => setForm({ ...form, expected_outcome: event.target.value })}
              maxLength={3000}
            />
          </Field>
          {!editing && (
            <AttachmentInputs
              images={images}
              setImages={setImages}
              document={document}
              setDocument={setDocument}
              busy={fileBusy}
              setBusy={setFileBusy}
              setError={setFormError}
            />
          )}
          {editing && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Existing attachments can be managed from the idea details view.
            </p>
          )}
        </form>
      </Modal>

      {detailId && (
        <IdeaDetail
          detail={detail}
          loading={detailLoading}
          user={user}
          mentors={mentors}
          onClose={() => setDetailId(null)}
          onChanged={reloadDetail}
        />
      )}
    </div>
  );
}
