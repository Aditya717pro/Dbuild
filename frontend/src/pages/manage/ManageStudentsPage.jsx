import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { Field, SelectInput, TextInput } from '../../components/FormControls.jsx';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  roll_no: '',
  department_id: '',
  year: '1',
  is_active: true,
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const students = useApiData('/students');
  const departments = useApiData('/departments');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const rows = students.data?.students || [];
  const departmentOptions = (departments.data?.departments || []).map((department) => ({
    value: department.id,
    label: `${department.code} · ${department.name}`,
  }));
  const yearOptions = [1, 2, 3, 4, 5, 6].map((year) => ({ value: year, label: `Year ${year}` }));

  if (students.loading) return <PageLoader />;
  if (students.error) return <ErrorState message={students.error} onRetry={students.reload} />;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    setForm({
      name: student.name,
      email: student.email,
      password: '',
      roll_no: student.roll_no,
      department_id: student.department_id ?? '',
      year: String(student.year),
      is_active: student.is_active,
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
        roll_no: form.roll_no.trim(),
        department_id: form.department_id ? Number(form.department_id) : null,
        year: Number(form.year),
      };
      if (form.password) payload.password = form.password;

      if (editing) {
        payload.is_active = form.is_active;
        await api.put(`/students/${editing.user_id}`, payload);
        setNotice('Student updated');
      } else {
        await api.post('/students', payload);
        setNotice('Student created');
      }
      setModalOpen(false);
      await students.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete student "${student.roll_no} — ${student.name}"? Their enrollments and attendance will be removed.`)) {
      return;
    }
    try {
      await api.del(`/students/${student.user_id}`);
      setNotice('Student deleted');
      await students.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title={isAdmin ? 'Students' : 'Department roster'}
        subtitle={isAdmin ? 'Manage student accounts and profiles.' : 'Students in your department (read-only).'}
        action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openCreate}>Add student</button> : null}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={rows}
        searchKeys={['name', 'email', 'roll_no']}
        searchPlaceholder="Search by name, email or roll number..."
        filters={[
          { key: 'department_id', label: 'Department', options: departmentOptions },
          { key: 'year', label: 'Year', options: yearOptions },
        ]}
        emptyTitle="No students found"
        emptyMessage="Students will appear here once they are created and assigned to a department."
        columns={[
          { key: 'roll_no', label: 'Roll No', render: (row) => <span className="font-medium text-slate-900">{row.roll_no}</span> },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'department_name', label: 'Department', render: (row) => row.department_name || '—' },
          { key: 'year', label: 'Year' },
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
        actions={isAdmin ? (row) => (
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>Delete</button>
          </>
        ) : undefined}
      />

      {isAdmin && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Edit student' : 'New student'}
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" form="student-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          }
        >
          <form id="student-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <Alert message={formError} onClose={() => setFormError('')} />
            </div>
            <Field label="Full name" htmlFor="student-name">
              <TextInput
                id="student-name"
                required
                minLength={2}
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email" htmlFor="student-email">
              <TextInput
                id="student-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="jane@college.example"
              />
            </Field>
            <Field
              label={editing ? 'New password' : 'Password'}
              htmlFor="student-password"
              hint={editing ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
            >
              <TextInput
                id="student-password"
                type="password"
                autoComplete="new-password"
                required={!editing}
                minLength={8}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder={editing ? 'Unchanged' : 'Minimum 8 characters'}
              />
            </Field>
            <Field label="Roll number" htmlFor="student-roll">
              <TextInput
                id="student-roll"
                required
                value={form.roll_no}
                onChange={(event) => setForm((prev) => ({ ...prev, roll_no: event.target.value }))}
                placeholder="CSE2024001"
              />
            </Field>
            <Field label="Department" htmlFor="student-department">
              <SelectInput
                id="student-department"
                value={form.department_id}
                onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
              >
                <option value="">No department</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Year" htmlFor="student-year">
              <SelectInput
                id="student-year"
                value={form.year}
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
              >
                {yearOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            {editing && (
              <div className="sm:col-span-2">
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
      )}
    </div>
  );
}
