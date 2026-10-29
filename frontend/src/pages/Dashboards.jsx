import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import { EmptyState, ErrorState, PageHeader, StatCard } from '../components/States.jsx';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { formatDate } from '../utils/format.js';

function RecentAnnouncements({ announcements, loading, error }) {
  if (loading) return <p className="text-sm text-slate-500">Loading announcements...</p>;
  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!announcements?.length) {
    return <EmptyState title="No announcements yet" message="New announcements will appear here." />;
  }
  return (
    <div className="space-y-3">
      {announcements.slice(0, 4).map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const departments = useApiData('/departments');
  const courses = useApiData('/courses');
  const students = useApiData('/students');
  const faculty = useApiData('/faculty');
  const announcements = useApiData('/announcements');

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle="Overview of your institution."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Departments" value={departments.data?.departments?.length ?? '—'} tone="indigo" hint="Academic units" />
        <StatCard label="Courses" value={courses.data?.courses?.length ?? '—'} tone="emerald" hint="Across all departments" />
        <StatCard label="Students" value={students.data?.students?.length ?? '—'} tone="amber" hint="Active and inactive" />
        <StatCard label="Faculty" value={faculty.data?.faculty?.length ?? '—'} tone="rose" hint="Teaching staff" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent announcements</h2>
            <Link to="/announcements" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <RecentAnnouncements
            announcements={announcements.data?.announcements}
            loading={announcements.loading}
            error={announcements.error}
          />
        </section>

        <section className="card h-fit p-5">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link to="/departments/manage" className="btn btn-secondary w-full justify-start">Manage departments</Link>
            <Link to="/courses" className="btn btn-secondary w-full justify-start">Manage courses</Link>
            <Link to="/students" className="btn btn-secondary w-full justify-start">Manage students</Link>
            <Link to="/faculty" className="btn btn-secondary w-full justify-start">Manage faculty</Link>
            <Link to="/attendance" className="btn btn-secondary w-full justify-start">Attendance overview</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function FacultyDashboard() {
  const { user } = useAuth();
  const courses = useApiData('/courses');
  const roster = useApiData('/faculty/roster');
  const announcements = useApiData('/announcements');

  const myCourses = (courses.data?.courses || []).filter((course) => course.faculty_id === user.id);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle="Your courses and department at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Courses assigned to you" value={myCourses.length} tone="emerald" />
        <StatCard label="Department students" value={roster.data?.students?.length ?? '—'} tone="indigo" />
        <StatCard label="Announcements" value={announcements.data?.announcements?.length ?? '—'} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">My courses</h2>
            <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              All courses
            </Link>
          </div>
          {courses.loading && <p className="mt-3 text-sm text-slate-500">Loading courses...</p>}
          {courses.error && <ErrorState message={courses.error} onRetry={courses.reload} />}
          {!courses.loading && !courses.error && myCourses.length === 0 && (
            <EmptyState title="No courses assigned" message="An administrator has not assigned any courses to you yet." />
          )}
          {myCourses.length > 0 && (
            <div className="mt-3 divide-y divide-slate-100">
              {myCourses.map((course) => (
                <div key={course.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      {course.code} · {course.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {course.department_name || 'No department'} · Semester {course.semester ?? '—'} ·{' '}
                      {course.enrolled_count} enrolled
                    </p>
                  </div>
                  <Link to="/attendance" className="btn btn-secondary btn-sm">Student attendance</Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Link to="/attendance" className="btn btn-primary w-full justify-start">Student attendance</Link>
              <Link to="/announcements" className="btn btn-secondary w-full justify-start">Post an announcement</Link>
              <Link to="/students" className="btn btn-secondary w-full justify-start">View department roster</Link>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900">Department</h2>
            <p className="mt-2 text-sm text-slate-600">
              {roster.data?.department?.name || 'No department assigned'}
            </p>
            {roster.data?.students?.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Updated {formatDate(new Date())}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent announcements</h2>
          <Link to="/announcements" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <RecentAnnouncements
          announcements={announcements.data?.announcements}
          loading={announcements.loading}
          error={announcements.error}
        />
      </section>
    </div>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();
  const attendance = useApiData('/attendance/me');
  const courses = useApiData('/courses');
  const announcements = useApiData('/announcements');

  const courseAttendance = attendance.data?.courses || [];
  const scored = courseAttendance.filter((course) => course.percentage !== null);
  const average = scored.length
    ? Math.round(scored.reduce((sum, course) => sum + course.percentage, 0) / scored.length)
    : null;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle={user.profile?.department_name ? `${user.profile.department_name} · Year ${user.profile.year}` : 'Your courses and attendance.'}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled courses" value={courses.data?.courses?.length ?? '—'} tone="indigo" />
        <StatCard label="Average attendance" value={average === null ? '—' : `${average}%`} tone={average !== null && average < 75 ? 'rose' : 'emerald'} />
        <StatCard label="Announcements" value={announcements.data?.announcements?.length ?? '—'} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Attendance by course</h2>
          {attendance.loading && <p className="mt-3 text-sm text-slate-500">Loading attendance...</p>}
          {attendance.error && <ErrorState message={attendance.error} onRetry={attendance.reload} />}
          {!attendance.loading && !attendance.error && courseAttendance.length === 0 && (
            <EmptyState title="No enrolled courses" message="Contact your administrator to be enrolled in courses." />
          )}
          <div className="mt-3 space-y-4">
            {courseAttendance.map((course) => (
              <div key={course.course_id} className="rounded-lg border border-slate-100 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800">
                    {course.code} · {course.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {course.present}/{course.total} classes
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${course.percentage === null ? 'bg-slate-300' : course.percentage >= 75 ? 'bg-emerald-500' : course.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${course.percentage ?? 0}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs font-medium text-slate-600">
                  {course.percentage === null ? 'No classes recorded' : `${course.percentage}%`}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900">My courses</h2>
            <div className="mt-3 space-y-2">
              {(courses.data?.courses || []).map((course) => (
                <div key={course.id} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-sm font-medium text-slate-800">{course.code}</p>
                  <p className="text-xs text-slate-500">{course.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.faculty_name || 'Faculty not assigned'} · Semester {course.semester ?? '—'}
                  </p>
                </div>
              ))}
              {!courses.loading && (courses.data?.courses || []).length === 0 && (
                <p className="text-sm text-slate-500">No enrolled courses.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Relevant announcements</h2>
          <Link to="/announcements" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <RecentAnnouncements
          announcements={announcements.data?.announcements}
          loading={announcements.loading}
          error={announcements.error}
        />
      </section>
    </div>
  );
}
