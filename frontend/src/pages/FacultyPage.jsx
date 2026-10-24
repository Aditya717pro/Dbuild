import { useState } from 'react';
import { useApiData } from '../hooks/useApiData.js';
import { api } from '../services/api.js';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../components/States.jsx';
import { Field, SelectInput, TextInput } from '../components/FormControls.jsx';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  designation: '',
  department_id: '',
  is_active: true,
};

export default function FacultyPage() {
  const faculty = useApiData('/faculty');
  const departments = useApiData('/departments');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const rows = faculty.data?.faculty || [];
  const departmentOptions = (departments.data?.departments || []).map((department) => ({
    value: department.id,
    label: `${department.code} · ${department.name}`,
  }));

  if (faculty.loading) return <PageLoader />;
  if (faculty.error) return <ErrorState message={faculty.error} onRetry={faculty.reload} />;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(member) {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      password: '',
      designation: member.designation || '',
      department_id: member.department_id ?? '',
      is_active: member.is_active,
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        designation: form.designation.trim() || null,
        department_id: form.department_id ? Number(form.department_id) : null,
      };
      if (form.password) payload.password = form.password;

      if (editing) {
        payload.is_active = form.is_active;
        await api.put(`/faculty/${editing.user_id}`, payload);
        setNotice('Faculty member updated');
      } else {
        await api.post('/faculty', payload);
        setNotice('Faculty member created');
      }
      setModalOpen(false);
      await faculty.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(member) {
    if (!window.confirm(`Delete faculty member "${member.name}"? Their courses will become unassigned.`)) {
      return;
    }
    try {
      await api.del(`/faculty/${member.user_id}`);
      setNotice('Faculty member deleted');
      await faculty.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle="Manage faculty accounts and department assignments."
        action={<button type="button" className="btn btn-primary" onClick={openCreate}>Add faculty</button>}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={rows}
        searchKeys={['name', 'email', 'designation']}
        searchPlaceholder="Search faculty..."
        filters={[{ key: 'department_id', label: 'Department', options: departmentOptions }]}
        emptyTitle="No faculty found"
        emptyMessage="Add faculty members to assign them to courses."
        columns={[
          { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
          { key: 'email', label: 'Email' },
          { key: 'designation', label: 'Designation', render: (row) => row.designation || '—' },
          { key: 'department_name', label: 'Department', render: (row) => row.department_name || '—' },
          {
            key: 'is_active',
            label: 'Status',
            render: (row) => (
              <span className={`badge ${row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {row.is_active ? 'Active' : 'Inactive'}
              </span>
            ),
          },
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
        title={editing ? 'Edit faculty member' : 'New faculty member'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" form="faculty-form" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        <form id="faculty-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <Alert message={formError} onClose={() => setFormError('')} />
          </div>
          <Field label="Full name" htmlFor="faculty-name">
            <TextInput
              id="faculty-name"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Dr. Alex Smith"
            />
          </Field>
          <Field label="Email" htmlFor="faculty-email">
            <TextInput
              id="faculty-email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="alex@college.example"
            />
          </Field>
          <Field
            label={editing ? 'New password' : 'Password'}
            htmlFor="faculty-password"
            hint={editing ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
          >
            <TextInput
              id="faculty-password"
              type="password"
              autoComplete="new-password"
              required={!editing}
              minLength={8}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder={editing ? 'Unchanged' : 'Minimum 8 characters'}
            />
          </Field>
          <Field label="Designation" htmlFor="faculty-designation">
            <TextInput
              id="faculty-designation"
              value={form.designation}
              onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
              placeholder="Assistant Professor"
            />
          </Field>
          <Field label="Department" htmlFor="faculty-department">
            <SelectInput
              id="faculty-department"
              value={form.department_id}
              onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
            >
              <option value="">No department</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectInput>
          </Field>
          {editing && (
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={form.is_active}
                  onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                />
                Account is active
              </label>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
