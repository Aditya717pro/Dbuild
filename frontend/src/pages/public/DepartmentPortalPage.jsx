import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';
import { API_BASE } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import { getDepartmentContent, DRAFT_NOTICE } from '../../data/departmentPortalData.js';

const ICON_PATHS = {
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Zm4 0h8M4 17h14',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3',
  chip: 'M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M7 7h10v10H7z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  briefcase: 'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18',
  search: 'M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  pin: 'M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8 9.5a16 16 0 0 0 6 6l1.05-1.3a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92Z',
  building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20',
  check: 'M20 6 9 17l-5-5',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  document: 'M7 3h7l5 5v13H7zM14 3v5h5M9 13h6M9 17h6',
};

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name] || ICON_PATHS.spark} />
    </svg>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#0b3d91]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {message && <p className="mt-1 text-xs text-slate-500">{message}</p>}
    </div>
  );
}

function DraftNote() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
      {DRAFT_NOTICE}
    </p>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-center">
      <p className="text-lg font-bold text-[#0b3d91]">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-600">{label}</p>
    </div>
  );
}

function InfoListCard({ title, icon, items }) {
  return (
    <section className="card p-5">
      <div className="flex items-center gap-2 text-[#0b3d91]">
        <Icon name={icon} className="h-5 w-5" />
        <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>
      </div>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0b3d91]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-slate-500">Information not published yet.</p>
      )}
    </section>
  );
}

function ImagePlaceholder({ icon = 'flask', label }) {
  return (
    <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#0b3d91] via-[#0a357f] to-[#041e42]">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -left-6 top-4 h-24 w-24 rounded-full border border-white/40" />
        <div className="absolute -right-4 bottom-0 h-20 w-20 rounded-full border border-white/30" />
      </div>
      <div className="relative flex flex-col items-center gap-2 text-white/90">
        <Icon name={icon} className="h-8 w-8" />
        <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}

function DocumentAction({ label, to }) {
  if (!to) {
    return <span className="text-[11px] font-medium text-slate-400">Not published</span>;
  }
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0b3d91] hover:underline">
      {label} <Icon name="arrow" className="h-3 w-3" />
    </Link>
  );
}

function formatValue(value) {
  return value === null || value === undefined || value === '' ? '—' : value;
}

export default function DepartmentPortalPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const content = getDepartmentContent(slug);
  const configDept = siteConfig.departments.find((d) => d.slug === slug);
  const deptCode = configDept?.code?.replace(/\s+/g, '') ?? slug.toUpperCase();

  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [facultyError, setFacultyError] = useState('');

  const [labQuery, setLabQuery] = useState('');
  const [labCategory, setLabCategory] = useState('all');
  const [activeLab, setActiveLab] = useState(null);

  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [subjectQuery, setSubjectQuery] = useState('');
  const [subjectCategory, setSubjectCategory] = useState('all');

  const [eventCategory, setEventCategory] = useState('all');
  const [eventYear, setEventYear] = useState('all');
  const [activeEvent, setActiveEvent] = useState(null);

  const [placementYear, setPlacementYear] = useState('');

  useEffect(() => {
    if (!deptCode) return;
    setFacultyLoading(true);
    setFacultyError('');
    fetch(`${API_BASE}/public/departments/${encodeURIComponent(deptCode)}/faculty`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setFacultyList(data.faculty || []))
      .catch((err) => setFacultyError(err.message))
      .finally(() => setFacultyLoading(false));
  }, [deptCode]);

  useEffect(() => {
    setLabQuery('');
    setLabCategory('all');
    setActiveLab(null);
    setSelectedProgramme('');
    setSelectedRegulation('');
    setSelectedSemester('all');
    setSubjectQuery('');
    setSubjectCategory('all');
    setEventCategory('all');
    setEventYear('all');
    setActiveEvent(null);
    setPlacementYear('');
  }, [slug]);

  const hod = useMemo(() => {
    if (!facultyList.length) return null;
    return (
      facultyList.find((f) => /head|hod/i.test(f.designation || '')) ||
      facultyList.find((f) => /professor/i.test(f.designation || '')) ||
      facultyList[0]
    );
  }, [facultyList]);

  const labs = useMemo(() => content?.labs ?? [], [content]);
  const labCategories = useMemo(
    () => ['all', ...Array.from(new Set(labs.map((l) => l.category)))],
    [labs],
  );
  const filteredLabs = useMemo(() => {
    const query = labQuery.trim().toLowerCase();
    return labs.filter((l) => {
      const matchesCategory = labCategory === 'all' || l.category === labCategory;
      const matchesQuery = !query || l.name.toLowerCase().includes(query) || l.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [labs, labCategory, labQuery]);

  const curriculumProgrammes = content?.curriculum?.programmes ?? [];
  const activeProgramme =
    curriculumProgrammes.find((p) => p.id === selectedProgramme) || curriculumProgrammes[0] || null;
  const regulations = activeProgramme?.regulations ?? [];
  const activeRegulation =
    regulations.find((r) => r.year === selectedRegulation) || regulations[0] || null;
  const semesters = useMemo(() => activeRegulation?.semesters ?? [], [activeRegulation]);
  const allSubjects = useMemo(
    () => semesters.flatMap((s) => s.subjects.map((subject) => ({ ...subject, semester: s.number }))),
    [semesters],
  );
  const subjectCategories = useMemo(
    () => ['all', ...Array.from(new Set(allSubjects.map((s) => s.category)))],
    [allSubjects],
  );
  const filteredSubjects = useMemo(() => {
    const query = subjectQuery.trim().toLowerCase();
    return allSubjects.filter((s) => {
      const matchesSemester = selectedSemester === 'all' || String(s.semester) === selectedSemester;
      const matchesCategory = subjectCategory === 'all' || s.category === subjectCategory;
      const matchesQuery = !query || s.name.toLowerCase().includes(query) || (s.code || '').toLowerCase().includes(query);
      return matchesSemester && matchesCategory && matchesQuery;
    });
  }, [allSubjects, selectedSemester, subjectCategory, subjectQuery]);

  const events = useMemo(() => content?.events ?? [], [content]);
  const eventCategories = useMemo(
    () => ['all', ...Array.from(new Set(events.map((e) => e.category)))],
    [events],
  );
  const eventYears = useMemo(
    () => ['all', ...Array.from(new Set(events.map((e) => e.academicYear).filter(Boolean)))],
    [events],
  );
  const filteredEvents = useMemo(
    () =>
      events.filter((e) => {
        const matchesCategory = eventCategory === 'all' || e.category === eventCategory;
        const matchesYear = eventYear === 'all' || e.academicYear === eventYear;
        return matchesCategory && matchesYear;
      }),
    [events, eventCategory, eventYear],
  );

  const placementData = content?.placements ?? null;
  const placementYears = placementData?.years ?? [];
  const activePlacement =
    placementYears.find((y) => y.year === placementYear) || placementYears[0] || null;

  if (!content) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Department Not Found</h1>
        <p className="mt-2 text-slate-600">The requested department does not exist.</p>
        <Link to="/" className="mt-4 inline-block btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview & HOD' },
    { id: 'vision', label: 'Vision & Mission' },
    { id: 'labs', label: 'Laboratories' },
    { id: 'curriculum', label: 'Curriculum & Syllabus' },
    { id: 'association', label: 'Association & Activities' },
    { id: 'placements', label: 'Placements & Records' },
  ];
  const requestedTab = searchParams.get('tab') || 'overview';
  const currentTab = tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'overview';
  const isDraft = content.contentStatus === 'draft';

  function setTab(tabId) {
    setSearchParams({ tab: tabId });
  }

  const programmeSummary = content.programmes.length
    ? content.programmes.map((p) => p.degree).join(' • ')
    : 'Programmes';

  const highlights = [
    { icon: 'book', title: 'Academic Excellence', text: 'Outcome-based curriculum with continuous assessment and academic mentoring.' },
    { icon: 'flask', title: 'Practical Learning', text: 'Laboratory sessions, workshops and project-based learning across the curriculum.' },
    { icon: 'spark', title: 'Research & Innovation', text: content.researchAreas.length ? `Focus areas include ${content.researchAreas.slice(0, 2).join(' and ')}.` : 'Encouragement for research, innovation and student projects.' },
    { icon: 'briefcase', title: 'Industry Interaction', text: 'Internships, expert lectures and collaboration with industry partners.' },
    { icon: 'users', title: 'Student Development', text: 'Technical clubs, departmental associations and co-curricular activities.' },
    { icon: 'chart', title: 'Career Preparation', text: 'Aptitude training, career guidance and placement preparation support.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-gradient-to-r from-[#0b3d91] via-[#09357e] to-[#041e42] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <nav className="flex items-center gap-2 text-xs text-blue-200" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium">Departments</span>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium">{content.code}</span>
          </nav>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                  {content.code}
                </span>
                {content.accredited && (
                  <span className="rounded bg-emerald-500/90 px-2 py-0.5 text-xs font-bold uppercase text-white shadow-sm">
                    Professionally Accredited
                  </span>
                )}
                <span className="text-xs text-blue-200">
                  {content.established ? `Est. ${content.established} • ` : ''}Bengaluru, India
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl text-white">
                Department of {content.name}
              </h1>
              <p className="mt-1 text-sm text-blue-100 max-w-3xl">
                {programmeSummary} • Bengaluru, India
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/15">
              <div className="text-center">
                <p className="text-xl font-black text-amber-300">{formatValue(content.intakeUG)}</p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">UG Intake</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-black text-amber-300">
                  {facultyLoading ? '…' : facultyList.length}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">Faculty</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-black text-emerald-300">
                  {activePlacement?.percentage ?? '—'}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">Placement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 bg-[#072d6d]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex overflow-x-auto gap-1 py-1 text-xs font-bold uppercase tracking-wide" role="tablist" aria-label="Department sections">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(tab.id)}
                    className={`whitespace-nowrap rounded-md px-3.5 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      isActive
                        ? 'bg-white text-[#0b3d91] shadow-sm font-extrabold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {currentTab === 'overview' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="About the Department" subtitle={content.tagline} />
                  {content.overview ? (
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">{content.overview}</p>
                  ) : (
                    <div className="mt-4">
                      <EmptyState title="Department introduction not published" message="The department profile will be available once approved by the department office." />
                    </div>
                  )}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatTile label="Established" value={formatValue(content.established)} />
                    <StatTile label="UG Intake" value={formatValue(content.intakeUG)} />
                    <StatTile label="Laboratories" value={labs.length} />
                    <StatTile label="Accreditation" value={content.accredited ? 'Accredited' : 'Industry-aligned'} />
                  </div>
                </section>

                <section className="card p-6">
                  <SectionHeader title="Department Highlights" subtitle="Academic strengths and student opportunities" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((item) => (
                      <div key={item.title} className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-sm">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0b3d91]">
                          <Icon name={item.icon} className="h-5 w-5" />
                        </span>
                        <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoListCard title="Department Objectives" icon="target" items={content.objectives} />
                  <InfoListCard title="Academic Focus" icon="book" items={content.academicFocus} />
                  <InfoListCard title="Research & Innovation" icon="spark" items={content.researchAreas} />
                  <InfoListCard title="Industry Interaction" icon="briefcase" items={content.industryInteraction} />
                </div>

                <section className="card overflow-hidden">
                  <div className="bg-[#0b3d91] px-6 py-3 text-white">
                    <h2 className="text-base font-bold">Head of the Department (HOD)</h2>
                  </div>
                  <div className="p-6">
                    {facultyLoading ? (
                      <div className="flex animate-pulse gap-4">
                        <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-200" />
                        <div className="flex-1 space-y-2 py-2">
                          <div className="h-4 w-2/3 rounded bg-slate-200" />
                          <div className="h-3 w-1/2 rounded bg-slate-200" />
                          <div className="h-3 w-3/4 rounded bg-slate-200" />
                        </div>
                      </div>
                    ) : facultyError ? (
                      <EmptyState title="HOD details unavailable" message="Faculty records could not be loaded right now." />
                    ) : hod ? (
                      <div>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-2xl font-extrabold text-white shadow-md">
                            {hod.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">{hod.name}</h3>
                            <p className="text-xs font-semibold uppercase text-[#0b3d91]">{hod.designation || 'Faculty'}</p>
                            <p className="text-xs text-slate-500">
                              <a href={`mailto:${hod.email}`} className="text-blue-600 hover:underline">{hod.email}</a>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg border-l-4 border-[#0b3d91] bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase text-slate-500">Department Profile</p>
                          <p className="mt-1 text-sm italic text-slate-700">{content.tagline}</p>
                          <p className="mt-2 text-xs text-slate-500">Qualification, specialization and experience will be published once verified by the department.</p>
                        </div>
                      </div>
                    ) : (
                      <EmptyState title="HOD details not published" message="No faculty member is currently listed as Head of the Department." />
                    )}
                  </div>
                </section>

                <section className="card p-6">
                  <SectionHeader title="Programmes Offered" subtitle="Academic programmes associated with this department" />
                  {content.programmes.length ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {content.programmes.map((p) => (
                        <div key={p.id} className="rounded-lg border border-slate-200 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{p.degree}</span>
                            <span className="text-xs font-medium text-slate-500">{p.duration}</span>
                          </div>
                          <h3 className="mt-2 text-sm font-bold text-slate-900">{p.name}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.description}</p>
                          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                            <div><dt className="inline font-semibold text-slate-700">Intake: </dt><dd className="inline">{formatValue(p.intake)}</dd></div>
                            {p.accreditation && <div><dt className="inline font-semibold text-slate-700">Status: </dt><dd className="inline">{p.accreditation}</dd></div>}
                          </dl>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <EmptyState title="Programme details not published" message="Programme information will appear once confirmed by the department." />
                    </div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader
                    title="Department Facilities"
                    subtitle="Infrastructure and academic resources"
                    action={
                      <button type="button" onClick={() => setTab('labs')} className="btn btn-secondary btn-sm">
                        View laboratories <Icon name="arrow" className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {content.facilities.map((facility) => (
                      <div key={facility.name} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0b3d91]">
                          <Icon name="building" className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{facility.name}</p>
                          <p className="text-xs text-slate-600">{facility.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card p-6">
                  <SectionHeader title="Contact Information" subtitle="Department office and communication details" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                      <Icon name="mail" className="mt-0.5 h-4 w-4 text-[#0b3d91]" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
                        <a href={`mailto:${content.contact.email}`} className="text-sm text-blue-600 hover:underline">{content.contact.email}</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                      <Icon name="phone" className="mt-0.5 h-4 w-4 text-[#0b3d91]" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Phone</p>
                        <p className="text-sm text-slate-700">{content.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                      <Icon name="building" className="mt-0.5 h-4 w-4 text-[#0b3d91]" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Office</p>
                        <p className="text-sm text-slate-700">{content.contact.office}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                      <Icon name="pin" className="mt-0.5 h-4 w-4 text-[#0b3d91]" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Address</p>
                        <p className="text-sm text-slate-700">{content.contact.address}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {currentTab === 'vision' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="Department Vision" subtitle="Long-term aspiration of the department" />
                  {content.vision ? (
                    <blockquote className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-5 text-sm font-medium leading-relaxed text-slate-800">
                      {content.vision}
                    </blockquote>
                  ) : (
                    <div className="mt-4"><EmptyState title="Vision not published" message="The approved vision statement will be published by the department." /></div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader title="Department Mission" subtitle="Commitments that guide academic and research activities" />
                  {content.mission.length ? (
                    <ol className="mt-4 space-y-3">
                      {content.mission.map((item, index) => (
                        <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0b3d91] text-xs font-bold text-white">M{index + 1}</span>
                          <span className="text-sm text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-4"><EmptyState title="Mission not published" message="The approved mission statements will be published by the department." /></div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader title="Programme Educational Objectives (PEOs)" subtitle="Career and professional goals for graduates" />
                  {content.peos.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {content.peos.map((peo) => (
                        <div key={peo.id} className="rounded-lg border border-slate-200 p-4">
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{peo.id}</span>
                          <p className="mt-2 text-sm text-slate-700">{peo.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4"><EmptyState title="PEOs not published" message="Programme educational objectives will appear once approved." /></div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader title="Programme Outcomes (POs)" subtitle="Indicative graduate attributes; subject to official approval" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {content.pos.map((po) => (
                      <div key={po.id} className="rounded-lg border border-slate-200 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{po.id}</span>
                        <p className="mt-1 text-xs leading-relaxed text-slate-700">{po.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card p-6">
                  <SectionHeader title="Programme Specific Outcomes (PSOs)" subtitle="Discipline-specific competencies for graduates" />
                  {content.psos.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {content.psos.map((pso) => (
                        <div key={pso.id} className="rounded-lg border border-slate-200 p-4">
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">{pso.id}</span>
                          <p className="mt-2 text-sm text-slate-700">{pso.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4"><EmptyState title="PSOs not published" message="Programme specific outcomes will appear once approved." /></div>
                  )}
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="card p-6">
                    <SectionHeader title="Department Goals" subtitle="Short and medium-term priorities" />
                    <ul className="mt-4 space-y-3">
                      {content.goals.map((goal) => (
                        <li key={goal.title} className="rounded-lg border border-slate-200 p-3">
                          <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                          <p className="mt-0.5 text-xs text-slate-600">{goal.text}</p>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="card p-6">
                    <SectionHeader title="Core Values" subtitle="Institutional values reflected in departmental practice" />
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {content.coreValues.map((value) => (
                        <div key={value.title} className="rounded-lg bg-slate-50 p-3">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                            <Icon name="check" className="h-4 w-4 text-emerald-600" />
                            {value.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">{value.text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {currentTab === 'labs' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="Laboratories & Research Facilities" subtitle="Department-specific laboratory infrastructure" />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon name="search" className="h-4 w-4" />
                      </span>
                      <input
                        type="search"
                        value={labQuery}
                        onChange={(event) => setLabQuery(event.target.value)}
                        placeholder="Search laboratories by name"
                        aria-label="Search laboratories"
                        className="input pl-9"
                      />
                    </div>
                    <select
                      value={labCategory}
                      onChange={(event) => setLabCategory(event.target.value)}
                      aria-label="Filter laboratories by category"
                      className="input sm:w-56"
                    >
                      {labCategories.map((category) => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Showing {filteredLabs.length} of {labs.length} laboratories
                  </p>

                  {filteredLabs.length ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {filteredLabs.map((labItem) => (
                        <div key={labItem.id} className="flex flex-col overflow-hidden rounded-lg border border-slate-200">
                          {labItem.image ? (
                            <img src={labItem.image} alt={labItem.name} className="h-36 w-full object-cover" />
                          ) : (
                            <ImagePlaceholder icon="flask" label="Laboratory" />
                          )}
                          <div className="flex flex-1 flex-col p-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{labItem.category}</span>
                              {labItem.incharge && <span className="text-[10px] text-slate-500">{labItem.incharge}</span>}
                            </div>
                            <h3 className="mt-2 text-sm font-bold text-slate-900">{labItem.name}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{labItem.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                              <span>{labItem.equipment.length} equipment items</span>
                              <span aria-hidden="true">•</span>
                              <span>{labItem.experiments.length} experiments</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveLab(labItem)}
                              className="btn btn-secondary btn-sm mt-4 w-fit"
                            >
                              View details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <EmptyState
                        title={labs.length ? 'No laboratories match your search' : 'Laboratory information not published'}
                        message={labs.length ? 'Try a different name or category.' : 'Laboratory details will appear once confirmed by the department.'}
                      />
                    </div>
                  )}
                </section>
              </div>
            )}

            {currentTab === 'curriculum' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="Curriculum & Syllabus" subtitle="Programme, regulation and semester-wise subject structure" />

                  {curriculumProgrammes.length ? (
                    <>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <label className="block text-xs font-semibold text-slate-600">
                          Programme
                          <select
                            value={activeProgramme?.id ?? ''}
                            onChange={(event) => {
                              setSelectedProgramme(event.target.value);
                              setSelectedRegulation('');
                              setSelectedSemester('all');
                            }}
                            className="input mt-1"
                          >
                            {curriculumProgrammes.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-xs font-semibold text-slate-600">
                          Regulation
                          <select
                            value={activeRegulation?.year ?? ''}
                            onChange={(event) => {
                              setSelectedRegulation(event.target.value);
                              setSelectedSemester('all');
                            }}
                            className="input mt-1"
                            disabled={!regulations.length}
                          >
                            {regulations.length ? regulations.map((r) => (
                              <option key={r.year} value={r.year}>{r.year}</option>
                            )) : <option value="">Not published</option>}
                          </select>
                        </label>
                        <label className="block text-xs font-semibold text-slate-600">
                          Semester
                          <select
                            value={selectedSemester}
                            onChange={(event) => setSelectedSemester(event.target.value)}
                            className="input mt-1"
                          >
                            <option value="all">All semesters</option>
                            {semesters.map((s) => (
                              <option key={s.number} value={String(s.number)}>{s.title}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="search" className="h-4 w-4" />
                          </span>
                          <input
                            type="search"
                            value={subjectQuery}
                            onChange={(event) => setSubjectQuery(event.target.value)}
                            placeholder="Search by subject name or code"
                            aria-label="Search subjects"
                            className="input pl-9"
                          />
                        </div>
                        <select
                          value={subjectCategory}
                          onChange={(event) => setSubjectCategory(event.target.value)}
                          aria-label="Filter subjects by category"
                          className="input sm:w-56"
                        >
                          {subjectCategories.map((category) => (
                            <option key={category} value={category}>
                              {category === 'all' ? 'All categories' : category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {filteredSubjects.length ? (
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="th">Code</th>
                                <th className="th">Subject</th>
                                <th className="th">Category</th>
                                <th className="th">Credits</th>
                                <th className="th">Sem</th>
                                <th className="th">Syllabus</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredSubjects.map((subject) => (
                                <tr key={`${subject.semester}-${subject.name}`} className="hover:bg-slate-50/70">
                                  <td className="td whitespace-nowrap text-xs text-slate-500">{subject.code || '—'}</td>
                                  <td className="td font-medium text-slate-800">{subject.name}</td>
                                  <td className="td text-xs text-slate-600">{subject.category}</td>
                                  <td className="td text-xs text-slate-600">{subject.credits ?? '—'}</td>
                                  <td className="td text-xs text-slate-600">{subject.semester}</td>
                                  <td className="td text-xs">
                                    <span className="text-slate-400">Not published</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <EmptyState
                            title="No subjects match your filters"
                            message="Adjust the semester, category or search term to see subjects."
                          />
                        </div>
                      )}

                      <div className="mt-6 border-t border-slate-200 pt-4">
                        <h3 className="text-sm font-bold text-slate-900">Academic Resources</h3>
                        {activeProgramme.resources?.length ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {activeProgramme.resources.map((resource) => (
                              <Link
                                key={resource.label}
                                to={resource.to}
                                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-blue-300 hover:text-[#0b3d91]"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon name="document" className="h-4 w-4" />
                                  {resource.label}
                                </span>
                                <Icon name="arrow" className="h-3.5 w-3.5" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-slate-500">Academic resource documents have not been published for this programme.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <EmptyState
                        title="Curriculum and syllabus not published"
                        message="The approved curriculum, regulation and syllabus documents will be published by the department."
                      />
                    </div>
                  )}
                </section>
              </div>
            )}

            {currentTab === 'association' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="Department Association" subtitle="Student-led technical and professional forum" />
                  {content.association ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{content.association.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{content.association.purpose}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 p-3">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Faculty Coordinator</p>
                          <p className="mt-0.5 text-sm text-slate-700">{content.association.coordinator || 'Not published'}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-3">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Academic Year</p>
                          <p className="mt-0.5 text-sm text-slate-700">{content.association.academicYear || 'Not published'}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-3">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Membership</p>
                          <p className="mt-0.5 text-sm text-slate-700">{content.association.membership || 'Not published'}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-3">
                          <p className="text-[11px] font-semibold uppercase text-slate-500">Student Office Bearers</p>
                          <p className="mt-0.5 text-sm text-slate-700">{content.association.bearers.length ? content.association.bearers.map((b) => `${b.role}: ${b.name}`).join(', ') : 'Not published'}</p>
                        </div>
                      </div>
                      {content.association.clubs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Student Technical Clubs</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {content.association.clubs.map((club) => (
                              <span key={club} className="rounded-md border border-blue-100 bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-[#0b3d91]">{club}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <EmptyState title="Association details not published" message="Association information will appear once confirmed by the department." />
                    </div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader title="Events & Activities" subtitle="Technical events, professional development and industrial exposure" />
                  {events.length ? (
                    <>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <select
                          value={eventCategory}
                          onChange={(event) => setEventCategory(event.target.value)}
                          aria-label="Filter events by category"
                          className="input sm:w-64"
                        >
                          {eventCategories.map((category) => (
                            <option key={category} value={category}>
                              {category === 'all' ? 'All categories' : category}
                            </option>
                          ))}
                        </select>
                        {eventYears.length > 1 && (
                          <select
                            value={eventYear}
                            onChange={(event) => setEventYear(event.target.value)}
                            aria-label="Filter events by academic year"
                            className="input sm:w-56"
                          >
                            {eventYears.map((year) => (
                              <option key={year} value={year}>
                                {year === 'all' ? 'All academic years' : year}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {filteredEvents.length ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {filteredEvents.map((event) => (
                            <div key={event.id} className="flex flex-col overflow-hidden rounded-lg border border-slate-200">
                              {event.image ? (
                                <img src={event.image} alt={event.title} className="h-36 w-full object-cover" />
                              ) : (
                                <ImagePlaceholder icon="calendar" label={event.category} />
                              )}
                              <div className="flex flex-1 flex-col p-4">
                                <span className="w-fit rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{event.category}</span>
                                <h3 className="mt-2 text-sm font-bold text-slate-900">{event.title}</h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{event.description}</p>
                                <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                                  <p className="flex items-center gap-1"><Icon name="calendar" className="h-3.5 w-3.5" /> {event.date || 'Date to be announced'}</p>
                                  <p className="flex items-center gap-1"><Icon name="pin" className="h-3.5 w-3.5" /> {event.venue || 'Venue to be announced'}</p>
                                </div>
                                <button type="button" onClick={() => setActiveEvent(event)} className="btn btn-secondary btn-sm mt-3 w-fit">
                                  View details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4">
                          <EmptyState title="No events match your filters" message="Try another category or academic year." />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-4">
                      <EmptyState title="No events published" message="Verified events and activities will appear here once published by the department." />
                    </div>
                  )}
                </section>

                <section className="card p-6">
                  <SectionHeader title="Student Achievements" subtitle="Verified competition, project and research achievements" />
                  {content.achievements.length ? (
                    <ul className="mt-4 space-y-3">
                      {content.achievements.map((achievement) => (
                        <li key={achievement.title} className="rounded-lg border border-slate-200 p-3">
                          <p className="text-sm font-semibold text-slate-900">{achievement.title}</p>
                          <p className="text-xs text-slate-600">{achievement.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-4">
                      <EmptyState title="No achievements published" message="Verified student achievements will be listed once approved." />
                    </div>
                  )}
                </section>
              </div>
            )}

            {currentTab === 'placements' && (
              <div className="space-y-6">
                {isDraft && <DraftNote />}

                <section className="card p-6">
                  <SectionHeader title="Placements & Records" subtitle="Verified department-level placement information" />

                  {placementData && activePlacement ? (
                    <>
                      {placementYears.length > 1 && (
                        <label className="mt-4 block max-w-xs text-xs font-semibold text-slate-600">
                          Academic Year
                          <select
                            value={activePlacement.year}
                            onChange={(event) => setPlacementYear(event.target.value)}
                            className="input mt-1"
                          >
                            {placementYears.map((year) => (
                              <option key={year.year} value={year.year}>{year.year}</option>
                            ))}
                          </select>
                        </label>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {activePlacement.eligible !== null && <StatTile label="Eligible Students" value={activePlacement.eligible} />}
                        {activePlacement.placed !== null && <StatTile label="Students Placed" value={activePlacement.placed} />}
                        {activePlacement.percentage && <StatTile label="Placement Percentage" value={activePlacement.percentage} />}
                        {activePlacement.recruiters !== null && <StatTile label="Recruiters" value={activePlacement.recruiters} />}
                        {activePlacement.internships !== null && <StatTile label="Internships" value={activePlacement.internships} />}
                        {activePlacement.highestPackage && <StatTile label="Highest Package" value={activePlacement.highestPackage} />}
                        {activePlacement.averagePackage && <StatTile label="Average Package" value={activePlacement.averagePackage} />}
                      </div>

                      {activePlacement.percentage && (
                        <div className="mt-5">
                          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                            <span>Placement rate</span>
                            <span>{activePlacement.percentage}</span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: activePlacement.percentage }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-slate-900">Recruiter Directory</h3>
                        {placementData.recruiters.length ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {placementData.recruiters.map((recruiter) => (
                              <div key={recruiter.name} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-[#0b3d91]">
                                  {recruiter.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{recruiter.name}</p>
                                  <p className="text-[11px] text-slate-500">{recruiter.industry || 'Recruitment partner'}{recruiter.year ? ` • ${recruiter.year}` : ''}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-slate-500">Recruiter information not published.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <EmptyState
                        title="Placement data not published"
                        message="Verified placement statistics will be published for the relevant academic year."
                      />
                    </div>
                  )}
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="card p-6">
                    <SectionHeader title="Student Achievements" subtitle="Approved placement and internship achievements" />
                    <div className="mt-4">
                      <EmptyState title="No achievements published" message="Student placement achievements will appear once approved and privacy-cleared." />
                    </div>
                  </section>

                  <section className="card p-6">
                    <SectionHeader title="Placement Reports" subtitle="Approved departmental reports and summaries" />
                    <div className="mt-4">
                      <EmptyState title="No reports published" message="Annual placement and internship reports will be linked here once approved." />
                    </div>
                  </section>
                </div>

                <section className="card p-6">
                  <SectionHeader title="Placement Preparation Resources" subtitle="Guidance and training support for students" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {content.preparationResources.map((resource) => (
                      <Link
                        key={resource.title}
                        to={resource.to}
                        className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-sm"
                      >
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Icon name="target" className="h-4 w-4 text-[#0b3d91]" />
                          {resource.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">{resource.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            )}

            <section id="faculty" className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-[#0b3d91] to-[#0a357f] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Faculty & Staff</h2>
                  <p className="mt-1 text-sm text-blue-100">Staff assigned to this department</p>
                </div>
                <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {facultyLoading ? 'Loading…' : `Total Faculty: ${facultyList.length}`}
                </span>
              </div>

              {facultyLoading && (
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 rounded-xl border border-slate-100 p-5 animate-pulse">
                      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-3 w-2/3 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!facultyLoading && facultyError && (
                <div className="p-6">
                  <EmptyState title="Could not load faculty" message="Please check your connection and try again." />
                </div>
              )}

              {!facultyLoading && !facultyError && facultyList.length === 0 && (
                <div className="p-6">
                  <EmptyState title="No faculty assigned" message="No faculty members are currently assigned to this department." />
                </div>
              )}

              {!facultyLoading && !facultyError && facultyList.length > 0 && (
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  {facultyList.map((fac) => (
                    <div key={fac.email} className="flex gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0b3d91] text-sm font-bold text-white">
                        {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-bold text-slate-900">{fac.name}</p>
                        <p className="text-sm font-semibold text-[#0b3d91]">{fac.designation || 'Faculty'}</p>
                        <p className="text-sm text-slate-500">
                          <a href={`mailto:${fac.email}`} className="hover:text-blue-600 hover:underline">
                            {fac.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <div className="card p-4">
              <h3 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                All Departments
              </h3>
              <div className="mt-3 flex flex-col gap-1 text-xs font-medium">
                {siteConfig.departments.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/departments/${d.slug}`}
                    className={`flex items-center justify-between rounded-md px-3 py-2 transition ${
                      d.slug === slug
                        ? 'bg-[#0b3d91] font-bold text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0b3d91]'
                    }`}
                  >
                    <span>{d.name}</span>
                    {d.accredited && (
                      <span className={`text-[9px] font-bold uppercase px-1 rounded ${
                        d.slug === slug ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Accredited
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-[#0b3d91] to-[#041e42] p-5 text-white shadow-md">
              <h3 className="text-base font-bold">Apply for Admission</h3>
              <p className="mt-1 text-xs text-blue-100 leading-relaxed">
                Admissions are open for B.E., B.Tech, M.E., and MBA programmes on a merit basis.
              </p>
              <Link
                to="/admission"
                className="mt-4 block w-full rounded-lg bg-amber-400 py-2 text-center text-xs font-bold text-slate-900 hover:bg-amber-300 transition"
              >
                Start Application &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(activeLab)}
        onClose={() => setActiveLab(null)}
        title={activeLab?.name ?? 'Laboratory'}
        size="lg"
        footer={
          <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setActiveLab(null)}>
            Close
          </button>
        }
      >
        {activeLab && (
          <div className="space-y-5">
            {activeLab.image ? (
              <img src={activeLab.image} alt={activeLab.name} className="h-48 w-full rounded-lg object-cover" />
            ) : (
              <ImagePlaceholder icon="flask" label={activeLab.category} />
            )}
            <div>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{activeLab.category}</span>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{activeLab.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Equipment</h4>
                {activeLab.equipment.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {activeLab.equipment.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0b3d91]" />{item}</li>)}
                  </ul>
                ) : <p className="mt-2 text-xs text-slate-500">Equipment list not published.</p>}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Experiments</h4>
                {activeLab.experiments.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {activeLab.experiments.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />{item}</li>)}
                  </ul>
                ) : <p className="mt-2 text-xs text-slate-500">Experiment list not published.</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Associated Courses</h4>
                {activeLab.courses.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {activeLab.courses.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : <p className="mt-2 text-xs text-slate-500">Course mapping not published.</p>}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Laboratory In-charge</h4>
                <p className="mt-2 text-sm text-slate-700">{activeLab.incharge || 'Not published'}</p>
                <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Safety</h4>
                <p className="mt-1 text-xs text-slate-600">{activeLab.safety}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Manuals & Documents</h4>
              {activeLab.resources.length ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {activeLab.resources.map((resource) => <li key={resource.label}><DocumentAction label={resource.label} to={resource.to} /></li>)}
                </ul>
              ) : <p className="mt-2 text-xs text-slate-500">Laboratory manuals have not been published.</p>}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(activeEvent)}
        onClose={() => setActiveEvent(null)}
        title={activeEvent?.title ?? 'Event'}
        size="lg"
        footer={
          <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setActiveEvent(null)}>
            Close
          </button>
        }
      >
        {activeEvent && (
          <div className="space-y-4">
            {activeEvent.image ? (
              <img src={activeEvent.image} alt={activeEvent.title} className="h-48 w-full rounded-lg object-cover" />
            ) : (
              <ImagePlaceholder icon="calendar" label={activeEvent.category} />
            )}
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">{activeEvent.category}</span>
            <p className="text-sm leading-relaxed text-slate-700">{activeEvent.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Date</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{activeEvent.date || 'To be announced'}</dd>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Venue</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{activeEvent.venue || 'To be announced'}</dd>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Organizer</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{activeEvent.organizer || 'Department'}</dd>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-[11px] font-semibold uppercase text-slate-500">Status</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{activeEvent.status || 'Not published'}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
