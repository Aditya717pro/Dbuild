import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiData } from '../hooks/useApiData.js';
import AttendanceBar from '../components/AttendanceBar.jsx';
import { EmptyState, ErrorState, PageHeader, PageLoader, StatCard } from '../components/States.jsx';

const TABS = [
  { id: 'marksheets', label: 'End Semester Marksheet' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'fees', label: 'Fees Details' },
];

const SEMESTERS = [1, 2, 3, 4, 5];

const DUMMY_SEMESTER_ATTENDANCE = {
  1: 88,
  2: 84,
  3: 79,
  4: 73,
  5: 91,
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function formatRecordDate(value) {
  if (!value) return '-';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function gradeTone(grade) {
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-100 text-emerald-700';
  if (grade === 'B+' || grade === 'B') return 'bg-indigo-100 text-indigo-700';
  if (grade === 'C') return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

function statusTone(status) {
  if (status === 'paid') return 'bg-emerald-100 text-emerald-700';
  if (status === 'partial') return 'bg-amber-100 text-amber-700';
  if (status === 'overdue') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-700';
}

function TabButton({ tab, active, onSelect }) {
  return (
    <button
      type="button"
      role="tab"
      id={`records-tab-${tab.id}`}
      aria-selected={active}
      aria-controls={`records-panel-${tab.id}`}
      onClick={() => onSelect(tab.id)}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-white hover:text-slate-900'
      }`}
    >
      {tab.label}
    </button>
  );
}

function MarksheetTab({ marksheets }) {
  const [selectedSemester, setSelectedSemester] = useState(1);

  if (marksheets.loading) return <PageLoader label="Loading end semester marksheets..." />;
  if (marksheets.error) return <ErrorState message={marksheets.error} onRetry={marksheets.reload} />;

  const semesters = marksheets.data?.semesters || [];
  const sheet = semesters.find((item) => item.semester === selectedSemester);
  const rows = sheet?.subjects || [];
  const summary = sheet?.summary || {};
  const passed = summary.result === 'Passed';

  return (
    <div>
      <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">End semester marksheets</h2>
          <p className="text-sm text-slate-500">
            Select a semester to view its published marksheet.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <label className="label" htmlFor="marksheet-semester">Semester</label>
          <select
            id="marksheet-semester"
            className="input min-w-[10rem]"
            value={selectedSemester}
            onChange={(event) => setSelectedSemester(Number(event.target.value))}
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>Sem {semester}</option>
            ))}
          </select>
        </div>
      </div>

      {!sheet ? (
        <div className="card">
          <EmptyState
            title={`No Sem ${selectedSemester} marksheet published`}
            message="This semester marksheet will appear here once it is published."
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Semester" value={summary.semester ?? selectedSemester} tone="indigo" />
            <StatCard label="Subjects" value={summary.total_subjects ?? rows.length} tone="amber" />
            <StatCard label="Overall Grade" value={summary.grade || '-'} tone="slate" />
            <StatCard label="Result" value={summary.result || '-'} tone={passed ? 'emerald' : 'rose'} />
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  End Semester Examination
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Semester {summary.semester ?? selectedSemester} Marksheet
                </h2>
                <p className="text-sm text-slate-500">
                  Published {formatRecordDate(summary.published_on)}
                </p>
              </div>
              <span className={`badge ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {summary.result || '-'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="th">Subject Code</th>
                    <th className="th">Subject</th>
                    <th className="th">Grade</th>
                    <th className="th">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="td font-medium text-slate-900">{row.course_code}</td>
                      <td className="td">{row.course_name}</td>
                      <td className="td">
                        <span className={`badge ${gradeTone(row.grade)}`}>{row.grade || '-'}</span>
                      </td>
                      <td className="td">
                        <span className={`badge ${row.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td className="td font-semibold text-slate-900" colSpan={2}>Overall</td>
                    <td className="td font-semibold text-slate-900">{summary.grade || '-'}</td>
                    <td className="td font-semibold text-slate-900">{summary.result || '-'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AttendanceTab({ attendance }) {
  const [selectedSemester, setSelectedSemester] = useState(1);

  if (attendance.loading) return <PageLoader label="Loading attendance..." />;
  if (attendance.error) return <ErrorState message={attendance.error} onRetry={attendance.reload} />;

  const courses = attendance.data?.courses || [];
  const scored = courses.filter((course) => course.percentage !== null);
  const average = scored.length
    ? Math.round(scored.reduce((sum, course) => sum + course.percentage, 0) / scored.length)
    : null;
  const semesterPercentage = DUMMY_SEMESTER_ATTENDANCE[selectedSemester] ?? 0;

  return (
    <div>
      <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attendance by semester</h2>
          <p className="text-sm text-slate-500">
            Select a semester to view its overall attendance percentage.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <label className="label" htmlFor="attendance-semester">Semester</label>
          <select
            id="attendance-semester"
            className="input min-w-[10rem]"
            value={selectedSemester}
            onChange={(event) => setSelectedSemester(Number(event.target.value))}
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>Sem {semester}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={`Sem ${selectedSemester} attendance`} value={`${semesterPercentage}%`} tone={semesterPercentage < 75 ? 'rose' : 'emerald'} />
        <StatCard
          label="Average attendance"
          value={average === null ? '-' : `${average}%`}
          tone={average !== null && average < 75 ? 'rose' : 'emerald'}
        />
        <StatCard
          label="Courses below 75%"
          value={scored.filter((course) => course.percentage < 75).length}
          tone="amber"
        />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Attendance by course</h2>
          <p className="text-sm text-slate-500">Attendance recorded for each enrolled course.</p>
        </div>
        {courses.length === 0 ? (
          <EmptyState
            title="No attendance yet"
            message="You are not enrolled in any courses, or no attendance has been recorded."
          />
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
                  <tr key={course.course_id} className="hover:bg-slate-50">
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

function FeesTab({ fees }) {
  if (fees.loading) return <PageLoader label="Loading fees details..." />;
  if (fees.error) return <ErrorState message={fees.error} onRetry={fees.reload} />;

  const rows = fees.data?.fees || [];
  const summary = fees.data?.summary || { total: 0, paid: 0, outstanding: 0 };

  if (rows.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No fee records"
          message="Your fee invoices and payment history will appear here."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total billed" value={formatCurrency(summary.total)} tone="indigo" />
        <StatCard label="Paid" value={formatCurrency(summary.paid)} tone="emerald" />
        <StatCard
          label="Outstanding"
          value={formatCurrency(summary.outstanding)}
          tone={summary.outstanding > 0 ? 'rose' : 'emerald'}
        />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Fees details</h2>
          <p className="text-sm text-slate-500">Fee invoices, payments, and outstanding balances.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="th">Fee</th>
                <th className="th">Amount</th>
                <th className="th">Paid</th>
                <th className="th">Balance</th>
                <th className="th">Due date</th>
                <th className="th">Status</th>
                <th className="th">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="td font-medium text-slate-900">{row.fee_type}</td>
                  <td className="td">{formatCurrency(row.amount)}</td>
                  <td className="td">
                    <p>{formatCurrency(row.paid_amount)}</p>
                    {row.paid_on && (
                      <p className="text-xs text-slate-500">Paid {formatRecordDate(row.paid_on)}</p>
                    )}
                  </td>
                  <td className="td">{formatCurrency(row.balance)}</td>
                  <td className="td text-slate-600">{formatRecordDate(row.due_date)}</td>
                  <td className="td">
                    <span className={`badge capitalize ${statusTone(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="td text-xs text-slate-500">{row.receipt_no || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Payments shown here are recorded by the accounts office.
        </div>
      </div>
    </div>
  );
}

export default function StudentRecordsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('marksheets');
  const marksheets = useApiData('/records/me/marksheets');
  const attendance = useApiData('/attendance/me');
  const fees = useApiData('/records/me/fees');

  const subtitle = user?.profile?.roll_no
    ? `${user.profile.roll_no} - ${user.profile.department_name || 'Student'}`
    : `Student ID ${user?.id}`;

  return (
    <div>
      <PageHeader title="My records" subtitle={subtitle} />

      <div
        role="tablist"
        aria-label="Student records"
        className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onSelect={setActiveTab}
          />
        ))}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`records-panel-${tab.id}`}
          aria-labelledby={`records-tab-${tab.id}`}
          hidden={activeTab !== tab.id}
        >
          {tab.id === 'marksheets' && <MarksheetTab marksheets={marksheets} />}
          {tab.id === 'attendance' && <AttendanceTab attendance={attendance} />}
          {tab.id === 'fees' && <FeesTab fees={fees} />}
        </div>
      ))}
    </div>
  );
}
