import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../../components/FormControls.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';
import {
  ProgressBar,
  StatusBadge,
  formatCurrency,
  prettyLabel,
} from './helpers.jsx';

const RESEARCH_TYPES = ['student_project', 'faculty_project', 'published_paper', 'industry_collaboration'];
const RESEARCH_STATUSES = ['ongoing', 'completed', 'published', 'patented'];
const PATENT_STATUSES = ['draft', 'filed', 'published', 'granted', 'rejected'];

const EMPTY_RESEARCH = {
  title: '',
  abstract: '',
  type: 'student_project',
  department_id: '',
  guide_id: '',
  status: 'ongoing',
  funding_amount: '',
  funding_agency: '',
  collaboration_partner: '',
  published_on: '',
  paper_url: '',
  progress: 0,
};

const EMPTY_PATENT = {
  title: '',
  patent_number: '',
  status: 'draft',
  inventors: '',
  department_id: '',
  filing_date: '',
  grant_date: '',
  description: '',
  document_url: '',
};

function researchToForm(record) {
  return {
    title: record.title || '',
    abstract: record.abstract || '',
    type: record.type || 'student_project',
    department_id: record.department_id || '',
    guide_id: record.guide_id || '',
    status: record.status || 'ongoing',
    funding_amount: record.funding_amount ?? '',
    funding_agency: record.funding_agency || '',
    collaboration_partner: record.collaboration_partner || '',
    published_on: record.published_on || '',
    paper_url: record.paper_url || '',
    progress: record.progress || 0,
  };
}

function patentToForm(patent) {
  return {
    title: patent.title || '',
    patent_number: patent.patent_number || '',
    status: patent.status || 'draft',
    inventors: patent.inventors || '',
    department_id: patent.department_id || '',
    filing_date: patent.filing_date || '',
    grant_date: patent.grant_date || '',
    description: patent.description || '',
    document_url: patent.document_url || '',
  };
}

export default function InnovationResearchPage() {
  const { user } = useAuth();
  const researchQuery = useApiData('/innovation/research');
  const patentsQuery = useApiData('/innovation/patents');
  const departmentsQuery = useApiData('/departments');
  const mentorsQuery = useApiData('/innovation/mentors');
  const [tab, setTab] = useState('research');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [researchOpen, setResearchOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState(null);
  const [researchForm, setResearchForm] = useState(EMPTY_RESEARCH);
  const [patentOpen, setPatentOpen] = useState(false);
  const [editingPatent, setEditingPatent] = useState(null);
  const [patentForm, setPatentForm] = useState(EMPTY_PATENT);
  const [busy, setBusy] = useState(false);

  const research = useMemo(() => researchQuery.data?.research || [], [researchQuery.data]);
  const patents = useMemo(() => patentsQuery.data?.patents || [], [patentsQuery.data]);
  const departments = useMemo(
    () => departmentsQuery.data?.departments || [],
    [departmentsQuery.data],
  );
  const mentors = useMemo(() => mentorsQuery.data?.mentors || [], [mentorsQuery.data]);
  const canPatents = user.role === 'admin' || user.role === 'faculty';

  const filteredResearch = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return research;
    return research.filter((record) => (
      [record.title, record.abstract, record.owner_name, record.department_code, record.funding_agency]
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [research, search]);

  const filteredPatents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patents;
    return patents.filter((patent) => (
      [patent.title, patent.inventors, patent.patent_number, patent.owner_name, patent.department_code]
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [patents, search]);

  function openResearchCreate() {
    setEditingResearch(null);
    setResearchForm(EMPTY_RESEARCH);
    setResearchOpen(true);
  }

  function openResearchEdit(record) {
    setEditingResearch(record);
    setResearchForm(researchToForm(record));
    setResearchOpen(true);
  }

  async function saveResearch(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      ...researchForm,
      department_id: researchForm.department_id ? Number(researchForm.department_id) : null,
      guide_id: researchForm.guide_id ? Number(researchForm.guide_id) : null,
      funding_amount: researchForm.funding_amount === '' ? null : Number(researchForm.funding_amount),
      published_on: researchForm.published_on || null,
      paper_url: researchForm.paper_url || null,
      funding_agency: researchForm.funding_agency || null,
      collaboration_partner: researchForm.collaboration_partner || null,
      progress: Number(researchForm.progress),
    };
    try {
      if (editingResearch) {
        await api.put(`/innovation/research/${editingResearch.id}`, payload);
      } else {
        await api.post('/innovation/research', payload);
      }
      setResearchOpen(false);
      await researchQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteResearch(record) {
    if (!window.confirm(`Delete research record "${record.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/research/${record.id}`);
      await researchQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openPatentCreate() {
    setEditingPatent(null);
    setPatentForm(EMPTY_PATENT);
    setPatentOpen(true);
  }

  function openPatentEdit(patent) {
    setEditingPatent(patent);
    setPatentForm(patentToForm(patent));
    setPatentOpen(true);
  }

  async function savePatent(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      ...patentForm,
      patent_number: patentForm.patent_number || null,
      department_id: patentForm.department_id ? Number(patentForm.department_id) : null,
      filing_date: patentForm.filing_date || null,
      grant_date: patentForm.grant_date || null,
      description: patentForm.description || null,
      document_url: patentForm.document_url || null,
    };
    try {
      if (editingPatent) {
        await api.put(`/innovation/patents/${editingPatent.id}`, payload);
      } else {
        await api.post('/innovation/patents', payload);
      }
      setPatentOpen(false);
      await patentsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deletePatent(patent) {
    if (!window.confirm(`Delete patent record "${patent.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await api.del(`/innovation/patents/${patent.id}`);
      await patentsQuery.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (researchQuery.loading || patentsQuery.loading) return <PageLoader label="Loading research and patents..." />;
  if (researchQuery.error) return <ErrorState message={researchQuery.error} onRetry={researchQuery.reload} />;

  const showResearch = tab === 'research';

  return (
    <div>
      <PageHeader
        title="Research & patents"
        subtitle="Track research projects, publications, funding, collaborations, and IP."
        action={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={openResearchCreate}>Add research</button>
            {canPatents && <button type="button" className="btn btn-secondary" onClick={openPatentCreate}>Add patent</button>}
          </div>
        )}
      />

      <div className="space-y-3">
        <Alert type="error" message={error} onClose={() => setError('')} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setTab('research')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${showResearch ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Research ({research.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('patents')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${!showResearch ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Patents ({patents.length})
          </button>
        </div>
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={showResearch ? 'Search research...' : 'Search patents...'}
          className="sm:max-w-sm"
        />
      </div>

      {showResearch && (
        filteredResearch.length === 0 ? (
          <div className="card">
            <EmptyState
              title={research.length ? 'No matching research records' : 'No research records yet'}
              message="Document student projects, faculty research, papers, and industry collaborations."
              action={<button type="button" className="btn btn-primary" onClick={openResearchCreate}>Add research</button>}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResearch.map((record) => (
              <article key={record.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="badge bg-sky-50 text-sky-700">{prettyLabel(record.type)}</span>
                  <StatusBadge value={record.status} />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{record.title}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {record.owner_name} · {record.department_code || 'No department'}
                  {record.guide_name ? ` · Guide: ${record.guide_name}` : ''}
                </p>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{record.abstract}</p>
                <div className="mt-3">
                  <ProgressBar value={record.progress} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <p>Funding: {formatCurrency(record.funding_amount)}</p>
                  <p>Agency: {record.funding_agency || 'Not specified'}</p>
                  {record.collaboration_partner && <p className="col-span-2">Partner: {record.collaboration_partner}</p>}
                  {record.published_on && <p className="col-span-2">Published: {formatDate(record.published_on)}</p>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  {record.paper_url && (
                    <a href={record.paper_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View paper</a>
                  )}
                  {(user.role === 'admin' || record.owner_id === user.id) && (
                    <>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openResearchEdit(record)}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteResearch(record)} disabled={busy}>Delete</button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )
      )}

      {!showResearch && (
        filteredPatents.length === 0 ? (
          <div className="card">
            <EmptyState
              title={patents.length ? 'No matching patents' : 'No patent records yet'}
              message="Patent filings, publications, and grants will appear here."
              action={canPatents ? <button type="button" className="btn btn-primary" onClick={openPatentCreate}>Add patent</button> : null}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPatents.map((patent) => (
              <article key={patent.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="badge bg-amber-50 text-amber-700">Patent</span>
                  <StatusBadge value={patent.status} />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{patent.title}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {patent.patent_number || 'Number not assigned'} · {patent.department_code || 'No department'}
                </p>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{patent.description || 'No description.'}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p>Inventors: {patent.inventors}</p>
                  {patent.filing_date && <p>Filed: {formatDate(patent.filing_date)}</p>}
                  {patent.grant_date && <p>Granted: {formatDate(patent.grant_date)}</p>}
                  <p>Owner: {patent.owner_name}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  {patent.document_url && (
                    <a href={patent.document_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Document</a>
                  )}
                  {(user.role === 'admin' || patent.owner_id === user.id) && (
                    <>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openPatentEdit(patent)}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deletePatent(patent)} disabled={busy}>Delete</button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )
      )}

      <Modal
        open={researchOpen}
        onClose={() => setResearchOpen(false)}
        title={editingResearch ? 'Edit research record' : 'Add research record'}
        size="xl"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setResearchOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={saveResearch} disabled={busy}>
              {busy ? 'Saving...' : 'Save research'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={saveResearch}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Research title">
            <TextInput value={researchForm.title} onChange={(event) => setResearchForm({ ...researchForm, title: event.target.value })} required maxLength={250} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Research type">
              <SelectInput value={researchForm.type} onChange={(event) => setResearchForm({ ...researchForm, type: event.target.value })}>
                {RESEARCH_TYPES.map((type) => <option key={type} value={type}>{prettyLabel(type)}</option>)}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={researchForm.status} onChange={(event) => setResearchForm({ ...researchForm, status: event.target.value })}>
                {RESEARCH_STATUSES.map((status) => <option key={status} value={status}>{prettyLabel(status)}</option>)}
              </SelectInput>
            </Field>
          </div>
          <Field label="Abstract">
            <TextArea
              rows={4}
              value={researchForm.abstract}
              onChange={(event) => setResearchForm({ ...researchForm, abstract: event.target.value })}
              required
              minLength={20}
              maxLength={8000}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department">
              <SelectInput value={researchForm.department_id} onChange={(event) => setResearchForm({ ...researchForm, department_id: event.target.value })}>
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.code} — {department.name}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Guide / mentor">
              <SelectInput value={researchForm.guide_id} onChange={(event) => setResearchForm({ ...researchForm, guide_id: event.target.value })}>
                <option value="">No guide assigned</option>
                {mentors.map((mentor) => <option key={mentor.user_id} value={mentor.user_id}>{mentor.name}</option>)}
              </SelectInput>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Funding amount (INR)">
              <TextInput
                type="number"
                min="0"
                value={researchForm.funding_amount}
                onChange={(event) => setResearchForm({ ...researchForm, funding_amount: event.target.value })}
              />
            </Field>
            <Field label="Funding agency">
              <TextInput value={researchForm.funding_agency} onChange={(event) => setResearchForm({ ...researchForm, funding_agency: event.target.value })} maxLength={200} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Collaboration partner">
              <TextInput
                value={researchForm.collaboration_partner}
                onChange={(event) => setResearchForm({ ...researchForm, collaboration_partner: event.target.value })}
                maxLength={200}
              />
            </Field>
            <Field label="Published on">
              <TextInput
                type="date"
                value={researchForm.published_on}
                onChange={(event) => setResearchForm({ ...researchForm, published_on: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Paper URL">
            <TextInput
              type="url"
              value={researchForm.paper_url}
              onChange={(event) => setResearchForm({ ...researchForm, paper_url: event.target.value })}
              placeholder="https://..."
              maxLength={500}
            />
          </Field>
          <Field label={`Progress: ${researchForm.progress}%`}>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={researchForm.progress}
              onChange={(event) => setResearchForm({ ...researchForm, progress: Number(event.target.value) })}
              className="mt-2 w-full accent-indigo-600"
            />
          </Field>
        </form>
      </Modal>

      <Modal
        open={patentOpen}
        onClose={() => setPatentOpen(false)}
        title={editingPatent ? 'Edit patent record' : 'Add patent record'}
        size="xl"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setPatentOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={savePatent} disabled={busy}>
              {busy ? 'Saving...' : 'Save patent'}
            </button>
          </div>
        )}
      >
        <form className="space-y-4" onSubmit={savePatent}>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Field label="Patent title">
            <TextInput value={patentForm.title} onChange={(event) => setPatentForm({ ...patentForm, title: event.target.value })} required maxLength={250} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Patent number" hint="Leave blank until assigned.">
              <TextInput value={patentForm.patent_number} onChange={(event) => setPatentForm({ ...patentForm, patent_number: event.target.value })} maxLength={100} />
            </Field>
            <Field label="Status">
              <SelectInput value={patentForm.status} onChange={(event) => setPatentForm({ ...patentForm, status: event.target.value })}>
                {PATENT_STATUSES.map((status) => <option key={status} value={status}>{prettyLabel(status)}</option>)}
              </SelectInput>
            </Field>
          </div>
          <Field label="Inventors">
            <TextInput
              value={patentForm.inventors}
              onChange={(event) => setPatentForm({ ...patentForm, inventors: event.target.value })}
              required
              maxLength={500}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Department">
              <SelectInput value={patentForm.department_id} onChange={(event) => setPatentForm({ ...patentForm, department_id: event.target.value })}>
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.code}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Filing date">
              <TextInput type="date" value={patentForm.filing_date} onChange={(event) => setPatentForm({ ...patentForm, filing_date: event.target.value })} />
            </Field>
            <Field label="Grant date">
              <TextInput type="date" value={patentForm.grant_date} onChange={(event) => setPatentForm({ ...patentForm, grant_date: event.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <TextArea rows={3} value={patentForm.description} onChange={(event) => setPatentForm({ ...patentForm, description: event.target.value })} maxLength={5000} />
          </Field>
          <Field label="Document URL">
            <TextInput
              type="url"
              value={patentForm.document_url}
              onChange={(event) => setPatentForm({ ...patentForm, document_url: event.target.value })}
              placeholder="https://..."
              maxLength={500}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
