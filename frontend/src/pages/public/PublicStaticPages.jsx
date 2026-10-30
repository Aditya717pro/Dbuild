import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

// Base layout wrapper for public informational pages
export function PublicPageLayout({
  title,
  subtitle,
  breadcrumbs = [],
  subNav = [],
  hero,
  bannerClassName = 'bg-gradient-to-r from-[#0b3d91] via-[#0a347c] to-[#041e42]',
  children,
}) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner */}
      <div className={`relative overflow-hidden text-white ${bannerClassName}`}>
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-11">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="text-blue-300/70">/</span>
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white">{crumb.label}</Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-blue-100">{subtitle}</p>}
          {hero}
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
      hero={
        !selectedCourse && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/admission/enquiry"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300"
              >
                Apply Online <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                to="/admission/fees-structure"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Fees &amp; Scholarships
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: '10+', label: 'UG Programmes' },
                { value: '4', label: 'PG Programmes' },
                { value: '980', label: 'UG Seats' },
                { value: '100%', label: 'Merit-Based' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <p className="text-lg font-black text-amber-300 sm:text-xl">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-100">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Main Content Area */}
        <div className="space-y-8 lg:col-span-2">
          {selectedCourse && (
            <div className="card overflow-hidden">
              <div
                className={`border-b border-slate-200 p-6 ${
                  selectedCourse.level === 'UG'
                    ? 'bg-gradient-to-r from-blue-50/80 to-white'
                    : 'bg-gradient-to-r from-amber-50/80 to-white'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      selectedCourse.level === 'UG'
                        ? 'bg-blue-100 text-[#0b3d91]'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {selectedCourse.level} Programme
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {selectedCourse.code}
                  </span>
                  {selectedCourse.accredited && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Professionally Accredited
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-[#0b3d91]">
                  {selectedCourse.degree} {selectedCourse.name}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {selectedCourse.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#course-application"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b3d91] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800"
                  >
                    Apply / Register &rarr;
                  </a>
                  <Link
                    to={`/admission/${selectedCourse.levelPath}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3d91] hover:underline"
                  >
                    &larr; Back to {selectedCourse.level} Programmes
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Duration</p>
                  <p className="mt-1 text-base font-black text-slate-900">{selectedCourse.duration}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Sanctioned Intake</p>
                  <p className="mt-1 text-base font-black text-slate-900">{selectedCourse.intake} seats</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Mode</p>
                  <p className="mt-1 text-base font-black text-slate-900">Full-time</p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900">Programme Highlights</h3>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  {courseHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                      <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-200 bg-blue-50/50 p-5">
                <p className="text-sm leading-relaxed text-slate-700">
                  <strong className="text-[#0b3d91]">Eligibility:</strong> {selectedCourse.eligibility}
                </p>
              </div>
            </div>
          )}

          {/* 1. PROGRAMMES OFFERED */}
          {(isProgrammes || isUG || isPG) && !selectedCourse && (
            <div className="space-y-8">
              {/* Undergraduate Card */}
              {!isPG && (
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">
                        4-Year Undergraduate Degree
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">
                        Undergraduate (B.E. / B.Tech) Programmes
                      </h2>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                        Admission is based on academic merit in the qualifying examination, followed by a personal interview. Programmes follow a flexible credit framework with industry-aligned electives.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-lg border border-blue-100 bg-white px-3 py-2 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Academic Year</p>
                      <p className="text-sm font-black text-[#0b3d91]">2026 - 2027</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Programme</th>
                          <th className="px-4 py-3">Degree</th>
                          <th className="px-4 py-3">Code</th>
                          <th className="px-4 py-3 text-center">Sanctioned Intake</th>
                          <th className="px-4 py-3">Accreditation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ugProgrammes.map((dept, idx) => (
                          <tr
                            key={dept.code}
                            className={`group transition hover:bg-blue-50/50 ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                          >
                            <td className="px-4 py-3.5 font-semibold text-slate-900">
                              <Link
                                to={`/admission/ug/${dept.slug}`}
                                className="inline-flex items-center gap-1.5 text-slate-900 transition hover:text-[#0b3d91] hover:underline"
                              >
                                {dept.name}
                                <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0b3d91]">
                                  &rarr;
                                </span>
                              </Link>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                {dept.degree}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-600">{dept.code}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-[#0b3d91]">{dept.intake}</td>
                            <td className="px-4 py-3.5">
                              {dept.accredited ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                                  <span>✓</span> Accredited
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-slate-500">Merit-Based</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-slate-200 bg-slate-50 font-bold text-slate-800">
                        <tr>
                          <td className="px-4 py-3" colSpan={3}>Total Undergraduate Sanctioned Intake</td>
                          <td className="px-4 py-3 text-center font-black text-[#0b3d91]">980 Seats</td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-500">Credit Framework 2026</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 font-bold text-[#0b3d91]">ℹ</span>
                    <p className="leading-relaxed">
                      <strong className="text-[#0b3d91]">UG Eligibility:</strong> Completed 10+2, A-Levels, IB, or an equivalent qualification with Mathematics, Physics, and Chemistry, and a minimum aggregate of 60%.
                    </p>
                  </div>
                </div>
              </div>
              )}

              {/* Postgraduate Card */}
              {!isUG && (
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-white p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                        2-Year Post Graduate Degree
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">
                        Postgraduate (M.E. / MBA) Programmes
                      </h2>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                        Advanced programmes combining specialised coursework, research seminars, and a supervised dissertation or industry capstone.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-lg border border-amber-100 bg-white px-3 py-2 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Accepted Scores</p>
                      <p className="text-sm font-black text-[#0b3d91]">GATE / GRE / GMAT</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Programme</th>
                          <th className="px-4 py-3">Degree</th>
                          <th className="px-4 py-3">Code</th>
                          <th className="px-4 py-3 text-center">Intake</th>
                          <th className="px-4 py-3">Eligibility Criteria</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pgProgrammes.map((p, idx) => (
                          <tr
                            key={p.code}
                            className={`group transition hover:bg-amber-50/50 ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                          >
                            <td className="px-4 py-3.5 font-semibold text-slate-900">
                              <Link
                                to={`/admission/pg/${p.slug}`}
                                className="inline-flex items-center gap-1.5 text-slate-900 transition hover:text-[#0b3d91] hover:underline"
                              >
                                {p.name}
                                <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0b3d91]">
                                  &rarr;
                                </span>
                              </Link>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                                {p.degree}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-600">{p.code}</td>
                            <td className="px-4 py-3.5 text-center font-bold text-[#0b3d91]">{p.intake}</td>
                            <td className="px-4 py-3.5 text-xs text-slate-600">{p.eligibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              )}

              {/* Research Centres Card */}
              {isProgrammes && (
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0b3d91]/10 text-lg font-black text-[#0b3d91]">
                    R
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#0b3d91]">Doctoral Research Centres</h2>
                    <p className="text-xs text-slate-500">Full-time and part-time Ph.D. programmes</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  The following departments at HIT are designated as doctoral research centres by the HIT Research Council:
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    'Computer Science & Engineering',
                    'Electronics & Communication Engg',
                    'Electrical & Electronics Engg',
                    'Mechanical Engineering',
                  ].map((dept) => (
                    <div
                      key={dept}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#0b3d91]/30 hover:bg-blue-50/40"
                    >
                      <p className="text-sm font-bold text-slate-800">{dept}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Ph.D. / M.S. (By Research)</p>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          )}

          {/* 2. FEES STRUCTURE */}
          {isFees && (
            <div className="space-y-8">
              {/* Statutory Notification Banner */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-5 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0b3d91] text-lg font-black text-white">
                    ₹
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0b3d91]">
                      Official Fee Structure (Academic Year 2026 - 2027)
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      Fees are approved by the HIT Finance Committee and published transparently. <strong>No donation or additional admission fee is collected.</strong> Scholarships and payment plans are available for eligible students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Annual Tuition & Academic Fees Table */}
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                  <h3 className="text-lg font-bold text-slate-900">1. Annual Academic &amp; Tuition Fees</h3>
                  <p className="text-xs text-slate-500">Merit-Based Admissions (Per Annum)</p>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Programme / Level</th>
                          <th className="px-4 py-3">Annual Tuition Fee</th>
                          <th className="px-4 py-3">Lab &amp; Amenities</th>
                          <th className="px-4 py-3 text-right">Total Per Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            name: 'B.E. / B.Tech (All Branches)',
                            note: 'CSE, IT, AI & DS, AI & ML, ECE, EEE, MECH, CIVIL, BME, MDE',
                            tuition: '₹1,50,000',
                            lab: '₹25,000',
                            total: '₹1,75,000',
                          },
                          {
                            name: 'M.E. Programmes',
                            note: 'CSE, Applied Electronics, VLSI Design',
                            tuition: '₹1,20,000',
                            lab: '₹20,000',
                            total: '₹1,40,000',
                          },
                          {
                            name: 'MBA (Master of Business Administration)',
                            note: '2-Year Full-Time Programme',
                            tuition: '₹1,80,000 (₹90,000/sem)',
                            lab: '₹20,000',
                            total: '₹2,00,000',
                          },
                          {
                            name: 'Ph.D. / Research Programmes',
                            note: 'Full-time and part-time doctoral study',
                            tuition: '₹90,000',
                            lab: '₹15,000',
                            total: '₹1,05,000',
                          },
                        ].map((row) => (
                          <tr key={row.name} className="transition hover:bg-blue-50/40">
                            <td className="px-4 py-4">
                              <span className="font-bold text-slate-900">{row.name}</span>
                              <p className="mt-0.5 text-xs text-slate-500">{row.note}</p>
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-800">{row.tuition}</td>
                            <td className="px-4 py-4 text-slate-600">{row.lab}</td>
                            <td className="bg-blue-50/50 px-4 py-4 text-right text-sm font-extrabold text-[#0b3d91]">
                              {row.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    International applicants should contact the Admissions Office for fee equivalence and scholarship options.
                  </p>
                </div>
              </div>

              {/* Hostel & Transport Section */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Hostel Fee */}
                <div className="card p-6">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">2. Residence &amp; Dining (Optional)</h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                      Resident
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Separate residences for men and women with high-speed Wi-Fi, solar heating, and 24/7 security.
                  </p>
                  <div className="mt-4 space-y-0.5 text-sm">
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Room Rent, Amenities &amp; Utilities</span>
                      <span className="shrink-0 font-bold text-slate-800">₹90,000 / year</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Dining Charges</span>
                      <span className="shrink-0 font-bold text-slate-800">₹60,000 / year</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Caution Deposit (Refundable)</span>
                      <span className="shrink-0 font-bold text-slate-800">₹10,000</span>
                    </div>
                    <div className="flex justify-between gap-3 pt-3 text-sm font-extrabold text-[#0b3d91]">
                      <span>Total Residential Fee</span>
                      <span className="shrink-0">₹1,60,000 / year</span>
                    </div>
                  </div>
                </div>

                {/* Shuttle / Transport Fee */}
                <div className="card p-6">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">3. Campus Shuttle (Optional)</h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-800">
                      Day Scholar
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Fleet of 40+ GPS-enabled shuttles covering Greater Bengaluru.
                  </p>
                  <div className="mt-4 space-y-0.5 text-sm">
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Zone A · Koramangala, Indiranagar</span>
                      <span className="shrink-0 font-bold text-slate-800">₹18,000 / year</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Zone B · Whitefield, HSR Layout</span>
                      <span className="shrink-0 font-bold text-slate-800">₹24,000 / year</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-slate-100 py-2.5">
                      <span className="text-slate-600">Zone C · Electronic City, Hebbal</span>
                      <span className="shrink-0 font-bold text-slate-800">₹30,000 / year</span>
                    </div>
                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                      GPS tracking and CCTV surveillance on all shuttle routes.
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarships & Financial Aid */}
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
                  <h3 className="text-lg font-bold text-[#0b3d91]">4. Scholarships &amp; Financial Aid</h3>
                  <p className="text-xs text-slate-500">Merit, access, and talent-based awards that make a HIT education more affordable.</p>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  {[
                    {
                      initials: 'M',
                      name: 'HIT Merit Scholarship',
                      text: <>Up to <strong>50% tuition waiver</strong> for students with outstanding academic records in their qualifying examination.</>,
                      tone: 'border-blue-200 bg-blue-50/60',
                      chip: 'bg-blue-100 text-blue-800',
                    },
                    {
                      initials: 'A',
                      name: 'HIT Access Scholarship',
                      text: <>Need-based support covering up to <strong>100% of tuition</strong> for first-generation learners and low-income households.</>,
                      tone: 'border-emerald-200 bg-emerald-50/60',
                      chip: 'bg-emerald-100 text-emerald-800',
                    },
                    {
                      initials: 'W',
                      name: 'Women in STEM Award',
                      text: <>A <strong>30% tuition award</strong> for exceptional women applicants entering engineering, computing, and applied science programmes.</>,
                      tone: 'border-amber-200 bg-amber-50/60',
                      chip: 'bg-amber-100 text-amber-800',
                    },
                    {
                      initials: 'S',
                      name: 'Sports & Global Exchange Awards',
                      text: <>Up to <strong>50% tuition support</strong> for national-level athletes, plus travel bursaries for semester exchange at partner universities.</>,
                      tone: 'border-purple-200 bg-purple-50/60',
                      chip: 'bg-purple-100 text-purple-800',
                    },
                  ].map((award) => (
                    <div key={award.name} className={`rounded-xl border p-5 ${award.tone}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${award.chip}`}>
                          {award.initials}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{award.name}</h4>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-700">{award.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. ADMISSION PROCEDURE */}
          {isProcedure && (
            <div className="space-y-8">
              {/* Application & Selection Procedure Card */}
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-white p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                        Merit-Based Admission
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">
                        Application &amp; Selection Procedure
                      </h2>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                        Admission to all programmes is merit-based and holistic. Submit an online application, upload your documents, and complete an interview with the admissions committee.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-lg border border-blue-100 bg-white px-3 py-2 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Admissions Cycle</p>
                      <p className="text-sm font-black text-[#0b3d91]">2026 - 2027</p>
                    </div>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3 p-6">
                  {[
                    {
                      step: '01',
                      title: 'Start Your Online Application',
                      desc: 'Create a profile on the HIT admissions portal (apply.hit.edu.in), select your programme, and complete the application form.',
                    },
                    {
                      step: '02',
                      title: 'Upload Documents',
                      desc: 'Upload Class 10 and 12 transcripts, a government-issued photo ID, entrance examination scores, and a personal statement.',
                    },
                    {
                      step: '03',
                      title: 'Entrance Score & Interview',
                      desc: 'Submit a valid SAT, GATE, GRE, CAT, or MAT score — or take the HIT Entrance Assessment — and attend an interview with the admissions committee.',
                    },
                    {
                      step: '04',
                      title: 'Receive Your Offer',
                      desc: 'The committee reviews your academic record, entrance score, statement, and interview to release a provisional offer of admission.',
                    },
                    {
                      step: '05',
                      title: 'Accept & Confirm',
                      desc: 'Accept the offer, pay the confirmation deposit, and apply for on-campus residence and scholarships through the student portal.',
                    },
                    {
                      step: '06',
                      title: 'Enrol & Orientation',
                      desc: 'Complete enrolment at the HIT campus in Koramangala, Bengaluru, and join the orientation programme before classes begin.',
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-[#0b3d91]/30 hover:bg-blue-50/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0b3d91] text-sm font-black text-white">
                        {item.step}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Merit Admission & Lateral Entry Cards */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Merit Admission */}
                <div className="card p-6">
                  <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-900">
                    Direct Admission
                  </span>
                  <h3 className="mt-2.5 text-base font-bold text-[#0b3d91]">Merit-Based Direct Admission</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    Applications are reviewed holistically on academic performance, entrance scores, statement of purpose, and interview. No donation or additional admission fee is involved.
                  </p>
                  <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-slate-700">
                    <li><Link to="/admission/ug" className="font-bold text-[#0b3d91] underline">Choose your programme</Link> and complete the online application from the course page.</li>
                    <li>Meet our admissions team for programme guidance and scholarship advice.</li>
                    <li>Upload transcripts and complete the interview or assessment.</li>
                    <li>Accept your offer and confirm your seat.</li>
                  </ol>
                </div>

                {/* Lateral Entry */}
                <div className="card p-6">
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    Direct 2nd Year
                  </span>
                  <h3 className="mt-2.5 text-base font-bold text-[#0b3d91]">Lateral Entry (B.E. / B.Tech)</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    Diploma holders in Engineering / Technology and B.Sc. graduates with Mathematics may apply for direct entry to the second year (third semester).
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-700">
                    <li>Apply online with diploma or B.Sc. transcripts and a statement of purpose.</li>
                    <li>Minimum 60% aggregate or equivalent in the qualifying programme.</li>
                    <li>A bridging assessment may be required before enrolment.</li>
                    <li>Merit scholarships are available for eligible lateral-entry students.</li>
                  </ul>
                </div>
              </div>

              {/* Minimum Eligibility Criteria Card */}
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                  <h3 className="text-lg font-bold text-[#0b3d91]">Minimum Eligibility Requirements</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Entry Pathway</th>
                          <th className="px-4 py-3">Minimum Qualifying Aggregate</th>
                          <th className="px-4 py-3">Qualifying Subjects / Requirements</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          ['Undergraduate (Standard Entry)', '60% Aggregate', 'Mathematics, Physics & Chemistry'],
                          ['Undergraduate (Honours Pathway)', '75% Aggregate', 'Mathematics, Physics & Chemistry + Interview'],
                          ['International Applicants', 'IB / A-Levels Equivalent', 'Mathematics and two science subjects'],
                          ['Lateral Entry', '60% Aggregate', 'Diploma in Engineering / B.Sc. with Mathematics'],
                        ].map(([pathway, aggregate, subjects], idx) => (
                          <tr key={pathway} className={`transition hover:bg-blue-50/40 ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                            <td className="px-4 py-3.5 font-bold text-slate-900">{pathway}</td>
                            <td className="px-4 py-3.5 font-semibold text-[#0b3d91]">{aggregate}</td>
                            <td className="px-4 py-3.5 text-slate-600">{subjects}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mandatory Documents Checklist */}
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                  <h3 className="text-lg font-bold text-slate-900">Documents Required at Admission</h3>
                  <p className="text-xs text-slate-500">Please bring originals along with two sets of self-attested photocopies.</p>
                </div>

                <div className="grid gap-2.5 p-6 text-sm text-slate-700 sm:grid-cols-2">
                  {[
                    'Class 10 Marksheet / Transcript',
                    'Class 12 Marksheet / Transcript (or predicted grades)',
                    'Transfer / Leaving Certificate',
                    'Government-issued photo ID (Aadhaar / Passport)',
                    'Entrance Examination Scorecard (SAT / GATE / GRE / CAT / MAT)',
                    'Statement of Purpose and CV',
                    'Scholarship or Category Supporting Documents (if applicable)',
                    'Migration / Equivalence Certificate (for other curricula)',
                    'Medical Fitness Certificate',
                    '6 recent passport-size colour photographs',
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                        ✓
                      </span>
                      <span className="font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. APPLICATION / REGISTRATION FORM */}
          {(isEnquiry || selectedCourse) && (
            <div id={selectedCourse ? 'course-application' : undefined} className="card overflow-hidden">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white p-6">
                <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0b3d91]">
                  Application Form
                </span>
                <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">
                  {selectedCourse
                    ? `Application for ${selectedCourse.degree} ${selectedCourse.name}`
                    : 'Online Application / Registration Form (2026 - 2027)'}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {selectedCourse
                    ? 'Complete the form below to register your application for this programme. Our admissions team will contact you with the next steps.'
                    : 'Complete the application form below. Our admissions team will review your details and contact you with the next steps.'}
                </p>
              </div>

              {formSubmitted ? (
                <div className="m-6 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Application Submitted Successfully!</h3>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-emerald-700">
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
                  className="space-y-5 p-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
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

                  <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-900"
                    />
                    <span>
                      I confirm that the information provided is accurate and I agree to the admission terms and conditions.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b3d91] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-800 sm:w-auto"
                  >
                    Submit Application <span aria-hidden="true">&rarr;</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Admissions Badge */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-[#0b3d91] to-[#041e42] p-5 text-white shadow-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl" aria-hidden="true" />
            <span className="relative inline-flex rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900">
              Admissions Open
            </span>
            <p className="relative mt-3 text-2xl font-black text-amber-300">2026 - 2027</p>
            <p className="relative mt-1.5 text-xs leading-relaxed text-blue-100">
              Applications are reviewed on a rolling basis. Apply early to secure your preferred programme and scholarship consideration.
            </p>
            <Link
              to="/admission/enquiry"
              className="relative mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#0b3d91] transition hover:bg-blue-50"
            >
              Start Application <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Quick Navigation Card */}
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Admission Resources</h3>
            <ul className="mt-3 space-y-1 text-sm font-medium">
              {subNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-[#0b3d91]"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admission Office Contact Card */}
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Admission Help Desk</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Phone</p>
                <p className="mt-0.5 font-medium">{siteConfig.contact.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Helpline / WhatsApp</p>
                <p className="mt-0.5 font-medium">+91 80 4718 2300</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Email</p>
                <p className="mt-0.5 break-all font-medium">{siteConfig.contact.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Office Hours</p>
                <p className="mt-0.5 font-medium">{siteConfig.contact.officeHours}</p>
              </div>
            </div>
          </div>

          {/* Key Accreditations Mini-Card */}
          <div className="card border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Institution Highlights</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-center">
              {[
                { value: 'QS 5★', label: 'Rated' },
                { value: '40+', label: 'Global Partners' },
                { value: '1951', label: 'Established' },
                { value: '96%', label: 'Placements' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-sm font-extrabold text-[#0b3d91]">{item.value}</p>
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
