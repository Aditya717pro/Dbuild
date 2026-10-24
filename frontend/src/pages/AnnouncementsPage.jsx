import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { api } from '../services/api.js';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader } from '../components/States.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../components/FormControls.jsx';

const EMPTY_FORM = {
  title: '',
  body: '',
  audience: 'all',
  department_id: '',
  course_id: '',
};

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const isStaff = user.role === 'admin' || user.role === 'faculty';

  const announcements = useApiData('/announcements');
  const departments = useApiData('/departments');
  const courses = useApiData('/courses');

  const [form, setForm] = useState({ ...EMPTY_FORM, audience: isAdmin ? 'all' : 'department' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [feedFilter, setFeedFilter] = useState('');

  const rows = announcements.data?.announcements || [];
  const departmentOptions = departments.data?.departments || [];
  const courseOptions = courses.data?.courses || [];
  const visible = feedFilter ? rows.filter((row) => row.audience === feedFilter) : rows;

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
      };
      if (form.audience === 'department') payload.department_id = Number(form.department_id);
      if (form.audience === 'course') payload.course_id = Number(form.course_id);

      await api.post('/announcements', payload);
      setForm({ ...EMPTY_FORM, audience: isAdmin ? 'all' : 'department' });
      setNotice('Announcement posted');
      await announcements.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(announcement) {
    if (!window.confirm(`Delete announcement "${announcement.title}"?`)) return;
    try {
      await api.del(`/announcements/${announcement.id}`);
      setNotice('Announcement deleted');
      await announcements.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  if (announcements.loading) return <PageLoader />;
  if (announcements.error) return <ErrorState message={announcements.error} onRetry={announcements.reload} />;

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle={isStaff ? 'Post updates and view announcements relevant to you.' : 'Announcements relevant to your department and courses.'}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Feed</h2>
            <select
              className="input w-auto"
              value={feedFilter}
              onChange={(event) => setFeedFilter(event.target.value)}
              aria-label="Filter announcements by audience"
            >
              <option value="">All audiences</option>
              <option value="all">Everyone</option>
              <option value="department">Department</option>
              <option value="course">Course</option>
            </select>
          </div>

          {notice && <Alert type="success" message={notice} onClose={() => setNotice('')} />}

          {visible.length === 0 ? (
            <div className="card">
              <EmptyState
                title="No announcements"
                message={rows.length === 0 ? 'New announcements will appear here.' : 'No announcements match this filter.'}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  canDelete={isAdmin || announcement.posted_by === user.id}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {isStaff && (
          <section className="card h-fit p-5">
            <h2 className="text-lg font-semibold text-slate-900">Create announcement</h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <Alert message={formError} onClose={() => setFormError('')} />

              <Field label="Title" htmlFor="announcement-title">
                <TextInput
                  id="announcement-title"
                  required
                  minLength={3}
                  maxLength={200}
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Mid-semester exam schedule"
                />
              </Field>

              <Field label="Message" htmlFor="announcement-body">
                <TextArea
                  id="announcement-body"
                  required
                  maxLength={5000}
                  value={form.body}
                  onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                  placeholder="Share the details..."
                />
              </Field>

              <Field label="Audience" htmlFor="announcement-audience">
                <SelectInput
                  id="announcement-audience"
                  value={form.audience}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      audience: event.target.value,
                      department_id: '',
                      course_id: '',
                    }))
                  }
                >
                  {isAdmin && <option value="all">Everyone</option>}
                  <option value="department">Department</option>
                  <option value="course">Course</option>
                </SelectInput>
              </Field>

              {form.audience === 'department' && (
                <Field label="Department" htmlFor="announcement-department">
                  <SelectInput
                    id="announcement-department"
                    required
                    value={form.department_id}
                    onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))}
                  >
                    <option value="">Select a department</option>
                    {departmentOptions.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.code} · {department.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              )}

              {form.audience === 'course' && (
                <Field label="Course" htmlFor="announcement-course">
                  <SelectInput
                    id="announcement-course"
                    required
                    value={form.course_id}
                    onChange={(event) => setForm((prev) => ({ ...prev, course_id: event.target.value }))}
                  >
                    <option value="">Select a course</option>
                    {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} · {course.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              )}

              <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                {saving ? 'Posting...' : 'Post announcement'}
              </button>
              {!isAdmin && (
                <p className="text-xs text-slate-500">
                  Faculty can post to their own department or courses they teach.
                </p>
              )}
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
