import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

// Base layout wrapper for public informational pages
function PublicPageLayout({ title, subtitle, breadcrumbs = [], subNav = [], children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b3d91] to-[#041e42] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <nav className="flex items-center gap-2 text-xs text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>/</span>
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white">{crumb.label}</Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-blue-100 max-w-2xl">{subtitle}</p>}
        </div>

        {/* Sub-navigation tabs (if any) */}
        {subNav.length > 0 && (
          <div className="border-t border-white/15 bg-[#072d6d]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex overflow-x-auto no-scrollbar gap-1 py-1 text-xs font-bold uppercase tracking-wide">
                {subNav.map((item) => {
                  const isActive =
                    location.pathname === item.to ||
                    (location.pathname === '/academics' && item.to === '/academics/regulations') ||
                    (location.pathname === '/accreditation' && item.to === '/accreditation/quality');
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`whitespace-nowrap rounded-md px-3.5 py-2 transition ${
                        isActive
                          ? 'bg-white text-[#0b3d91] font-extrabold shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page Body Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}

// ---------------- ABOUT PAGES ---------------- //
export function AboutPage({ section = 'about' }) {
  const subNav = [
    { label: 'About HIT', to: '/about' },
    { label: 'Objectives & Vision', to: '/about/objectives' },
    { label: 'Secretary Message', to: '/about/secretary-message' },
    { label: 'Governing Council', to: '/about/governing-council' },
    { label: 'Principal Profile', to: '/about/principal-profile' },
    { label: 'Statutory Committees', to: '/about/committees' },
  ];

  return (
    <PublicPageLayout
      title="About HIT"
      subtitle="Hogwarts Institute of Technology, Bengaluru — 75 Years of Academic Excellence"
      breadcrumbs={[{ label: 'About', to: '/about' }, { label: section.toUpperCase() }]}
      subNav={subNav}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {section === 'about' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">About HIT</h2>
              <p className="text-sm leading-relaxed text-slate-700">
                Hogwarts Institute of Technology is a leading private institute established in 1951 in Koramangala, Bengaluru. For more than seven decades, HIT has combined rigorous engineering education with research, innovation, and an unwavering commitment to student success.
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                HIT is recognised for its future-focused curriculum, internationally benchmarked teaching, and strong industry partnerships. Programmes across engineering, management, and the sciences are designed to prepare graduates for leadership in a rapidly changing world.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">1951</p>
                  <p className="text-xs text-slate-600">Established</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">QS 5★</p>
                  <p className="text-xs text-slate-600">Rated</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">40+</p>
                  <p className="text-xs text-slate-600">Global Partners</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">75 Years</p>
                  <p className="text-xs text-slate-600">of Excellence</p>
                </div>
              </div>
            </div>
          )}

          {section === 'objectives' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">Vision & Objectives</h2>
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="text-xs font-bold text-[#0b3d91] uppercase">Institutional Vision</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  To provide a wide range of academic and research opportunities and create ethically strong technical professionals with leadership capabilities.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900">Key Objectives</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  <li>Deliver quality engineering and management education conforming to global benchmarks.</li>
                  <li>Facilitate industry-driven R&D, innovation, and patent commercialization.</li>
                  <li>Cultivate entrepreneurial drive and lifelong learning mindsets among students.</li>
                </ul>
              </div>
            </div>
          )}

          {section === 'secretary-message' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">Secretary's Message</h2>
              <div className="rounded-lg bg-slate-50 p-4 border-l-4 border-[#0b3d91] italic text-sm text-slate-700">
                "Our vision has always been to empower students from all walks of life with quality technical education. HIT stands committed to nurturing disciplined innovators who will lead tomorrow's technology transformations."
              </div>
              <p className="text-xs font-bold text-slate-900 text-right">— Dr. S. D. Chandrasekar, Secretary</p>
            </div>
          )}

          {section === 'principal-profile' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">Principal's Profile</h2>
              <div className="flex gap-4 items-center">
                <div className="h-20 w-20 rounded-full bg-[#0b3d91] flex items-center justify-center text-white text-2xl font-bold">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dr. M. Jayaraman</h3>
                  <p className="text-xs text-[#0b3d91] font-semibold">Principal, HIT</p>
                  <p className="text-xs text-slate-500">Ph.D. in Mechanical Engineering • 30+ Years Academic & Administrative Experience</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pt-2">
                Dr. M. Jayaraman brings over three decades of distinguished leadership in higher technical education, research mentorship, and institution building.
              </p>
            </div>
          )}

          {(section === 'governing-council' || section === 'committees') && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">Governance & Academic Committees</h2>
              <p className="text-sm text-slate-700">
                HIT operates under governance councils comprising industry leaders, global university partners, and eminent academicians.
              </p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">Governing Council</p>
                  <p className="text-xs text-slate-600">Oversees strategic direction, budgets, and institutional policy.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">Academic Council</p>
                  <p className="text-xs text-slate-600">Approves academic regulations, curricula, and examination schemes.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">Board of Studies (BoS)</p>
                  <p className="text-xs text-slate-600">Formulates detailed syllabi across engineering disciplines.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Quick Navigation</h3>
            <ul className="mt-3 space-y-2 text-xs font-medium">
              {subNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="block rounded p-2 text-slate-700 hover:bg-blue-50 hover:text-[#0b3d91]">
                    {item.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- ADMISSION PAGES ---------------- //
export function AdmissionPage({ section = 'admission', courseSlug }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    mobile: '',
    email: '',
    examName: '',
    degree: 'B.E. Computer Science and Engineering',
    category: 'Merit-Based Admission',
    marks: '',
    message: '',
  });

  const subNav = [
    { label: 'Fees Structure', to: '/admission/fees-structure' },
    { label: 'Admission Procedure', to: '/admission/procedure' },
  ];

  const normSection = (section || 'ug').toLowerCase();
  const isFees = normSection === 'fees-structure' || normSection === 'fees' || normSection === 'fee-structure';
  const isProcedure = normSection === 'procedure' || normSection === 'admission-procedure';
  const isEnquiry = normSection === 'enquiry' || normSection === 'online-enquiry';
  const isUG = normSection === 'ug' || normSection === 'undergraduate' || normSection === 'admission' || normSection === 'programmes';
  const isPG = normSection === 'pg' || normSection === 'postgraduate';
  const isProgrammes = !isFees && !isProcedure && !isEnquiry && !isUG && !isPG;

  const ugProgrammes = [
    {
      slug: 'computer-science-and-engineering',
      name: 'Computer Science and Engineering',
      code: 'CSE',
      degree: 'B.E.',
      intake: 180,
      accredited: true,
      description: 'Build a strong foundation in algorithms, software engineering, distributed systems, and artificial intelligence while working in modern computing laboratories. The programme combines core computer science with industry internships and a final-year capstone project.',
    },
    {
      slug: 'information-technology',
      name: 'Information Technology',
      code: 'IT',
      degree: 'B.Tech',
      intake: 120,
      accredited: false,
      description: 'Focus on enterprise systems, cloud infrastructure, cybersecurity, and full-stack development. Students gain hands-on experience through industry-sponsored projects, live client work, and modern DevOps practices.',
    },
    {
      slug: 'artificial-intelligence-and-data-science',
      name: 'Artificial Intelligence and Data Science',
      code: 'AI & DS',
      degree: 'B.Tech',
      intake: 120,
      accredited: false,
      description: 'Learn machine learning, data engineering, statistical modelling, and generative AI. The curriculum includes applied projects with real-world datasets and access to high-performance GPU computing resources.',
    },
    {
      slug: 'artificial-intelligence-and-machine-learning',
      name: 'Artificial Intelligence and Machine Learning',
      code: 'AI & ML',
      degree: 'B.Tech',
      intake: 60,
      accredited: false,
      description: 'Develop expertise in deep learning, computer vision, natural language processing, and intelligent systems. Studio-based courses prepare students for AI product engineering, research, and responsible AI practice.',
    },
    {
      slug: 'electronics-and-communication-engineering',
      name: 'Electronics and Communication Engineering',
      code: 'ECE',
      degree: 'B.E.',
      intake: 180,
      accredited: true,
      description: 'Study embedded systems, VLSI, communication systems, and signal processing in advanced electronics laboratories. The programme blends circuit design with modern semiconductor, IoT, and wireless applications.',
    },
    {
      slug: 'electrical-and-electronics-engineering',
      name: 'Electrical and Electronics Engineering',
      code: 'EEE',
      degree: 'B.E.',
      intake: 120,
      accredited: false,
      description: 'Explore power systems, renewable energy, control engineering, and electric mobility. Students work on smart-grid and sustainable energy projects with guidance from industry mentors.',
    },
    {
      slug: 'mechanical-engineering',
      name: 'Mechanical Engineering',
      code: 'MECH',
      degree: 'B.E.',
      intake: 60,
      accredited: true,
      description: 'Combine design, thermodynamics, robotics, and advanced manufacturing in a project-led curriculum. Students gain practical experience with CAD, simulation, and precision engineering facilities.',
    },
    {
      slug: 'civil-engineering',
      name: 'Civil Engineering',
      code: 'CIVIL',
      degree: 'B.E.',
      intake: 60,
      accredited: false,
      description: 'Focus on sustainable infrastructure, structural engineering, transportation, and construction technology. Field studies and live projects connect classroom learning to real-world urban development.',
    },
    {
      slug: 'bio-medical-engineering',
      name: 'Bio-Medical Engineering',
      code: 'BME',
      degree: 'B.E.',
      intake: 60,
      accredited: true,
      description: 'Bridge engineering and healthcare through medical instrumentation, biomechanics, and diagnostic imaging. Students collaborate with hospitals and medtech partners on applied projects.',
    },
    {
      slug: 'medical-electronics',
      name: 'Medical Electronics',
      code: 'MDE',
      degree: 'B.E.',
      intake: 60,
      accredited: false,
      description: 'Specialise in medical electronics, embedded health devices, and clinical signal processing. The programme prepares engineers for the fast-growing healthcare technology sector.',
    },
  ];

  const pgProgrammes = [
    {
      slug: 'me-computer-science-and-engineering',
      name: 'Computer Science and Engineering',
      code: 'M.E. CSE',
      degree: 'M.E.',
      intake: 18,
      eligibility: 'B.E. / B.Tech in CSE / IT / Software Engineering + GATE / GRE',
      description: 'Advance your expertise in distributed computing, machine learning, and secure software systems. The programme includes research seminars, a supervised dissertation, and industry collaboration.',
    },
    {
      slug: 'me-applied-electronics',
      name: 'Applied Electronics',
      code: 'M.E. AE',
      degree: 'M.E.',
      intake: 18,
      eligibility: 'B.E. / B.Tech in ECE / EEE / E&I + GATE / GRE',
      description: 'Deepen your knowledge of embedded systems, VLSI, communication, and electronic product design. Laboratory-intensive courses support advanced research and industry projects.',
    },
    {
      slug: 'me-vlsi-design',
      name: 'VLSI Design',
      code: 'M.E. VLSI',
      degree: 'M.E.',
      intake: 18,
      eligibility: 'B.E. / B.Tech in ECE / EEE / CSE / IT / E&I + GATE / GRE',
      description: 'Specialise in digital and analog VLSI design, verification, low-power circuits, and chip architecture. Students work with industry-standard EDA tools and fabrication-aware design flows.',
    },
    {
      slug: 'master-of-business-administration',
      name: 'Master of Business Administration',
      code: 'MBA',
      degree: 'MBA',
      intake: 60,
      eligibility: "Bachelor's degree with minimum 50% + CAT / MAT / GMAT",
      description: 'Develop leadership, strategy, finance, marketing, and operations expertise through case-based learning. Industry internships, live consulting projects, and a global immersion prepare you for modern business roles.',
    },
  ];

  const allCourses = [
    ...ugProgrammes.map((course) => ({
      ...course,
      level: 'UG',
      levelPath: 'ug',
      duration: '4 Years',
      eligibility:
        course.eligibility ||
        'Completed 10+2, A-Levels, IB, or an equivalent qualification with Mathematics, Physics, and Chemistry, and a minimum aggregate of 60%.',
    })),
    ...pgProgrammes.map((course) => ({
      ...course,
      level: 'PG',
      levelPath: 'pg',
      duration: '2 Years',
    })),
  ];

  const selectedCourse = courseSlug
    ? allCourses.find((course) => course.slug === courseSlug)
    : null;

  const activeSectionTitle = selectedCourse
    ? selectedCourse.name
    : isFees
    ? 'Fees Structure'
    : isProcedure
    ? 'Admission Procedure'
    : isEnquiry
    ? 'Application Form'
    : isUG
    ? 'UG Programmes'
    : isPG
    ? 'PG Programmes'
    : 'Programmes Offered';

  const courseHighlights = selectedCourse
    ? [
        `${selectedCourse.degree} curriculum aligned with current industry practice`,
        'Experiential learning through laboratories, live projects, and internships',
        selectedCourse.level === 'UG'
          ? 'Flexible credit framework with industry-aligned electives'
          : 'Research seminars and a supervised dissertation',
        'Dedicated placement, mentoring, and career development support',
      ]
    : [];

  return (
    <PublicPageLayout
      title={selectedCourse ? selectedCourse.name : 'Admissions 2026 - 2027'}
      subtitle={
        selectedCourse
          ? `${selectedCourse.degree} · ${selectedCourse.duration} · Full-time · Bengaluru`
          : 'Hogwarts Institute of Technology, Bengaluru — Merit-Based Admissions'
      }
      breadcrumbs={
        selectedCourse
          ? [
              { label: 'Admission', to: '/admission' },
              {
                label: selectedCourse.level === 'UG' ? 'UG Programmes' : 'PG Programmes',
                to: `/admission/${selectedCourse.levelPath}`,
              },
              { label: selectedCourse.name },
            ]
          : [{ label: 'Admission', to: '/admission' }, { label: activeSectionTitle }]
      }
      subNav={selectedCourse ? [] : subNav}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          {selectedCourse && (
            <div className="card overflow-hidden border-t-4 border-t-[#0b3d91]">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-white to-white p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[#0b3d91]">{selectedCourse.level} Programme</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{selectedCourse.code}</span>
                  {selectedCourse.accredited && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700">Accredited</span>
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-bold text-[#0b3d91]">
                  {selectedCourse.degree} {selectedCourse.name}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {selectedCourse.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a
                    href="#course-application"
                    className="inline-flex items-center rounded-md bg-[#0b3d91] px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                  >
                    Apply now
                  </a>
                  <Link
                    to={`/admission/${selectedCourse.levelPath}`}
                    className="text-xs font-semibold text-slate-600 hover:text-[#0b3d91]"
                  >
                    Back to {selectedCourse.level} programmes
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-3">
                {[
                  ['Duration', selectedCourse.duration, 'border-blue-200 bg-blue-50/50', 'text-[#0b3d91]'],
                  ['Sanctioned intake', `${selectedCourse.intake} seats`, 'border-teal-200 bg-teal-50/50', 'text-teal-700'],
                  ['Mode', 'Full-time', 'border-amber-200 bg-amber-50/50', 'text-amber-700'],
                ].map(([label, value, boxClass, valueClass]) => (
                  <div key={label} className={`rounded-lg border p-4 ${boxClass}`}>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
                    <p className={`mt-1 text-sm font-semibold ${valueClass}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 p-6">
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-1 rounded-full bg-[#0b3d91]" />
                  <h3 className="text-sm font-semibold text-slate-900">Programme highlights</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {courseHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0b3d91]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  <strong className="font-semibold text-slate-900">Eligibility:</strong> {selectedCourse.eligibility}
                </p>
              </div>
            </div>
          )}

          {/* 1. PROGRAMMES OFFERED */}
          {(isProgrammes || isUG || isPG) && !selectedCourse && (
            <div className="space-y-6">
              {/* Admissions at a glance */}
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
                {[
                  ['10', 'Undergraduate programmes', 'B.E. / B.Tech · 4 years', 'text-emerald-700'],
                  ['4', 'Postgraduate programmes', 'M.E. / MBA · 2 years', 'text-blue-800'],
                  ['980', 'Sanctioned seats', 'Across all programmes', 'text-amber-700'],
                  ['100%', 'Merit-based', 'No donation or capitation', 'text-slate-700'],
                ].map(([value, label, detail, valueClass]) => (
                  <div key={label} className="bg-white p-5">
                    <p className={`text-2xl font-semibold tracking-tight sm:text-3xl ${valueClass}`}>{value}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Undergraduate programmes */}
              {!isPG && (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Undergraduate</p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      B.E. / B.Tech programmes
                    </h2>
                    <p className="mt-1 text-sm text-emerald-100">Ten industry-aligned programmes · 4 years · Full-time</p>
                  </div>
                  <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    Academic year 2026–27
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {ugProgrammes.map((dept, index) => (
                    <Link
                      key={dept.code}
                      to={`/admission/ug/${dept.slug}`}
                      className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-emerald-50/60 sm:grid sm:grid-cols-[2.5rem_1fr_4.5rem_2.25rem] sm:items-center sm:gap-4 sm:px-6"
                    >
                      <span className="hidden font-mono text-sm text-slate-300 transition group-hover:text-emerald-600 sm:block">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h3 className="text-base font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-800">
                            {dept.name}
                          </h3>
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                            {dept.code}
                          </span>
                          {dept.accredited && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Accredited
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{dept.degree} · 4 years · Full-time</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:hidden">Intake</span>
                        <span className="text-lg font-semibold text-slate-900">{dept.intake}</span>
                      </div>
                      <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white sm:flex">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm leading-relaxed text-slate-600">
                  <strong className="font-semibold text-slate-900">Eligibility:</strong> completed 10+2, A-Levels, IB, or an equivalent qualification with Mathematics, Physics, and Chemistry, and a minimum aggregate of 60%.
                </div>
              </section>
              )}

              {/* Postgraduate programmes */}
              {!isUG && (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 bg-gradient-to-r from-[#0b3d91] to-[#0a357f] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Postgraduate</p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      M.E. / MBA programmes
                    </h2>
                    <p className="mt-1 text-sm text-blue-100">Advanced specialist programmes · 2 years · Full-time</p>
                  </div>
                  <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    GATE / GRE / GMAT
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {pgProgrammes.map((p, index) => (
                    <Link
                      key={p.code}
                      to={`/admission/pg/${p.slug}`}
                      className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-blue-50/60 sm:grid sm:grid-cols-[2.5rem_1fr_4.5rem_2.25rem] sm:items-center sm:gap-4 sm:px-6"
                    >
                      <span className="hidden font-mono text-sm text-slate-300 transition group-hover:text-blue-700 sm:block">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h3 className="text-base font-semibold leading-snug text-slate-900 transition group-hover:text-[#0b3d91]">
                            {p.name}
                          </h3>
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0b3d91]">
                            {p.code}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">{p.degree}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{p.duration ?? '2 years'} · Full-time</p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{p.eligibility}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:hidden">Intake</span>
                        <span className="text-lg font-semibold text-slate-900">{p.intake}</span>
                      </div>
                      <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-[#0b3d91] group-hover:bg-[#0b3d91] group-hover:text-white sm:flex">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
              )}
            </div>
          )}

          {/* 2. FEES STRUCTURE */}
          {isFees && (
            <div className="space-y-6">
              <div className="card border-l-4 border-l-[#0b3d91] p-6">
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-1 rounded-full bg-[#0b3d91]" />
                  <h2 className="text-lg font-semibold text-[#0b3d91]">Fee structure 2026–27</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Fees are approved by the HIT Finance Committee and published transparently. No donation or additional admission fee is collected. Scholarships and payment plans are available for eligible students.
                </p>
              </div>

              {/* Annual Tuition & Academic Fees Table */}
              <div className="card border-t-4 border-t-[#0b3d91] p-6 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-semibold text-slate-900">Annual academic and tuition fees</h3>
                  <p className="mt-1 text-sm text-slate-500">Merit-based admissions · per annum</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-blue-100 bg-blue-50/70 text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                      <tr>
                        <th className="p-4">Programme / level</th>
                        <th className="p-4">Tuition</th>
                        <th className="p-4">Lab & amenities</th>
                        <th className="p-4 text-right">Total per year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="transition hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-medium text-slate-900">B.E. / B.Tech (all branches)</span>
                          <p className="mt-0.5 text-xs text-slate-500">CSE, IT, AI & DS, AI & ML, ECE, EEE, MECH, CIVIL, BME, MDE</p>
                        </td>
                        <td className="p-4 text-slate-700">₹1,50,000</td>
                        <td className="p-4 text-slate-700">₹25,000</td>
                        <td className="p-4 text-right text-base font-semibold text-[#0b3d91]">₹1,75,000</td>
                      </tr>
                      <tr className="transition hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-medium text-slate-900">M.E. programmes</span>
                          <p className="mt-0.5 text-xs text-slate-500">CSE, Applied Electronics, VLSI Design</p>
                        </td>
                        <td className="p-4 text-slate-700">₹1,20,000</td>
                        <td className="p-4 text-slate-700">₹20,000</td>
                        <td className="p-4 text-right text-base font-semibold text-[#0b3d91]">₹1,40,000</td>
                      </tr>
                      <tr className="transition hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-medium text-slate-900">MBA</span>
                          <p className="mt-0.5 text-xs text-slate-500">2-year full-time programme</p>
                        </td>
                        <td className="p-4 text-slate-700">₹1,80,000</td>
                        <td className="p-4 text-slate-700">₹20,000</td>
                        <td className="p-4 text-right text-base font-semibold text-[#0b3d91]">₹2,00,000</td>
                      </tr>
                      <tr className="transition hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-medium text-slate-900">Ph.D. / research programmes</span>
                          <p className="mt-0.5 text-xs text-slate-500">Full-time and part-time doctoral study</p>
                        </td>
                        <td className="p-4 text-slate-700">₹90,000</td>
                        <td className="p-4 text-slate-700">₹15,000</td>
                        <td className="p-4 text-right text-base font-semibold text-[#0b3d91]">₹1,05,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500">
                  International applicants should contact the Admissions Office for fee equivalence and scholarship options.
                </p>
              </div>

              {/* Optional Services */}
              <div className="card border-t-4 border-t-teal-600 p-6 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 rounded-full bg-teal-600" />
                    <h3 className="text-xl font-semibold text-teal-800">Optional services</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Residence, dining, and campus transport are charged separately.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-teal-700">Residence &amp; dining</h4>
                    <dl className="mt-4 space-y-3 text-sm">
                      {[
                        ['Room, amenities & utilities', '₹90,000 / year'],
                        ['Dining charges', '₹60,000 / year'],
                        ['Refundable caution deposit', '₹10,000'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                          <dt className="text-slate-600">{label}</dt>
                          <dd className="font-medium text-slate-900">{value}</dd>
                        </div>
                      ))}
                      <div className="flex justify-between gap-4 rounded-lg bg-teal-50/70 px-3 py-2.5">
                        <dt className="font-semibold text-teal-800">Total</dt>
                        <dd className="font-semibold text-teal-800">₹1,60,000 / year</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-teal-700">Campus shuttle</h4>
                    <dl className="mt-4 space-y-3 text-sm">
                      {[
                        ['Zone A — Koramangala, Indiranagar, Domlur', '₹18,000 / year'],
                        ['Zone B — Whitefield, Marathahalli, HSR', '₹24,000 / year'],
                        ['Zone C — Electronic City, Jayanagar, Hebbal', '₹30,000 / year'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                          <dt className="text-slate-600">{label}</dt>
                          <dd className="font-medium text-slate-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              {/* Scholarships & Financial Aid */}
              <div className="card border-t-4 border-t-amber-500 p-6 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 rounded-full bg-amber-500" />
                    <h3 className="text-xl font-semibold text-amber-800">Scholarships and financial aid</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Merit, access, and talent-based awards.</p>
                </div>

                <ul className="divide-y divide-slate-100">
                  {[
                    ['HIT Merit Scholarship', 'Up to 50% tuition waiver for outstanding academic records.', '50% tuition'],
                    ['HIT Access Scholarship', 'Need-based support for first-generation and low-income students.', 'Up to 100% tuition'],
                    ['Women in STEM Award', 'For exceptional women entering engineering and applied science.', '30% tuition'],
                    ['Sports & Exchange Awards', 'For national-level athletes, plus travel bursaries for exchange.', 'Up to 50%'],
                  ].map(([name, description, award]) => (
                    <li key={name} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div>
                        <p className="text-base font-medium text-slate-900">{name}</p>
                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{award}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* 3. ADMISSION PROCEDURE */}
          {isProcedure && (
            <div className="space-y-6">
              {/* Application & Selection Procedure Card */}
              <div className="card border-t-4 border-t-[#0b3d91] p-6 space-y-5">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-1 rounded-full bg-[#0b3d91]" />
                    <h2 className="text-xl font-semibold text-[#0b3d91]">
                      Application and selection procedure
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Merit-based admission · 2026–27 cycle</p>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  Admission is merit-based and holistic. Submit an online application, upload your documents, and complete an interview with the admissions committee.
                </p>

                {/* Steps List */}
                <ol className="space-y-5 pt-2">
                  {[
                    {
                      step: '01',
                      title: 'Online application',
                      desc: 'Create a profile on the HIT admissions portal, select your programme, and complete the application form.',
                    },
                    {
                      step: '02',
                      title: 'Document upload',
                      desc: 'Upload Class 10 and 12 transcripts, a government-issued photo ID, entrance scores, and a personal statement.',
                    },
                    {
                      step: '03',
                      title: 'Entrance score and interview',
                      desc: 'Submit a valid SAT, GATE, GRE, CAT, or MAT score, or take the HIT Entrance Assessment, and attend an interview.',
                    },
                    {
                      step: '04',
                      title: 'Offer and confirmation',
                      desc: 'The committee reviews your application and releases a provisional offer. Accept it and pay the confirmation deposit.',
                    },
                    {
                      step: '05',
                      title: 'Enrolment and orientation',
                      desc: 'Complete enrolment at the Bengaluru campus and join the orientation programme before classes begin.',
                    },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-[#0b3d91]">
                        {item.step}
                      </span>
                      <div className="pt-0.5">
                        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Minimum Eligibility Criteria Card */}
              <div className="card border-t-4 border-t-teal-600 p-6 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 rounded-full bg-teal-600" />
                    <h3 className="text-xl font-semibold text-teal-800">Minimum eligibility</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Requirements vary by entry pathway.</p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-teal-100 bg-teal-50/70 text-xs font-semibold uppercase tracking-wide text-teal-800">
                      <tr>
                        <th className="p-4">Entry pathway</th>
                        <th className="p-4">Minimum aggregate</th>
                        <th className="p-4">Subjects / requirements</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        ['Undergraduate (standard entry)', '60%', 'Mathematics, Physics & Chemistry'],
                        ['Undergraduate (honours pathway)', '75%', 'Mathematics, Physics & Chemistry + interview'],
                        ['International applicants', 'IB / A-Levels equivalent', 'Mathematics and two science subjects'],
                        ['Lateral entry', '60%', 'Diploma in Engineering / B.Sc. with Mathematics'],
                      ].map(([pathway, aggregate, requirements]) => (
                        <tr key={pathway} className="transition hover:bg-teal-50/40">
                          <td className="p-4 font-medium text-slate-900">{pathway}</td>
                          <td className="p-4 font-semibold text-teal-700">{aggregate}</td>
                          <td className="p-4 text-slate-500">{requirements}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                  Diploma holders and B.Sc. graduates with Mathematics may apply for lateral entry to the second year (third semester) of B.E. / B.Tech programmes.
                </p>
              </div>

              {/* Mandatory Documents Checklist */}
              <div className="card border-t-4 border-t-amber-500 p-6 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 rounded-full bg-amber-500" />
                    <h3 className="text-xl font-semibold text-amber-800">Documents required</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Bring originals along with two sets of self-attested photocopies.</p>
                </div>

                <ul className="grid gap-x-6 gap-y-3 text-sm text-slate-600 sm:grid-cols-2">
                  {[
                    'Class 10 marksheet / transcript',
                    'Class 12 marksheet / transcript (or predicted grades)',
                    'Transfer / leaving certificate',
                    'Government-issued photo ID',
                    'Entrance examination scorecard',
                    'Statement of purpose and CV',
                    'Scholarship or category documents (if applicable)',
                    'Migration / equivalence certificate (if applicable)',
                    'Medical fitness certificate',
                    'Six recent passport-size photographs',
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 4. APPLICATION / REGISTRATION FORM */}
          {(isEnquiry || selectedCourse) && (
            <div id={selectedCourse ? 'course-application' : undefined} className="card border-t-4 border-t-[#0b3d91] p-6 lg:p-8">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-1 rounded-full bg-[#0b3d91]" />
                  <h2 className="text-xl font-semibold text-[#0b3d91]">
                    {selectedCourse
                      ? `Apply for ${selectedCourse.degree} ${selectedCourse.name}`
                      : 'Online application 2026–27'}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCourse
                    ? 'Complete the form to register your application for this programme.'
                    : 'Complete the form and our admissions team will contact you with the next steps.'}
                </p>
              </div>

              {formSubmitted ? (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
                    ✓
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-emerald-900">Application submitted</h3>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-emerald-700">
                    Thank you for applying to Hogwarts Institute of Technology. Our admissions team will review your application and contact you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          name: '',
                          dateOfBirth: '',
                          mobile: '',
                          email: '',
                          examName: '',
                          degree: 'B.E. Computer Science and Engineering',
                          category: 'Merit-Based Admission',
                          marks: '',
                          message: '',
                        });
                      }}
                      className="btn btn-secondary btn-sm font-bold"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  className="mt-6 space-y-5 [&_.input]:py-3 [&_.input]:text-base [&_.label]:mb-1.5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label">Applicant Full Name *</label>
                      <input
                        className="input"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Date of Birth *</label>
                      <input
                        className="input"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input
                        className="input"
                        type="tel"
                        required
                        placeholder="+91 98450 12345"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input
                        className="input"
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Qualifying Examination *</label>
                      <input
                        className="input"
                        type="text"
                        required
                        placeholder="e.g. CBSE Class 12 / Diploma / B.E."
                        value={formData.examName}
                        onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Qualifying Score / Percentage *</label>
                      <input
                        className="input"
                        type="text"
                        required
                        placeholder="e.g. 92%"
                        value={formData.marks}
                        onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Preferred Programme *</label>
                      {selectedCourse ? (
                        <input
                          className="input bg-slate-50 font-semibold text-slate-700"
                          value={`${selectedCourse.degree} ${selectedCourse.name}`}
                          readOnly
                        />
                      ) : (
                        <select
                          className="input"
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        >
                          <option>B.E. Computer Science and Engineering</option>
                          <option>B.Tech Information Technology</option>
                          <option>B.Tech Artificial Intelligence and Data Science</option>
                          <option>B.Tech Artificial Intelligence and Machine Learning</option>
                          <option>B.E. Electronics and Communication Engineering</option>
                          <option>B.E. Electrical and Electronics Engineering</option>
                          <option>B.E. Mechanical Engineering</option>
                          <option>B.E. Civil Engineering</option>
                          <option>B.E. Bio-Medical Engineering</option>
                          <option>B.E. Medical Electronics</option>
                          <option>M.E. Computer Science and Engineering</option>
                          <option>M.E. Applied Electronics</option>
                          <option>M.E. VLSI Design</option>
                          <option>MBA (Master of Business Administration)</option>
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="label">Admission Category *</label>
                      <select
                        className="input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Merit-Based Admission</option>
                        <option>Lateral Entry (Direct 2nd Year)</option>
                        <option>Sports / Special Talent</option>
                        <option>International Applicant</option>
                        <option>Postgraduate (M.E. / MBA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Statement of Purpose (Optional)</label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Briefly describe your academic interests and why you want to join this programme..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-900"
                    />
                    <span>
                      I confirm that the information provided is accurate and I agree to the admission terms and conditions.
                    </span>
                  </label>

                  <button type="submit" className="btn btn-primary bg-[#0b3d91] px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-800">
                    Submit application
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#0b3d91] via-[#0a357f] to-[#062a63] p-7 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Admissions open</p>
            <p className="mt-2 text-3xl font-semibold text-amber-300">2026–27</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              Applications are reviewed on a rolling basis. Apply early to secure your preferred programme and scholarship consideration.
            </p>
            <Link
              to="/admission/enquiry"
              className="mt-5 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#0b3d91] transition hover:bg-blue-50"
            >
              Start application
            </Link>
          </div>

          {selectedCourse && (
            <div className="card border-t-4 border-t-teal-600 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Admission resources</p>
              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {subNav.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center justify-between py-3 text-slate-600 transition hover:text-teal-700"
                    >
                      <span>{item.label}</span>
                      <span className="text-teal-600">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card border-t-4 border-t-amber-500 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Admission help desk</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm text-slate-500">Phone</dt>
                <dd className="mt-0.5 text-base font-medium text-slate-900">{siteConfig.contact.phone}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Helpline / WhatsApp</dt>
                <dd className="mt-0.5 text-base font-medium text-slate-900">+91 80 4718 2300</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Email</dt>
                <dd className="mt-0.5 break-all text-base font-medium text-slate-900">{siteConfig.contact.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Office hours</dt>
                <dd className="mt-0.5 text-base font-medium text-slate-900">{siteConfig.contact.officeHours}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- DEPARTMENTS OVERVIEW PAGE ---------------- //
export function DepartmentsPage() {
  return (
    <PublicPageLayout
      title="Academic Departments"
      subtitle="Explore our 12 Engineering, Management, and Science Departments"
      breadcrumbs={[{ label: 'Departments' }]}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.departments.map((dept) => (
          <Link
            key={dept.slug}
            to={`/departments/${dept.slug}`}
            className="group card p-5 transition hover:-translate-y-1 hover:border-[#0b3d91] hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-extrabold text-[#0b3d91]">
                {dept.code}
              </span>
              {dept.accredited && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
                  Accredited
                </span>
              )}
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 group-hover:text-[#0b3d91] transition">
              {dept.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {dept.category} • B.E. / B.Tech • 4 Years
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#0b3d91]">
              <span>Explore Department</span>
              <span>&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// ---------------- FACULTY PAGE ---------------- //
export function FacultyPage() {
  return (
    <PublicPageLayout
      title="Faculty Details"
      subtitle="Our distinguished professors, researchers, and mentors committed to student excellence"
      breadcrumbs={[{ label: 'Faculty Details' }]}
    >
      <div className="card p-6">
        <h2 className="text-xl font-bold text-[#0b3d91]">Faculty Directory</h2>
        <p className="mt-1 text-xs text-slate-500">
          HIT has over 350 full-time faculty members and researchers across engineering, management, and the sciences.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Dr. M. Jayaraman', dept: 'Mechanical Engineering', role: 'Principal & Professor', qual: 'Ph.D.' },
            { name: 'Dr. S. Jabeen Begum', dept: 'Computer Science & Engg', role: 'Professor & HOD', qual: 'Ph.D.' },
            { name: 'Dr. M. Nisha Angeline', dept: 'Electronics & Comm Engg', role: 'Professor & HOD', qual: 'Ph.D.' },
            { name: 'Dr. P. Murugesan', dept: 'Information Technology', role: 'Professor & HOD', qual: 'Ph.D.' },
            { name: 'Dr. S. Russia', dept: 'Computer Science & Engg', role: 'Professor', qual: 'Ph.D.' },
            { name: 'Dr. K. S. Kausalya Devi', dept: 'Electronics & Comm Engg', role: 'Professor', qual: 'Ph.D.' },
          ].map((fac, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 p-4 shadow-xs">
              <p className="text-sm font-bold text-slate-900">{fac.name}</p>
              <p className="text-xs font-semibold text-[#0b3d91]">{fac.role}</p>
              <p className="text-xs text-slate-600">{fac.dept}</p>
              <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {fac.qual}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- ACADEMICS PAGE ---------------- //
export function AcademicsPage({ section = 'academics' }) {
  const subNav = [
    { label: 'Academic Regulations', to: '/academics/regulations' },
    { label: 'Curriculum & Credit Framework', to: '/academics/curriculum' },
    { label: 'Syllabus Scheme', to: '/academics/syllabus' },
    { label: 'Flexible Credit Framework', to: '/academics/cbcs' },
    { label: 'Examinations Office', to: '/academics/coe' },
    { label: 'Exam Timetable', to: '/academics/timetable' },
  ];

  const academicTitles = {
    academics: 'Academic Regulations',
    regulations: 'Academic Regulations',
    curriculum: 'Curriculum & Credit Framework',
    syllabus: 'Syllabus Scheme',
    cbcs: 'Flexible Credit Framework',
    coe: 'Examinations Office',
    timetable: 'Exam Timetable',
  };

  const norm = (section || 'academics').toLowerCase();

  return (
    <PublicPageLayout
      title="Academics"
      subtitle="Future-Focused Curriculum, Flexible Credit Framework, and Academic Regulations"
      breadcrumbs={[{ label: 'Academics', to: '/academics' }, { label: academicTitles[norm] || 'Regulations' }]}
      subNav={subNav}
    >
      <div className="space-y-6">
        {(norm === 'academics' || norm === 'regulations') && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 text-[#0b3d91] font-bold px-2.5 py-0.5 text-xs">Academic Framework 2026</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Academic Regulations</h2>
              <p className="text-xs text-slate-500">Approved by the HIT Academic Council</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Hogwarts Institute of Technology implements a credit-based academic framework aligned with international engineering education benchmarks, with continuous assessment and flexible elective pathways.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="font-bold text-[#0b3d91]">Credit Requirement</p>
                <p className="text-xs text-slate-600 mt-1">165 total credits required for successful award of 4-Year B.E. / B.Tech Degree.</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="font-bold text-[#0b3d91]">10-Point Grading</p>
                <p className="text-xs text-slate-600 mt-1">Letter grades: Outstanding (O: 10), A+ (9), A (8), B+ (7), B (6), C (5), Re-appear (U).</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="font-bold text-[#0b3d91]">Attendance Policy</p>
                <p className="text-xs text-slate-600 mt-1">Minimum 75% overall attendance mandatory to qualify for End Semester Examinations.</p>
              </div>
            </div>
          </div>
        )}

        {norm === 'curriculum' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 text-[#0b3d91] font-bold px-2.5 py-0.5 text-xs">Curriculum Design</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Curriculum & Credit Framework</h2>
              <p className="text-xs text-slate-500">Industry-aligned, outcome-based education framework</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              The curriculum incorporates industry requirements through active collaboration with technical experts, alumni, and industry advisory boards.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">Humanities, Sciences & Mathematics (HSMC & BSC)</p>
                <p className="text-slate-600 mt-1">Foundational mathematics, physics, communication, and professional ethics.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">Professional Core & Laboratories (PCC)</p>
                <p className="text-slate-600 mt-1">In-depth departmental discipline subjects coupled with hands-on practical lab courses.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">Professional Elective Verticals (PEC)</p>
                <p className="text-slate-600 mt-1">Specialization tracks allowing students to build expertise in niche sub-domains.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">Mandatory Industry Internship & Project Work</p>
                <p className="text-slate-600 mt-1">Minimum 4-6 weeks industrial training, mini-project, and final semester capstone project.</p>
              </div>
            </div>
          </div>
        )}

        {norm === 'syllabus' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#0b3d91]">Syllabus Scheme (2026 Framework)</h2>
              <p className="text-xs text-slate-500">Board of Studies approved syllabus for all semesters</p>
            </div>
            <p className="text-sm text-slate-700">
              Each academic department maintains a dedicated Board of Studies consisting of university nominees, corporate leaders, and faculty members who continuously revamp syllabus contents.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 pt-2 text-xs">
              {['Semester I & II (Common First Year)', 'Semester III (Core Fundamentals)', 'Semester IV (Advanced Principles)', 'Semester V (Professional Electives I & II)', 'Semester VI (Open Electives & Mini Project)', 'Semester VII & VIII (Industry Internship & Major Project)'].map((sem, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="font-semibold text-slate-800">{sem}</span>
                  <span className="text-[#0b3d91] font-bold">Approved</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {norm === 'cbcs' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-xs">Flexible Credit Framework</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Flexible Credit Framework</h2>
              <p className="text-xs text-slate-500">Academic flexibility for multi-disciplinary learning</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              The flexible credit framework allows students to tailor their learning paths by selecting open electives from other engineering branches and earning Honours degrees or Minors in emerging disciplines such as AI, IoT, and Cyber Security.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <p className="font-bold text-emerald-900 text-sm">Open Electives</p>
                <p className="text-emerald-700 mt-1">Study interdisciplinary courses offered by management and other engineering departments.</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs">
                <p className="font-bold text-blue-900 text-sm">Honours & Minors</p>
                <p className="text-blue-700 mt-1">Earn additional 18-20 credits to receive an Honours degree or Minor specialization degree.</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-xs">
                <p className="font-bold text-purple-900 text-sm">Global MOOC Platforms</p>
                <p className="text-purple-700 mt-1">Credit transfer for approved certifications completed on Coursera, edX, and other recognised platforms.</p>
              </div>
            </div>
          </div>
        )}

        {norm === 'coe' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 text-[#0b3d91] font-bold px-2.5 py-0.5 text-xs">Assessment & Results</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Examinations Office</h2>
              <p className="text-xs text-slate-500">Continuous assessment, central evaluation, and results publication</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              The Examinations Office conducts continuous internal assessments (CIA) and End Semester Examinations (ESE) in a confidential, fair, and transparent academic environment.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">Continuous Internal Assessment (CIA)</p>
                <p className="text-slate-600 mt-1">40% weightage evaluated through periodic tests, assignments, and practical assessment.</p>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">End Semester Examination (ESE)</p>
                <p className="text-slate-600 mt-1">60% weightage evaluated via centralized evaluation camps with external examiners.</p>
              </div>
            </div>
          </div>
        )}

        {norm === 'timetable' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#0b3d91]">Examination Timetable</h2>
              <p className="text-xs text-slate-500">End Semester Theory & Practical Examination Schedules</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 text-xs text-slate-700">
              <p className="font-bold text-[#0b3d91] text-sm">November / December 2026 End Semester Examinations</p>
              <p className="mt-1">Timetables and hall ticket issuance schedules are released by the Controller of Examinations. Students can download digital hall tickets from the student portal.</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
              <p className="font-bold text-slate-800">Exam Instructions for Candidates:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Candidates must be in the examination hall 15 minutes before commencement.</li>
                <li>Hall ticket and valid college ID card are mandatory for entry.</li>
                <li>Programmable calculators and electronic gadgets are strictly prohibited.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}

// ---------------- ACCREDITATION PAGE ---------------- //
export function AccreditationPage({ section = 'accreditation' }) {
  const subNav = [
    { label: 'QS 5-Star Rating', to: '/accreditation/quality' },
    { label: 'Programme Recognition', to: '/accreditation/programmes' },
    { label: 'Quality Assurance', to: '/accreditation/iqac' },
    { label: 'Global Partnerships', to: '/accreditation/partnerships' },
  ];

  const accredTitles = {
    accreditation: 'QS 5-Star Rating',
    quality: 'QS 5-Star Rating',
    programmes: 'Programme Recognition',
    iqac: 'Quality Assurance',
    partnerships: 'Global Partnerships',
  };

  const norm = (section || 'accreditation').toLowerCase();

  return (
    <PublicPageLayout
      title="Accreditation & Recognition"
      subtitle="Independent quality assurance, professional recognition, and global academic partnerships"
      breadcrumbs={[{ label: 'Accreditation', to: '/accreditation' }, { label: accredTitles[norm] || 'Accreditations' }]}
      subNav={subNav}
    >
      <div className="space-y-6">
        {(norm === 'accreditation' || norm === 'quality') && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="rounded bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">QS 5-Star Rated</span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">QS Stars Rating</h2>
              </div>
              <span className="text-xl font-black text-amber-600">Overall 5 Stars</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              HIT holds an overall QS 5-Star rating for teaching, employability, academic development, facilities, and social responsibility. The rating reflects our commitment to an outstanding student experience and strong graduate outcomes.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 pt-2 text-xs">
              {[
                { name: 'Teaching', rating: '5 Stars' },
                { name: 'Employability', rating: '5 Stars' },
                { name: 'Academic Development', rating: '5 Stars' },
                { name: 'Facilities', rating: '5 Stars' },
                { name: 'Social Responsibility', rating: '5 Stars' },
                { name: 'Inclusiveness', rating: '5 Stars' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <span className="rounded bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    {item.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {norm === 'programmes' && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800">Professional Recognition</span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Programme Recognition</h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">International Benchmarks</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engineering and computing programmes are mapped to ABET outcomes and recognised by leading professional bodies. The curriculum is reviewed annually with industry advisors and global academic partners.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 pt-2 text-xs">
              {[
                { name: 'Computer Science and Engineering', code: 'CSE', body: 'IET / BCS Aligned' },
                { name: 'Electronics and Communication Engineering', code: 'ECE', body: 'IET Aligned' },
                { name: 'Mechanical Engineering', code: 'MECH', body: 'IET Aligned' },
                { name: 'Bio-Medical Engineering', code: 'BME', body: 'ABET Aligned' },
              ].map((p) => (
                <div key={p.code} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{p.code}</p>
                  </div>
                  <span className="rounded bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    {p.body}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {norm === 'iqac' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#0b3d91]">Quality Assurance</span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Institutional Quality Assurance Office</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Institutional Quality Assurance Office monitors and enhances benchmarks in teaching, curriculum development, research, student support, and governance. It coordinates external reviews and publishes annual quality reports.
            </p>
          </div>
        )}

        {norm === 'partnerships' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">Global Network</span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Global Academic Partnerships</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              HIT partners with more than 40 universities and research institutions across Europe, North America, and Asia. Students can access semester exchange, summer research, dual-degree pathways, and international internships.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-3 pt-2 text-xs">
              {['Semester Exchange', 'Dual-Degree Pathways', 'Global Internships'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center font-bold text-[#0b3d91]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}

// ---------------- RANKINGS PAGE ---------------- //
export function RankingsPage() {
  return (
    <PublicPageLayout
      title="Rankings & Recognition"
      subtitle="Independent benchmarks for teaching, research, employability, and global impact"
      breadcrumbs={[{ label: 'Rankings' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">Global & National Rankings</h2>
        <p className="text-sm text-slate-700">
          HIT participates in leading international ranking and rating exercises across engineering, management, and overall institutional categories. Official summaries and performance highlights are published here.
        </p>
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="text-2xl font-black text-amber-600">5★</p>
            <p className="font-bold text-slate-800">QS Stars</p>
            <p className="text-xs text-slate-600">Overall institutional rating for teaching, employability, and facilities.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="text-2xl font-black text-[#0b3d91]">Top 100</p>
            <p className="font-bold text-slate-800">THE Impact</p>
            <p className="text-xs text-slate-600">Recognised for quality education, research, and sustainable development.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="text-2xl font-black text-emerald-600">40+</p>
            <p className="font-bold text-slate-800">Global Partners</p>
            <p className="text-xs text-slate-600">Exchange, research, and dual-degree collaborations worldwide.</p>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- CAREER DEVELOPMENT / PLACEMENTS PAGE ---------------- //
export function CareerDevelopmentPage() {
  return (
    <PublicPageLayout
      title="Career Development & Placements"
      subtitle="Dedicated placement cell ensuring outstanding placement records across premier global corporations"
      breadcrumbs={[{ label: 'Career Development' }]}
    >
      <div className="space-y-6">
        <div className="card p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-3xl font-black text-emerald-700">96%</p>
              <p className="text-xs font-semibold text-slate-600">Placement Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-3xl font-black text-[#0b3d91]">₹24.0 LPA</p>
              <p className="text-xs font-semibold text-slate-600">Highest Package</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-3xl font-black text-purple-700">180+</p>
              <p className="text-xs font-semibold text-slate-600">Recruiting Partners</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[#0b3d91]">Top Recruiting Companies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Google', 'Microsoft', 'Amazon', 'Adobe', 'Deloitte', 'Siemens', 'Bosch', 'Qualcomm', 'Accenture', 'IBM', 'Infosys', 'TCS'].map((c, i) => (
              <span key={i} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs">
                🏢 {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- CAMPUS PAGE ---------------- //
export function CampusPage() {
  return (
    <PublicPageLayout
      title="Campus & Infrastructure"
      subtitle="A vibrant, green, safe, and technologically advanced 75-acre campus in Bengaluru"
      breadcrumbs={[{ label: 'Campus' }]}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Smart Classrooms', desc: 'Audio-visual equipped digital lecture halls with interactive multimedia displays.' },
          { title: 'Central Library', desc: 'Over 80,000+ volumes, IEEE digital access, and spacious reading halls.' },
          { title: 'Residences', desc: 'Separate, secure residences for men and women with dining halls and high-speed Wi-Fi.' },
          { title: 'Sports & Gymnasium', desc: 'Athletic tracks, football pitches, basketball courts, and a modern fitness centre.' },
          { title: 'Campus Shuttles', desc: 'Comprehensive shuttle coverage across Greater Bengaluru, Whitefield, and Electronic City.' },
          { title: 'Green & Solar Campus', desc: 'Rooftop solar power generation, rainwater harvesting, and lush landscape.' },
        ].map((item, idx) => (
          <div key={idx} className="card p-5">
            <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// ---------------- LIBRARY PAGE ---------------- //
export function LibraryPage() {
  return (
    <PublicPageLayout
      title="Central Library"
      subtitle="Knowledge Hub with extensive digital and physical learning resources"
      breadcrumbs={[{ label: 'Library' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">Central Library Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-black text-[#0b3d91]">80,000+</p>
            <p className="text-xs text-slate-600">Printed Volumes</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-black text-[#0b3d91]">5,000+</p>
            <p className="text-xs text-slate-600">E-Journals</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-black text-[#0b3d91]">IEEE / JSTOR</p>
            <p className="text-xs text-slate-600">Digital Subscriptions</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-black text-[#0b3d91]">300 Seats</p>
            <p className="text-xs text-slate-600">Reading Capacity</p>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- INNOVATION & R&D ---------------- //
export function InnovationPage() {
  return (
    <PublicPageLayout
      title="Innovation & Entrepreneurship"
      subtitle="Incubating ideas into breakthrough patents and thriving startups"
      breadcrumbs={[{ label: 'Innovation' }]}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-bold text-[#0b3d91]">Innovation Council</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Recognised nationally for promoting student-led innovation, incubation, and patent development across engineering and management disciplines.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-base font-bold text-[#0b3d91]">IDEA Lab</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Modern prototyping facility equipped with 3D printers, laser cutters, CNC machines, and embedded development boards.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}

export function ResearchPage() {
  return (
    <PublicPageLayout
      title="Research & Development"
      subtitle="Promoting high-impact publications, patents, and sponsored research"
      breadcrumbs={[{ label: 'R&D' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">Doctoral Research Centres</h2>
        <p className="text-sm text-slate-700">
          The departments of CSE, ECE, EEE, and Mechanical Engineering are designated doctoral research centres at HIT for Ph.D. and M.S. (By Research) programmes.
        </p>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- ALUMNI PAGE ---------------- //
export function AlumniPage() {
  return (
    <PublicPageLayout
      title="Alumni Association"
      subtitle="A global family of 26,000+ HIT alumni driving innovation worldwide"
      breadcrumbs={[{ label: 'Alumni' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">HIT Alumni Network</h2>
        <p className="text-sm text-slate-700">
          The HIT Alumni Association connects graduates across the globe, providing student mentorship, career guidance, and scholarship support for aspiring engineers.
        </p>
      </div>
    </PublicPageLayout>
  );
}

// ---------------- OTHER UTILITY PAGES ---------------- //
export function CareerPage() {
  return (
    <PublicPageLayout title="Career Opportunities" breadcrumbs={[{ label: 'Career' }]}>
      <div className="card p-6">
        <h2 className="text-base font-bold text-slate-900">Faculty & Staff Recruitment</h2>
        <p className="mt-2 text-xs text-slate-600">Interested candidates can send applications to careers@hit.edu.in.</p>
      </div>
    </PublicPageLayout>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PublicPageLayout title="Contact Us" breadcrumbs={[{ label: 'Contact' }]}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0b3d91]">Campus Address</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hogwarts Institute of Technology<br />
            {siteConfig.contact.address}
          </p>
          <div className="text-xs space-y-1 text-slate-600">
            <p><span className="font-bold text-slate-800">Phone:</span> {siteConfig.contact.phone}</p>
            <p><span className="font-bold text-slate-800">Email:</span> {siteConfig.contact.email}</p>
            <p><span className="font-bold text-slate-800">Hours:</span> {siteConfig.contact.officeHours}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[#0b3d91]">Send an Enquiry</h2>
          {submitted ? (
            <div className="mt-4 rounded bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
              Message received. We will respond soon.
            </div>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <input className="input" placeholder="Your Name" required />
              <input className="input" type="email" placeholder="Email" required />
              <textarea className="input" rows={3} placeholder="Message" required />
              <button type="submit" className="btn btn-primary bg-[#0b3d91]">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </PublicPageLayout>
  );
}
