import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { Field, TextInput } from '../../components/FormControls.jsx';

const EMPTY_FORM = { name: '', code: '' };

export default function DepartmentsPage() {
  const { data, loading, error, reload } = useApiData('/departments');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const departments = data?.departments || [];

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(department) {
    setEditing(department);
    setForm({ name: department.name, code: department.code });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { name: form.name.trim(), code: form.code.trim() };
      if (editing) {
        await api.put(`/departments/${editing.id}`, payload);
        setNotice('Department updated');
      } else {
        await api.post('/departments', payload);
        setNotice('Department created');
      }
      setModalOpen(false);
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(department) {
    if (!window.confirm(`Delete department "${department.name}"? Students and courses will be unassigned.`)) {
      return;
    }
    try {
      await api.del(`/departments/${department.id}`);
      setNotice('Department deleted');
      await reload();
    } catch (err) {
      setNotice('');
      window.alert(err.message);
    }
  }

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage academic departments."
        action={<button type="button" className="btn btn-primary" onClick={openCreate}>Add department</button>}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={departments}
        searchKeys={['name', 'code']}
        searchPlaceholder="Search departments..."
        emptyTitle="No departments yet"
        emptyMessage="Create your first department to start adding courses and students."
        columns={[
          { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
          { key: 'code', label: 'Code' },
          { key: 'student_count', label: 'Students' },
          { key: 'faculty_count', label: 'Faculty' },
          { key: 'course_count', label: 'Courses' },
        ]}
        actions={(row) => (
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>Delete</button>
          </>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit department' : 'New department'}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" form="department-form" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        <form id="department-form" className="space-y-4" onSubmit={handleSubmit}>
          <Alert message={formError} onClose={() => setFormError('')} />
          <Field label="Department name" htmlFor="dept-name">
            <TextInput
              id="dept-name"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Computer Science"
            />
          </Field>
          <Field label="Code" htmlFor="dept-code" hint="Short unique code, for example CSE.">
            <TextInput
              id="dept-code"
              required
              minLength={2}
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
              placeholder="CSE"
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
