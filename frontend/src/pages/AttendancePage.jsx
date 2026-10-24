import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { api } from '../services/api.js';
import AttendanceBar from '../components/AttendanceBar.jsx';
import { Alert, EmptyState, ErrorState, PageHeader, PageLoader, StatCard } from '../components/States.jsx';
import { Field, SelectInput, TextInput } from '../components/FormControls.jsx';
import { todayISO } from '../utils/format.js';

function StudentAttendance() {
  const { data, loading, error, reload } = useApiData('/attendance/me');

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const courses = data?.courses || [];
  const scored = courses.filter((course) => course.percentage !== null);
  const average = scored.length
    ? Math.round(scored.reduce((sum, course) => sum + course.percentage, 0) / scored.length)
    : null;

  return (
    <div>
      <PageHeader title="My attendance" subtitle="Attendance percentage for each of your enrolled courses." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled courses" value={courses.length} tone="indigo" />
        <StatCard
          label="Average attendance"
          value={average === null ? '—' : `${average}%`}
          tone={average !== null && average < 75 ? 'rose' : 'emerald'}
        />
        <StatCard label="Courses below 75%" value={scored.filter((course) => course.percentage < 75).length} tone="amber" />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Course breakdown</h2>
        </div>
        {courses.length === 0 ? (
          <EmptyState title="No attendance yet" message="You are not enrolled in any courses, or no attendance has been recorded." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Course</th>
                  <th className="th">Present</th>
                  <th className="th">Total classes</th>
                  <th className="th min-w-[12rem]">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {courses.map((course) => (
                  <tr key={course.course_id}>
                    <td className="td">
                      <p className="font-medium text-slate-900">{course.code}</p>
                      <p className="text-xs text-slate-500">{course.name}</p>
                    </td>
                    <td className="td">{course.present}</td>
                    <td className="td">{course.total}</td>
                    <td className="td"><AttendanceBar percentage={course.percentage} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffAttendance() {
  const { user } = useAuth();
  const courses = useApiData('/courses');
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [session, setSession] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      if (!courseId || !date) {
        setSession(null);
        setStatuses({});
        return;
      }
      setLoading(true);
      setError('');
      setNotice('');
      try {
        const data = await api.get(`/attendance/session?course_id=${courseId}&date=${date}`);
        if (cancelled) return;
        setSession(data);
        const next = {};
        for (const student of data.students) {
          next[student.student_id] = student.status || 'present';
        }
        setStatuses(next);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setSession(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [courseId, date]);

  if (courses.loading) return <PageLoader />;
  if (courses.error) return <ErrorState message={courses.error} onRetry={courses.reload} />;

  const courseOptions = (courses.data?.courses || []).filter(
    (course) => user.role !== 'faculty' || course.faculty_id === user.id,
  );
  const students = session?.students || [];
  const presentCount = Object.values(statuses).filter((status) => status === 'present').length;
  const absentCount = Object.values(statuses).filter((status) => status === 'absent').length;

  function toggle(studentId, checked) {
    setStatuses((prev) => ({ ...prev, [studentId]: checked ? 'present' : 'absent' }));
  }

  function markAll(status) {
    setStatuses(() => {
      const next = {};
      for (const student of students) {
        next[student.student_id] = status;
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!session) return;
    const records = Object.entries(statuses).map(([studentId, status]) => ({
      student_id: Number(studentId),
      status,
    }));
    if (records.length === 0) {
      setError('There are no students to submit.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/attendance', { course_id: Number(courseId), date, records });
      setNotice(`Attendance saved for ${records.length} students.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Pick a course and date, then mark each student present or absent."
      />

      <form className="card p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Course" htmlFor="attendance-course">
            <SelectInput
              id="attendance-course"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} · {course.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Date" htmlFor="attendance-date">
            <TextInput
              id="attendance-date"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </Field>
          <div className="flex items-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => markAll('present')} disabled={!students.length}>
              Mark all present
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => markAll('absent')} disabled={!students.length}>
              Mark all absent
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Alert message={error} onClose={() => setError('')} />
          <Alert type="success" message={notice} onClose={() => setNotice('')} />
        </div>

        {courseOptions.length === 0 && (
          <div className="mt-4">
            <EmptyState title="No courses assigned" message="You need a course with enrolled students before you can mark attendance." />
          </div>
        )}

        {courseId && loading && <p className="mt-4 text-sm text-slate-500">Loading roster...</p>}

        {session && !loading && (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-600">
                {session.course.code} · {session.course.name} — {date}
              </p>
              <p className="text-xs text-slate-500">
                {presentCount} present · {absentCount} absent · {students.length} enrolled
              </p>
            </div>

            {students.length === 0 ? (
              <EmptyState title="No students enrolled" message="Enroll students in this course before marking attendance." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="th">Present</th>
                      <th className="th">Roll No</th>
                      <th className="th">Student</th>
                      <th className="th">Status</th>
                      <th className="th">Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {students.map((student) => {
                      const status = statuses[student.student_id] || 'absent';
                      return (
                        <tr key={student.student_id} className="hover:bg-slate-50">
                          <td className="td">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              checked={status === 'present'}
                              onChange={(event) => toggle(student.student_id, event.target.checked)}
                              aria-label={`Mark ${student.name} present`}
                            />
                          </td>
                          <td className="td">{student.roll_no}</td>
                          <td className="td">{student.name}</td>
                          <td className="td">
                            <span className={`badge ${status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {status}
                            </span>
                          </td>
                          <td className="td text-xs text-slate-500">
                            {student.status ? `Previously ${student.status}` : 'Not marked'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save attendance'}
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  if (user.role === 'student') return <StudentAttendance />;
  return <StaffAttendance />;
}
