import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { api } from '../services/api.js';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../components/States.jsx';
import { Field, SelectInput, TextInput } from '../components/FormControls.jsx';

const EMPTY_FORM = { code: '', name: '', department_id: '', faculty_id: '', semester: '' };

export default function CoursesPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const courses = useApiData('/courses');
  const departments = useApiData('/departments');
  const faculty = useApiData('/faculty', { enabled: isAdmin });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const courseRows = courses.data?.courses || [];
  const departmentOptions = (departments.data?.departments || []).map((department) => ({
    value: department.id,
    label: `${department.code} · ${department.name}`,
  }));
  const facultyOptions = (faculty.data?.faculty || []).map((member) => ({
    value: member.user_id,
    label: member.name,
  }));

  if (courses.loading) return <PageLoader />;
  if (courses.error) return <ErrorState message={courses.error} onRetry={courses.reload} />;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(course) {
    setEditing(course);
    setForm({
      code: course.code,
      name: course.name,
      department_id: course.department_id ?? '',
      faculty_id: course.faculty_id ?? '',
      semester: course.semester ?? '',
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
        code: form.code.trim(),
        name: form.name.trim(),
        department_id: form.department_id ? Number(form.department_id) : null,
        faculty_id: form.faculty_id ? Number(form.faculty_id) : null,
        semester: form.semester ? Number(form.semester) : null,
      };
      if (editing) {
        await api.put(`/courses/${editing.id}`, payload);
        setNotice('Course updated');
      } else {
        await api.post('/courses', payload);
        setNotice('Course created');
      }
      setModalOpen(false);
      await courses.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(course) {
    if (!window.confirm(`Delete course "${course.code} — ${course.name}"? Enrollments and attendance for it will also be removed.`)) {
      return;
    }
    try {
      await api.del(`/courses/${course.id}`);
      setNotice('Course deleted');
      await courses.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle={isAdmin ? 'Create and manage courses across departments.' : 'Courses available to you.'}
        action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openCreate}>Add course</button> : null}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={courseRows}
        searchKeys={['code', 'name', 'faculty_name', 'department_name']}
        searchPlaceholder="Search courses..."
        filters={[
          { key: 'department_id', label: 'Department', options: departmentOptions },
        ]}
        emptyTitle="No courses found"
        emptyMessage="Courses assigned to you will appear here."
        columns={[
          { key: 'code', label: 'Code', render: (row) => <span className="font-medium text-slate-900">{row.code}</span> },
          { key: 'name', label: 'Name' },
          { key: 'department_name', label: 'Department', render: (row) => row.department_name || '—' },
          { key: 'faculty_name', label: 'Faculty', render: (row) => row.faculty_name || 'Unassigned' },
          { key: 'semester', label: 'Semester', render: (row) => row.semester ?? '—' },
          { key: 'enrolled_count', label: 'Enrolled' },
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
          title={editing ? 'Edit course' : 'New course'}
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" form="course-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          }
        >
          <form id="course-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <Alert message={formError} onClose={() => setFormError('')} />
            </div>
            <Field label="Course code" htmlFor="course-code">
              <TextInput
                id="course-code"
                required
                minLength={2}
                value={form.code}
                onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                placeholder="CS101"
              />
            </Field>
            <Field label="Course name" htmlFor="course-name">
              <TextInput
                id="course-name"
                required
                minLength={2}
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Introduction to Programming"
              />
            </Field>
            <Field label="Department" htmlFor="course-department">
              <SelectInput
                id="course-department"
                value={form.department_id}
                onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
              >
                <option value="">No department</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Faculty" htmlFor="course-faculty">
              <SelectInput
                id="course-faculty"
                value={form.faculty_id}
                onChange={(event) => setForm((prev) => ({ ...prev, faculty_id: event.target.value }))}
              >
                <option value="">Unassigned</option>
                {facultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Semester" htmlFor="course-semester" hint="Optional, 1-12.">
              <TextInput
                id="course-semester"
                type="number"
                min={1}
                max={12}
                value={form.semester}
                onChange={(event) => setForm((prev) => ({ ...prev, semester: event.target.value }))}
                placeholder="1"
              />
            </Field>
          </form>
        </Modal>
      )}
    </div>
  );
}
