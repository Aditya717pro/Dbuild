import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApiData } from '../../hooks/useApiData.js';
import { api } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Alert, ErrorState, PageHeader, PageLoader } from '../../components/States.jsx';
import { Field, SelectInput } from '../../components/FormControls.jsx';
import { formatDate } from '../../utils/format.js';

export default function EnrollmentsPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const enrollments = useApiData('/enrollments');
  const students = useApiData('/students');
  const courses = useApiData('/courses');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ student_id: '', course_id: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const rows = enrollments.data?.enrollments || [];
  const studentOptions = (students.data?.students || []).map((student) => ({
    value: student.user_id,
    label: `${student.roll_no} · ${student.name}`,
  }));
  const courseOptions = (courses.data?.courses || []).map((course) => ({
    value: course.id,
    label: `${course.code} · ${course.name}`,
  }));

  if (enrollments.loading) return <PageLoader />;
  if (enrollments.error) return <ErrorState message={enrollments.error} onRetry={enrollments.reload} />;

  function openCreate() {
    setForm({ student_id: '', course_id: '' });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await api.post('/enrollments', {
        student_id: Number(form.student_id),
        course_id: Number(form.course_id),
      });
      setNotice('Student enrolled');
      setModalOpen(false);
      await enrollments.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(enrollment) {
    if (!window.confirm(`Remove ${enrollment.student_name} from ${enrollment.course_code}? Their attendance for this course will also be removed.`)) {
      return;
    }
    try {
      await api.del(`/enrollments/${enrollment.id}`);
      setNotice('Enrollment removed');
      await enrollments.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Enrollments"
        subtitle={isAdmin ? 'Enroll students in courses.' : 'Students enrolled in your courses (read-only).'}
        action={isAdmin ? <button type="button" className="btn btn-primary" onClick={openCreate}>Enroll student</button> : null}
      />

      {notice && (
        <div className="mb-4">
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>
      )}

      <DataTable
        rows={rows}
        searchKeys={['student_name', 'student_email', 'roll_no', 'course_code', 'course_name']}
        searchPlaceholder="Search by student or course..."
        filters={[{ key: 'course_id', label: 'Course', options: courseOptions }]}
        emptyTitle="No enrollments found"
        emptyMessage="Enroll students in courses to start tracking attendance."
        columns={[
          {
            key: 'course_code',
            label: 'Course',
            render: (row) => (
              <div>
                <p className="font-medium text-slate-900">{row.course_code}</p>
                <p className="text-xs text-slate-500">{row.course_name}</p>
              </div>
            ),
          },
          { key: 'student_name', label: 'Student' },
          { key: 'roll_no', label: 'Roll No' },
          { key: 'department_name', label: 'Department', render: (row) => row.department_name || '—' },
          { key: 'created_at', label: 'Enrolled', render: (row) => formatDate(row.created_at) },
        ]}
        actions={isAdmin ? (row) => (
          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>Remove</button>
        ) : undefined}
      />

      {isAdmin && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Enroll student"
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" form="enrollment-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Enroll'}
              </button>
            </div>
          }
        >
          <form id="enrollment-form" className="space-y-4" onSubmit={handleSubmit}>
            <Alert message={formError} onClose={() => setFormError('')} />
            <Field label="Student" htmlFor="enrollment-student">
              <SelectInput
                id="enrollment-student"
                required
                value={form.student_id}
                onChange={(event) => setForm((prev) => ({ ...prev, student_id: event.target.value }))}
              >
                <option value="">Select a student</option>
                {studentOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Course" htmlFor="enrollment-course">
              <SelectInput
                id="enrollment-course"
                required
                value={form.course_id}
                onChange={(event) => setForm((prev) => ({ ...prev, course_id: event.target.value }))}
              >
                <option value="">Select a course</option>
                {courseOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectInput>
            </Field>
            <p className="text-xs text-slate-500">
              A student can only be enrolled once per course.
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}
