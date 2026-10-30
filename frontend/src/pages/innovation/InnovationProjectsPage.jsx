import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  PROJECT_STATUS_OPTIONS,
  ProgressBar,
  StatusBadge,
  mediaUrl,
  prepareImage,
  prettyLabel,
} from './helpers.jsx';

const EMPTY_FORM = {
  idea_id: '',
  title: '',
  description: '',
  problem_solved: '',
  technology: '',
  team_members: '',
  department_id: '',
  mentor_id: '',
  github_url: '',
  demo_url: '',
  status: 'planning',
  progress: 0,
  is_featured: false,
};

function projectToForm(project) {
  return {
    title: project.title || '',
    description: project.description || '',
    problem_solved: project.problem_solved || '',
    technology: project.technology || '',
    team_members: project.team_members || '',
    department_id: project.department_id || '',
    mentor_id: project.mentor_id || '',
    github_url: project.github_url || '',
    demo_url: project.demo_url || '',
    status: project.status || 'planning',
    progress: project.progress || 0,
    is_featured: Boolean(project.is_featured),
  };
}

function ProjectDetail({ detail, user, onClose, onChanged, onEdit }) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const project = detail?.project;
  const canEdit = project && (
    user.role === 'admin'
    || project.owner_id === user.id
    || (user.role === 'faculty' && project.mentor_id === user.id)
  );
  const canFeedback = user.role === 'admin' || user.role === 'faculty';

  async function sendFeedback(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post(`/innovation/projects/${project.id}/feedback`, { message: feedback });
      setFeedback('');
      setNotice('Feedback added.');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function addImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const image = await prepareImage(file);
      await api.post(`/innovation/projects/${project.id}/media`, { images: [image] });
      setNotice('Project image added.');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <Modal open onClose={onClose} title={project?.title || 'Project details'} size="xl">
      {!project ? (
        <PageLoader label="Loading project..." />
      ) : (
        <div className="space-y-5">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={notice} onClose={() => setNotice('')} />

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={project.status} />
            {project.is_featured && <span className="badge bg-amber-100 text-amber-700">Featured</span>}
            <span className="text-xs text-slate-500">
              by {project.owner_name} · {project.department_code || 'No department'} · {formatDate(project.created_at)}
            </span>
          </div>

          <ProgressBar value={project.progress} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Project overview</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{project.description}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Problem solved</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {project.problem_solved || 'Not documented yet.'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Technology', project.technology || 'Not set'],
              ['Team', project.team_members || 'Not set'],
              ['Mentor', project.mentor_name || 'Not assigned'],
              ['Feedback', `${project.feedback_count || 0} entries`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {(project.github_url || project.demo_url) && (
            <div className="flex flex-wrap gap-2">
              {project.github_url && (
                <a className="btn btn-secondary btn-sm" href={project.github_url} target="_blank" rel="noreferrer">
                  GitHub repository
                </a>
              )}
              {project.demo_url && (
                <a className="btn btn-secondary btn-sm" href={project.demo_url} target="_blank" rel="noreferrer">
                  Live demo
                </a>
              )}
            </div>
          )}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Project gallery</h3>
              {canEdit && (
                <label className="btn btn-secondary btn-sm cursor-pointer">
                  Add image
                  <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp" onChange={addImage} disabled={busy} />
                </label>
              )}
            </div>
            {!detail?.media?.length ? (
              <p className="text-sm text-slate-500">No images or documents uploaded.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {detail.media.map((file) => (
                  <a
                    key={file.id}
                    href={mediaUrl('project', file.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-lg border border-slate-200 transition hover:border-indigo-300"
                  >
                    {file.kind === 'image' ? (
                      <img src={mediaUrl('project', file.id)} alt={file.file_name} className="h-36 w-full object-cover" />
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-slate-100 text-sm text-slate-500">PDF document</div>
                    )}
                    <p className="truncate px-3 py-2 text-xs font-medium text-slate-600">{file.file_name}</p>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Mentor feedback</h3>
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
                  placeholder="Share feedback on progress, architecture, or next steps..."
                  required
                  minLength={3}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>Add feedback</button>
              </form>
            )}
          </div>

          {canEdit && (
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button type="button" className="btn btn-primary" onClick={onEdit}>Edit project</button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function InnovationProjectsPage() {
  const { user } = useAuth();
  const projectsQuery = useApiData('/innovation/projects');
  const ideasQuery = useApiData('/innovation/ideas');
  const departmentsQuery = useApiData('/departments');
  const mentorsQuery = useApiData('/innovation/mentors');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [fileBusy, setFileBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);

  const projects = useMemo(() => projectsQuery.data?.projects || [], [projectsQuery.data]);
  const departments = useMemo(
    () => departmentsQuery.data?.departments || [],
    [departmentsQuery.data],
  );
  const mentors = useMemo(() => mentorsQuery.data?.mentors || [], [mentorsQuery.data]);
  const approvedIdeas = useMemo(
    () => (ideasQuery.data?.ideas || []).filter((idea) => (
      ['approved', 'prototype_development', 'completed'].includes(idea.status)
      && (user.role !== 'student' || idea.submitted_by === user.id)
    )),
    [ideasQuery.data, user.role, user.id],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((project) => {
      if (statusFilter && project.status !== statusFilter) return false;
      if (!term) return true;
      return [project.title, project.owner_name, project.technology, project.department_code]
        .some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [projects, search, statusFilter]);

  const canCreate = user.role !== 'faculty' ? (approvedIdeas.length > 0 || user.role === 'admin') : true;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(project) {
    setEditing(project);
    setForm(projectToForm(project));
    setImages([]);
    setFormError('');
    setDetailId(null);
    setFormOpen(true);
  }

  async function openDetail(project) {
    setDetailId(project.id);
    setDetail(null);
    try {
      setDetail(await api.get(`/innovation/projects/${project.id}`));
    } catch (err) {
      setError(err.message);
      setDetailId(null);
    }
  }

  async function reloadDetail() {
    if (!detailId) return;
    setDetail(await api.get(`/innovation/projects/${detailId}`));
    await projectsQuery.reload();
  }

  async function addImages(event) {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (!files.length) return;
    setFileBusy(true);
    setFormError('');
    try {
      const prepared = [];
      for (const file of files) prepared.push(await prepareImage(file));
      setImages(prepared);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFileBusy(false);
    }
  }

  async function saveProject() {
    setBusy(true);
    setFormError('');
    const payload = {
      ...form,
      department_id: form.department_id ? Number(form.department_id) : null,
      mentor_id: form.mentor_id ? Number(form.mentor_id) : null,
      progress: Number(form.progress),
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
      problem_solved: form.problem_solved || null,
      technology: form.technology || null,
      team_members: form.team_members || null,
    };
    try {
      if (editing) {
        await api.put(`/innovation/projects/${editing.id}`, payload);
      } else {
        await api.post('/innovation/projects', {
          ...payload,
          idea_id: form.idea_id ? Number(form.idea_id) : null,
          images,
        });
      }
      setFormOpen(false);
      await projectsQuery.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/projects/${project.id}`);
      if (detailId === project.id) setDetailId(null);
      await projectsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (projectsQuery.loading) return <PageLoader label="Loading innovation projects..." />;
  if (projectsQuery.error) return <ErrorState message={projectsQuery.error} onRetry={projectsQuery.reload} />;

  return (
    <div>
      <PageHeader
        title="Project showcase"
        subtitle="Prototype progress, project galleries, mentor feedback, and live demos."
        action={canCreate ? <button type="button" className="btn btn-primary" onClick={openCreate}>Add project</button> : null}
      />

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          className="sm:max-w-sm"
        />
        <SelectInput value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="sm:max-w-xs">
          <option value="">All statuses</option>
          {PROJECT_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{prettyLabel(status)}</option>)}
        </SelectInput>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={projects.length ? 'No matching projects' : 'No projects yet'}
            message="Approved ideas can be converted into showcase projects."
            action={canCreate ? <button type="button" className="btn btn-primary" onClick={openCreate}>Add project</button> : null}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <article key={project.id} className="card overflow-hidden p-0">
              <div className="h-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
                    {project.department_code || 'Innovation'}
                  </span>
                  {project.is_featured && <span className="rounded bg-white/20 px-2 py-0.5 text-[11px]">Featured</span>}
                </div>
                <p className="mt-3 text-sm text-indigo-100">{project.owner_name}</p>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">{project.title}</h2>
                  <StatusBadge value={project.status} />
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{project.description}</p>
                <div className="mt-4">
                  <ProgressBar value={project.progress} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDetail(project)}>
                    View project
                  </button>
                  {(user.role === 'admin' || project.owner_id === user.id || project.mentor_id === user.id) && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(project)}>
                      Edit
                    </button>
                  )}
                  {(user.role === 'admin' || project.owner_id === user.id) && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteProject(project)} disabled={busy}>
                      Delete
                    </button>
                  )}
                  {project.image_count > 0 && <span className="ml-auto text-xs text-slate-400">{project.image_count} image(s)</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit project' : 'Add a project to the showcase'}
        size="xl"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={saveProject} disabled={busy || fileBusy}>
              {busy ? 'Saving...' : editing ? 'Save changes' : 'Create project'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Alert type="error" message={formError} onClose={() => setFormError('')} />
          {!editing && (
            <Field
              label="Approved idea"
              hint={user.role === 'student' ? 'Students must build projects from an approved idea.' : 'Optional. Link this project to a student idea.'}
            >
              <SelectInput
                value={form.idea_id}
                onChange={(event) => {
                  const idea = approvedIdeas.find((item) => String(item.id) === event.target.value);
                  setForm({
                    ...form,
                    idea_id: event.target.value,
                    title: idea ? idea.title : form.title,
                    description: idea ? idea.problem_statement : form.description,
                    technology: idea ? idea.technology || '' : form.technology,
                    department_id: idea?.department_id || form.department_id,
                    mentor_id: idea?.mentor_id || form.mentor_id,
                  });
                }}
                required={user.role === 'student'}
              >
                <option value="">{user.role === 'student' ? 'Select an approved idea' : 'No linked idea'}</option>
                {approvedIdeas.map((idea) => (
                  <option key={idea.id} value={idea.id}>{idea.title} — {idea.owner_name}</option>
                ))}
              </SelectInput>
            </Field>
          )}
          <Field label="Project title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength={200} />
          </Field>
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
          <Field label="Problem solved">
            <TextArea
              rows={3}
              value={form.problem_solved}
              onChange={(event) => setForm({ ...form, problem_solved: event.target.value })}
              maxLength={5000}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Technology / tools">
              <TextInput value={form.technology} onChange={(event) => setForm({ ...form, technology: event.target.value })} maxLength={300} />
            </Field>
            <Field label="Team members">
              <TextInput value={form.team_members} onChange={(event) => setForm({ ...form, team_members: event.target.value })} maxLength={500} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department">
              <SelectInput value={form.department_id} onChange={(event) => setForm({ ...form, department_id: event.target.value })}>
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.code} — {department.name}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Mentor">
              <SelectInput
                value={form.mentor_id}
                onChange={(event) => setForm({ ...form, mentor_id: event.target.value })}
                disabled={user.role === 'student'}
              >
                <option value="">{user.role === 'student' ? 'Assigned by admin' : 'No mentor'}</option>
                {mentors.map((mentor) => (
                  <option key={mentor.user_id} value={mentor.user_id}>{mentor.name} — {mentor.expertise}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub URL">
              <TextInput
                type="url"
                value={form.github_url}
                onChange={(event) => setForm({ ...form, github_url: event.target.value })}
                placeholder="https://github.com/..."
                maxLength={500}
              />
            </Field>
            <Field label="Demo URL">
              <TextInput
                type="url"
                value={form.demo_url}
                onChange={(event) => setForm({ ...form, demo_url: event.target.value })}
                placeholder="https://..."
                maxLength={500}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <SelectInput value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {PROJECT_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{prettyLabel(status)}</option>)}
              </SelectInput>
            </Field>
            <Field label={`Progress: ${form.progress}%`}>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.progress}
                onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })}
                className="mt-2 w-full accent-indigo-600"
              />
            </Field>
          </div>
          {user.role === 'admin' && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) => setForm({ ...form, is_featured: event.target.checked })}
                className="rounded border-slate-300 text-indigo-600"
              />
              Feature this project on the showcase
            </label>
          )}
          {!editing && (
            <Field label="Project images" hint="Up to 3 images, compressed automatically. More can be added later.">
              <input
                type="file"
                className="input file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-indigo-700"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={addImages}
                disabled={fileBusy}
              />
              {images.length > 0 && <p className="mt-1 text-xs text-emerald-600">{images.length} image(s) ready</p>}
            </Field>
          )}
        </form>
      </Modal>

      {detailId && detail && (
        <ProjectDetail
          detail={detail}
          user={user}
          onClose={() => setDetailId(null)}
          onChanged={reloadDetail}
          onEdit={() => openEdit(detail.project)}
        />
      )}
    </div>
  );
}
