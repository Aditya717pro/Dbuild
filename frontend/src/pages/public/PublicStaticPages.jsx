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
                    (location.pathname === '/admission' && item.to === '/admission/programmes') ||
                    (location.pathname === '/academics' && item.to === '/academics/regulations') ||
                    (location.pathname === '/accreditation' && item.to === '/accreditation/nba');
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
    { label: 'About VCET', to: '/about' },
    { label: 'Objectives & Vision', to: '/about/objectives' },
    { label: 'Secretary Message', to: '/about/secretary-message' },
    { label: 'Governing Council', to: '/about/governing-council' },
    { label: 'Principal Profile', to: '/about/principal-profile' },
    { label: 'Statutory Committees', to: '/about/committees' },
  ];

  return (
    <PublicPageLayout
      title="About VCET"
      subtitle="Velalar College of Engineering and Technology (Autonomous) — 25 Years of Academic Excellence"
      breadcrumbs={[{ label: 'About', to: '/about' }, { label: section.toUpperCase() }]}
      subNav={subNav}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {section === 'about' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0b3d91]">About VCET</h2>
              <p className="text-sm leading-relaxed text-slate-700">
                Velalar College of Engineering and Technology (Autonomous), established in the year 2001, is one of the premier self-financing engineering institutions in Tamil Nadu. The institution is run by Vellalar Educational Trust, which has been serving the cause of education for over five decades.
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                VCET is approved by AICTE, New Delhi, affiliated to Anna University, Chennai, and accredited with 'A+' Grade by NAAC. Seven undergraduate engineering programmes are accredited by the National Board of Accreditation (NBA).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">2001</p>
                  <p className="text-xs text-slate-600">Established</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">NAAC A+</p>
                  <p className="text-xs text-slate-600">Accredited</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">7 Depts</p>
                  <p className="text-xs text-slate-600">NBA Accredited</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100">
                  <p className="text-xl font-extrabold text-[#0b3d91]">25 Years</p>
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
                "Our vision has always been to empower students from all walks of life with quality technical education. VCET stands committed to nurturing disciplined innovators who will lead tomorrow's technology transformations."
              </div>
              <p className="text-xs font-bold text-slate-900 text-right">— Thiru. S. D. Chandrasekar, Secretary</p>
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
                  <p className="text-xs text-[#0b3d91] font-semibold">Principal, VCET</p>
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
              <h2 className="text-xl font-bold text-[#0b3d91]">Statutory Bodies & Committees</h2>
              <p className="text-sm text-slate-700">
                VCET operates under statutory governance councils comprising industry luminaries, university representatives, and eminent academicians.
              </p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">Governing Council</p>
                  <p className="text-xs text-slate-600">Oversees strategic direction, budgets, and institutional policy.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-800">Academic Council</p>
                  <p className="text-xs text-slate-600">Approves autonomous regulations, curricula, and examination schemes.</p>
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
export function AdmissionPage({ section = 'admission' }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    degree: 'B.E. Computer Science and Engineering',
    category: 'Government Quota (TNEA Single Window)',
    marks: '',
    message: '',
  });

  const subNav = [
    { label: 'Programmes Offered', to: '/admission/programmes' },
    { label: 'Fees Structure', to: '/admission/fees-structure' },
    { label: 'Admission Procedure', to: '/admission/procedure' },
    { label: 'Online Enquiry Form', to: '/admission/enquiry' },
  ];

  const normSection = (section || 'programmes').toLowerCase();
  const isFees = normSection === 'fees-structure' || normSection === 'fees' || normSection === 'fee-structure';
  const isProcedure = normSection === 'procedure' || normSection === 'admission-procedure';
  const isEnquiry = normSection === 'enquiry' || normSection === 'online-enquiry';
  const isProgrammes = !isFees && !isProcedure && !isEnquiry;

  const activeSectionTitle = isFees
    ? 'Fees Structure'
    : isProcedure
    ? 'Admission Procedure'
    : isEnquiry
    ? 'Online Enquiry Form'
    : 'Programmes Offered';

  const ugProgrammes = [
    { name: 'Computer Science and Engineering', code: 'CSE', degree: 'B.E.', intake: 180, nba: true },
    { name: 'Information Technology', code: 'IT', degree: 'B.Tech', intake: 120, nba: false },
    { name: 'Artificial Intelligence and Data Science', code: 'AI & DS', degree: 'B.Tech', intake: 120, nba: false },
    { name: 'Artificial Intelligence and Machine Learning', code: 'AI & ML', degree: 'B.Tech', intake: 60, nba: false },
    { name: 'Electronics and Communication Engineering', code: 'ECE', degree: 'B.E.', intake: 180, nba: true },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', degree: 'B.E.', intake: 120, nba: false },
    { name: 'Mechanical Engineering', code: 'MECH', degree: 'B.E.', intake: 60, nba: true },
    { name: 'Civil Engineering', code: 'CIVIL', degree: 'B.E.', intake: 60, nba: false },
    { name: 'Bio-Medical Engineering', code: 'BME', degree: 'B.E.', intake: 60, nba: true },
    { name: 'Medical Electronics', code: 'MDE', degree: 'B.E.', intake: 60, nba: false },
  ];

  const pgProgrammes = [
    { name: 'Computer Science and Engineering', code: 'M.E. CSE', degree: 'M.E.', intake: 18, eligibility: 'B.E. / B.Tech in CSE / IT / Software Engg + CEETA-PG / GATE' },
    { name: 'Applied Electronics', code: 'M.E. AE', degree: 'M.E.', intake: 18, eligibility: 'B.E. / B.Tech in ECE / EEE / E&I + CEETA-PG / GATE' },
    { name: 'VLSI Design', code: 'M.E. VLSI', degree: 'M.E.', intake: 18, eligibility: 'B.E. / B.Tech in ECE / EEE / CSE / IT / E&I + CEETA-PG / GATE' },
    { name: 'Master of Business Administration', code: 'MBA', degree: 'MBA', intake: 60, eligibility: 'Recognized Bachelor Degree (10+2+3/4) with min 50% + TANCET / MAT' },
  ];

  return (
    <PublicPageLayout
      title="Admissions 2026 - 2027"
      subtitle="Velalar College of Engineering and Technology (Autonomous), Erode — TNEA Code: 2723"
      breadcrumbs={[{ label: 'Admission', to: '/admission' }, { label: activeSectionTitle }]}
      subNav={subNav}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. PROGRAMMES OFFERED */}
          {isProgrammes && (
            <div className="space-y-6">
              {/* Undergraduate Card */}
              <div className="card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#0b3d91]">
                      4-Year Autonomous Degree
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-[#0b3d91]">
                      Undergraduate (B.E. / B.Tech) Programmes
                    </h2>
                  </div>
                  <div className="text-xs text-slate-500">
                    Academic Year 2026 - 2027 • Approved by AICTE
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Admission to undergraduate programmes is carried out via Government Single Window Counselling (TNEA Code: <strong className="text-slate-900">2723</strong>) and Consortium Management Quota. All programmes follow Choice-Based Credit System (CBCS) under Autonomous Regulations.
                </p>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                      <tr>
                        <th className="p-3">Programme</th>
                        <th className="p-3">Degree</th>
                        <th className="p-3">Code</th>
                        <th className="p-3 text-center">Sanctioned Intake</th>
                        <th className="p-3">Accreditation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ugProgrammes.map((dept) => (
                        <tr key={dept.code} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-semibold text-slate-900">{dept.name}</td>
                          <td className="p-3">
                            <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 text-[11px]">
                              {dept.degree}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-mono font-bold">{dept.code}</td>
                          <td className="p-3 text-center font-bold text-[#0b3d91]">{dept.intake}</td>
                          <td className="p-3">
                            {dept.nba ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800 text-[10px]">
                                <span>✓</span> NBA Accredited
                              </span>
                            ) : (
                              <span className="text-slate-500 font-medium text-[11px]">Anna Univ / AICTE</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
                      <tr>
                        <td className="p-3" colSpan={3}>Total Undergraduate Sanctioned Intake</td>
                        <td className="p-3 text-center text-[#0b3d91] font-black">980 Seats</td>
                        <td className="p-3 text-xs text-slate-500 font-semibold">Autonomous R-2022</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="rounded-lg bg-blue-50/70 p-3.5 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-base text-[#0b3d91]">ℹ️</span>
                  <div>
                    <strong className="text-[#0b3d91]">UG Eligibility:</strong> Passed 10+2 / HSC Examination with Mathematics, Physics, and Chemistry as compulsory subjects with prescribed minimum aggregate percentage (OC: 45%, BC/BCM/MBC/SC/ST: 40%).
                  </div>
                </div>
              </div>

              {/* Postgraduate Card */}
              <div className="card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="rounded bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-900">
                      2-Year Post Graduate Degree
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-[#0b3d91]">
                      Postgraduate (M.E. / MBA) Programmes
                    </h2>
                  </div>
                  <div className="text-xs text-slate-500">
                    Affiliated to Anna University • CEETA-PG / TANCET
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                      <tr>
                        <th className="p-3">Programme</th>
                        <th className="p-3">Degree</th>
                        <th className="p-3">Code</th>
                        <th className="p-3 text-center">Intake</th>
                        <th className="p-3">Eligibility Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {pgProgrammes.map((p) => (
                        <tr key={p.code} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-3">
                            <span className="rounded bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 font-bold text-[11px]">
                              {p.degree}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-mono font-bold">{p.code}</td>
                          <td className="p-3 text-center font-bold text-[#0b3d91]">{p.intake}</td>
                          <td className="p-3 text-slate-600 text-[11px]">{p.eligibility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Research Centres Card */}
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#0b3d91]">Recognized Anna University Research Centres</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The following departments at VCET are officially recognized by Anna University, Chennai as Collaborative Research Centres for pursuing full-time and part-time Ph.D. degrees:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                    <p className="font-bold text-slate-800 text-sm">Computer Science & Engineering</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ph.D. / M.S. (By Research)</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                    <p className="font-bold text-slate-800 text-sm">Electronics & Communication Engg</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ph.D. / M.S. (By Research)</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                    <p className="font-bold text-slate-800 text-sm">Electrical & Electronics Engg</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ph.D. / M.S. (By Research)</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
                    <p className="font-bold text-slate-800 text-sm">Mechanical Engineering</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ph.D. / M.S. (By Research)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. FEES STRUCTURE */}
          {isFees && (
            <div className="space-y-6">
              {/* Statutory Notification Banner */}
              <div className="rounded-xl bg-blue-50/90 border border-blue-200 p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-[#0b3d91]">📋</span>
                  <div>
                    <h2 className="text-base font-bold text-[#0b3d91]">
                      Official Fee Structure (Academic Year 2026 - 2027)
                    </h2>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      Tuition and academic fees at Velalar College of Engineering and Technology (Autonomous) are strictly governed by the orders of the <strong>Committee on Fixation of Fee for Self-Financing Professional Colleges</strong>, Government of Tamil Nadu. <strong>No capitation fee or donation is collected.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Annual Tuition & Academic Fees Table */}
              <div className="card p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">1. Annual Academic & Tuition Fees</h3>
                  <p className="text-xs text-slate-500">Government Quota (TNEA) and Consortium Management Quota (Per Annum)</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                      <tr>
                        <th className="p-3">Programme / Branch</th>
                        <th className="p-3">Admission Quota</th>
                        <th className="p-3">Annual Tuition Fee</th>
                        <th className="p-3">Special / Lab Amenities</th>
                        <th className="p-3 text-right">Total Per Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">B.E. / B.Tech (Accredited)</span>
                          <p className="text-[11px] text-emerald-700 font-medium">CSE, ECE, MECH, BME (NBA Accredited)</p>
                        </td>
                        <td className="p-3 font-semibold text-blue-700">Govt. Quota (TNEA)</td>
                        <td className="p-3 font-semibold text-slate-800">₹55,000</td>
                        <td className="p-3 text-slate-600">₹10,000</td>
                        <td className="p-3 text-right font-bold text-[#0b3d91] text-sm">₹65,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">B.E. / B.Tech (Non-Accredited)</span>
                          <p className="text-[11px] text-slate-500">IT, AI&DS, AI&ML, EEE, CIVIL, MDE</p>
                        </td>
                        <td className="p-3 font-semibold text-blue-700">Govt. Quota (TNEA)</td>
                        <td className="p-3 font-semibold text-slate-800">₹50,000</td>
                        <td className="p-3 text-slate-600">₹10,000</td>
                        <td className="p-3 text-right font-bold text-[#0b3d91] text-sm">₹60,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">B.E. / B.Tech (All Branches)</span>
                          <p className="text-[11px] text-slate-500">Merit-based direct admission</p>
                        </td>
                        <td className="p-3 font-semibold text-purple-700">Management Quota</td>
                        <td className="p-3 font-semibold text-slate-800">₹85,000 - ₹1,20,000</td>
                        <td className="p-3 text-slate-600">Included</td>
                        <td className="p-3 text-right font-bold text-purple-900 text-sm">As per Consortium</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">M.E. Programmes</span>
                          <p className="text-[11px] text-slate-500">CSE, Applied Electronics, VLSI Design</p>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">Govt. / Mgmt Quota</td>
                        <td className="p-3 font-semibold text-slate-800">₹50,000</td>
                        <td className="p-3 text-slate-600">₹10,000</td>
                        <td className="p-3 text-right font-bold text-[#0b3d91] text-sm">₹60,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">MBA (Master of Business Admin)</span>
                          <p className="text-[11px] text-slate-500">2-Year Full-time Autonomous Programme</p>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">Govt. / Mgmt Quota</td>
                        <td className="p-3 font-semibold text-slate-800">₹70,000 (₹35k/sem)</td>
                        <td className="p-3 text-slate-600">₹10,000</td>
                        <td className="p-3 text-right font-bold text-[#0b3d91] text-sm">₹80,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hostel & Transport Section */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Hostel Fee */}
                <div className="card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">2. Hostel & Mess Charges (Optional)</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Resident</span>
                  </div>
                  <p className="text-xs text-slate-600">Separate hostels for boys and girls with high-speed Wi-Fi, solar heating, and 24/7 security.</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Room Rent, Amenities & Electricity:</span>
                      <span className="font-bold text-slate-800">₹35,000 / year</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Mess Charges (Hygienic Veg & Non-Veg):</span>
                      <span className="font-bold text-slate-800">₹45,000 / year</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Caution Deposit (Refundable, one-time):</span>
                      <span className="font-bold text-slate-800">₹5,000</span>
                    </div>
                    <div className="flex justify-between pt-2 text-[#0b3d91] font-extrabold text-sm">
                      <span>Total Residential Fee:</span>
                      <span>₹80,000 / year</span>
                    </div>
                  </div>
                </div>

                {/* Bus / Transport Fee */}
                <div className="card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">3. Transport / Bus Charges (Optional)</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Day Scholar</span>
                  </div>
                  <p className="text-xs text-slate-600">Fleet of 40+ GPS-enabled college buses covering 4 neighboring districts.</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Zone A (Erode City, Thindal, Perundurai):</span>
                      <span className="font-bold text-slate-800">₹18,000 / year</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Zone B (Bhavani, Komarapalayam, Chennimalai):</span>
                      <span className="font-bold text-slate-800">₹22,000 / year</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Zone C (Tirupur, Salem, Namakkal, Anthiyur):</span>
                      <span className="font-bold text-slate-800">₹26,000 - ₹28,000</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600">
                      GPS tracking & CCTV surveillance on all college bus routes.
                    </div>
                  </div>
                </div>
              </div>

              {/* Government Scholarships & Concessions */}
              <div className="card p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-[#0b3d91]">4. Government Scholarships & Fee Waivers</h3>
                  <p className="text-xs text-slate-500">Eligible students can claim significant fee exemptions and financial assistance.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎓</span>
                      <h4 className="font-bold text-slate-900 text-sm">First Graduate (FG) Concession</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      Eligible candidates whose family has no prior graduate receive a <strong>₹25,000 per year</strong> direct tuition fee reduction by the Government of Tamil Nadu under TNEA counselling.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏫</span>
                      <h4 className="font-bold text-slate-900 text-sm">7.5% Govt. School Quota</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      Students who studied from 6th to 12th standard in Tamil Nadu Government schools receive <strong>100% Free Education</strong> covering complete tuition, hostel, mess, and books sponsored by the State Government.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📑</span>
                      <h4 className="font-bold text-slate-900 text-sm">Post-Matric Scholarship (SC / ST / SCC)</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      Full tuition fee waiver for SC, ST, and converted Christian SC students with family annual income less than ₹2.5 Lakhs as per TN Welfare department guidelines.
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      <h4 className="font-bold text-slate-900 text-sm">Vellalar Trust Merit Scholarship</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      Up to <strong>50% tuition waiver</strong> offered by Vellalar Educational Trust for high-performing students with TNEA cut-off &gt; 185/200 and state/national level sports champions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Fee Portal Link */}
              <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-[#0b3d91] text-white">
                <div>
                  <h4 className="text-base font-bold">Online Fee Payment Portal</h4>
                  <p className="text-xs text-blue-200 mt-1">Pay semester tuition, examination, and hostel fees securely via Net Banking, UPI, or Cards.</p>
                </div>
                <Link to="/online-fee" className="btn bg-white text-[#0b3d91] hover:bg-blue-50 font-bold whitespace-nowrap shadow-md">
                  Go to Fee Portal &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* 3. ADMISSION PROCEDURE */}
          {isProcedure && (
            <div className="space-y-6">
              {/* TNEA Single-Window Procedure Card */}
              <div className="card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      Government Quota (TNEA)
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-[#0b3d91]">
                      TNEA Single-Window Counselling Procedure
                    </h2>
                  </div>
                  <div className="rounded-md bg-blue-50 px-3 py-1.5 border border-blue-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Counselling Code</span>
                    <span className="text-base font-black text-[#0b3d91]">TNEA 2723</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Admission to 65% of sanctioned B.E. / B.Tech seats is carried out through the Government of Tamil Nadu Single Window Counselling conducted by Anna University / Directorate of Technical Education (DOTE). Follow the sequential stages below:
                </p>

                {/* Steps List */}
                <div className="space-y-3 pt-2">
                  {[
                    {
                      step: '01',
                      title: 'TNEA Online Registration',
                      desc: 'Register online at the official TNEA portal (tneaonline.org) upon release of Tamil Nadu Class 12 (+2) results. Fill personal details and select preferred facilitation center (TFC).',
                    },
                    {
                      step: '02',
                      title: 'Certificate Upload & Digital Verification',
                      desc: 'Upload scanned copies of 10th mark sheet, 12th mark sheet, community certificate, transfer certificate, and first-graduate certificate for official online verification.',
                    },
                    {
                      step: '03',
                      title: 'Rank Publication & Cutoff Calculation',
                      desc: 'DOTE computes engineering cut-off marks out of 200: Maths (100) + Physics (50) + Chemistry (50), and publishes the general and community-wise state rank list.',
                    },
                    {
                      step: '04',
                      title: 'Online Choice Filling (Select Code: 2723)',
                      desc: 'During your allotted counselling round, enter Velalar College of Engineering and Technology (College Code: 2723) as your top preference and choose your preferred branch (CSE, IT, AI&DS, ECE, MECH, etc.).',
                    },
                    {
                      step: '05',
                      title: 'Provisional Seat Allotment',
                      desc: 'DOTE issues the provisional seat allotment order based on your cutoff rank, choice priority, and reservation quota. Accept the allotment and download the official allotment letter.',
                    },
                    {
                      step: '06',
                      title: 'Reporting to VCET Campus',
                      desc: 'Report in person to the VCET Admission Office, Thindal, Erode with original certificates and the allotment letter within the designated reporting window to confirm admission.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 transition">
                      <span className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#0b3d91] text-white flex items-center justify-center font-black text-sm">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Management Quota & Lateral Entry Cards */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Management Quota */}
                <div className="card p-5 space-y-3">
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-900 uppercase">
                    Direct Admission
                  </span>
                  <h3 className="text-base font-bold text-[#0b3d91]">Management Quota Admission</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    35% of sanctioned seats are filled under Management Quota on pure merit based on +2 / 12th marks through the Consortium of Self-Financing Colleges.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-700">
                    <li>Submit the <Link to="/admission/enquiry" className="text-[#0b3d91] font-bold underline">Online Admission Enquiry</Link> or visit the campus admission cell.</li>
                    <li>Meet our academic counselors for career guidance and branch availability.</li>
                    <li>Submit copies of mark sheets and secure provisional admission confirmation.</li>
                    <li>Pay the initial admission fee and finalize seat allocation.</li>
                  </ol>
                </div>

                {/* Lateral Entry */}
                <div className="card p-5 space-y-3">
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                    Direct 2nd Year
                  </span>
                  <h3 className="text-base font-bold text-[#0b3d91]">Lateral Entry (B.E. / B.Tech)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Diploma holders in Engineering / Technology and B.Sc. graduates with Mathematics are eligible for direct admission to the 2nd Year (3rd Semester).
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                    <li>Single-window counselling through Alagappa Chettiar Govt. College of Engg (Karaikudi).</li>
                    <li>Direct Management Quota lateral admission is also available at VCET campus.</li>
                    <li>Minimum 45% aggregate in Diploma / B.Sc. (40% for reserved categories).</li>
                  </ul>
                </div>
              </div>

              {/* Minimum Eligibility Criteria Card */}
              <div className="card p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0b3d91]">Minimum Eligibility Requirements (HSC / +2 Academic)</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                      <tr>
                        <th className="p-3">Community / Category</th>
                        <th className="p-3">Minimum Qualifying Aggregate (PCM)</th>
                        <th className="p-3">Qualifying Subjects</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">General Category (OC)</td>
                        <td className="p-3 font-semibold text-[#0b3d91]">45.0% Aggregate</td>
                        <td className="p-3 text-slate-600">Mathematics, Physics & Chemistry</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">Backward Class including BC Muslims (BC / BCM)</td>
                        <td className="p-3 font-semibold text-[#0b3d91]">40.0% Aggregate</td>
                        <td className="p-3 text-slate-600">Mathematics, Physics & Chemistry</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">Most Backward Class & DNC (MBC / DNC)</td>
                        <td className="p-3 font-semibold text-[#0b3d91]">40.0% Aggregate</td>
                        <td className="p-3 text-slate-600">Mathematics, Physics & Chemistry</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">SC / SCA / ST Categories</td>
                        <td className="p-3 font-semibold text-[#0b3d91]">40.0% Aggregate</td>
                        <td className="p-3 text-slate-600">Mathematics, Physics & Chemistry</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mandatory Documents Checklist */}
              <div className="card p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Original Documents Required at Admission</h3>
                  <p className="text-xs text-slate-500">Please bring the originals along with 3 sets of self-attested photocopies.</p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-slate-700">
                  {[
                    '10th / SSLC Mark Sheet (Original + 3 copies)',
                    '11th & 12th / HSC Mark Sheets (Original + 3 copies)',
                    'Transfer Certificate (TC) & Conduct Certificate',
                    'Permanent Community Certificate (Card / e-Certificate)',
                    'TNEA Allotment Order & Fee Receipt (for Govt. quota)',
                    'First Graduate Certificate & Joint Declaration (if applicable)',
                    'Income Certificate (for SC/ST post-matric scholarship)',
                    'Migration / Equivalence Certificate (for CBSE/ICSE/Other boards)',
                    'Aadhar Card photocopy of student & parent',
                    '6 recent passport size colour photographs',
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. ONLINE ENQUIRY FORM */}
          {isEnquiry && (
            <div className="card p-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#0b3d91]">
                  Fast-Track Admissions
                </span>
                <h2 className="mt-1 text-xl font-bold text-[#0b3d91]">
                  Online Admission Enquiry Form (2026 - 2027)
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Submit your academic details below. Our official admission counselor will contact you within 24 hours to guide you through seat reservation, scholarships, and counselling.
                </p>
              </div>

              {formSubmitted ? (
                <div className="mt-6 rounded-xl bg-emerald-50 p-8 text-center border border-emerald-200 space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Enquiry Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you for choosing Velalar College of Engineering and Technology (Autonomous). Our admission desk will get in touch with you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          name: '',
                          mobile: '',
                          email: '',
                          degree: 'B.E. Computer Science and Engineering',
                          category: 'Government Quota (TNEA Single Window)',
                          marks: '',
                          message: '',
                        });
                      }}
                      className="btn btn-secondary btn-sm font-bold"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Student Full Name *</label>
                      <input
                        className="input"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Contact Mobile Number *</label>
                      <input
                        className="input"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                    <div>
                      <label className="label">Expected / Actual Cut-Off (out of 200)</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="e.g. 182.5"
                        value={formData.marks}
                        onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Preferred Programme *</label>
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
                    </div>
                    <div>
                      <label className="label">Admission Category *</label>
                      <select
                        className="input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Government Quota (TNEA Single Window)</option>
                        <option>Management Quota (Direct Admission)</option>
                        <option>Lateral Entry (Direct 2nd Year)</option>
                        <option>Sports Quota / Special Category</option>
                        <option>Postgraduate (M.E. / MBA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Query / Remarks (Optional)</label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Ask about hostel accommodation, bus routes, scholarships, or fee concessions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary bg-[#0b3d91] hover:bg-blue-800 text-white font-bold py-2.5 px-6 shadow-md">
                    Submit Admission Enquiry &rarr;
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* TNEA Counselling Badge */}
          <div className="card p-5 bg-gradient-to-br from-blue-900 to-[#0b3d91] text-white">
            <span className="rounded bg-amber-400 text-slate-900 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
              Govt. Single Window
            </span>
            <p className="mt-3 text-2xl font-black text-amber-300">TNEA CODE: 2723</p>
            <p className="mt-1 text-xs text-blue-100 leading-relaxed">
              Choose <strong>VCET (Code 2723)</strong> as your first preference during TNEA online choice filling.
            </p>
          </div>

          {/* Quick Navigation Card */}
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Admissions Menu</h3>
            <ul className="mt-3 space-y-1.5 text-xs font-medium">
              {subNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center justify-between rounded-md p-2 text-slate-700 hover:bg-blue-50 hover:text-[#0b3d91] transition"
                  >
                    <span>{item.label}</span>
                    <span>&rarr;</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-100">
                <Link
                  to="/online-fee"
                  className="flex items-center justify-between rounded-md p-2 text-emerald-700 font-bold hover:bg-emerald-50 transition"
                >
                  <span>Online Fee Payment</span>
                  <span>💳</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Admission Office Contact Card */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Admission Help Desk</h3>
            <div className="text-xs space-y-2 text-slate-700">
              <p>
                <strong className="text-slate-900 block">Phone:</strong>
                {siteConfig.contact.phone}
              </p>
              <p>
                <strong className="text-slate-900 block">Helpline / WhatsApp:</strong>
                +91 97509 24444 / 98427 44201
              </p>
              <p>
                <strong className="text-slate-900 block">Email:</strong>
                {siteConfig.contact.email}
              </p>
              <p>
                <strong className="text-slate-900 block">Office Hours:</strong>
                {siteConfig.contact.officeHours}
              </p>
            </div>
            {!isEnquiry && (
              <Link to="/admission/enquiry" className="mt-2 block text-center btn btn-primary bg-[#0b3d91] btn-sm text-white font-bold">
                Online Enquiry Form &rarr;
              </Link>
            )}
          </div>

          {/* Key Accreditations Mini-Card */}
          <div className="card p-4 bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Institution Highlights</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="font-extrabold text-[#0b3d91]">NAAC A+</p>
                <p className="text-[10px] text-slate-500">Accredited</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="font-extrabold text-[#0b3d91]">7 Depts</p>
                <p className="text-[10px] text-slate-500">NBA Accredited</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="font-extrabold text-[#0b3d91]">Autonomous</p>
                <p className="text-[10px] text-slate-500">Anna University</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="font-extrabold text-[#0b3d91]">92%+</p>
                <p className="text-[10px] text-slate-500">Placements</p>
              </div>
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
      subtitle="Explore our 12 Autonomous Engineering, Management, and Science Departments"
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
              {dept.nba && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
                  NBA Accredited
                </span>
              )}
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 group-hover:text-[#0b3d91] transition">
              {dept.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {dept.category} • B.E. / B.Tech Autonomous
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
          VCET has over 150+ full-time experienced faculty members across engineering disciplines.
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
    { label: 'Curriculum (Autonomous)', to: '/academics/curriculum' },
    { label: 'Syllabus Scheme', to: '/academics/syllabus' },
    { label: 'CBCS System', to: '/academics/cbcs' },
    { label: 'COE Office', to: '/academics/coe' },
    { label: 'Exam Timetable', to: '/academics/timetable' },
  ];

  const academicTitles = {
    academics: 'Academic Regulations',
    regulations: 'Academic Regulations',
    curriculum: 'Curriculum (Autonomous)',
    syllabus: 'Syllabus Scheme',
    cbcs: 'CBCS System',
    coe: 'COE Office',
    timetable: 'Exam Timetable',
  };

  const norm = (section || 'academics').toLowerCase();

  return (
    <PublicPageLayout
      title="Academics"
      subtitle="Autonomous Curriculum, Choice Based Credit System (CBCS), and Academic Regulations"
      breadcrumbs={[{ label: 'Academics', to: '/academics' }, { label: academicTitles[norm] || 'Regulations' }]}
      subNav={subNav}
    >
      <div className="space-y-6">
        {(norm === 'academics' || norm === 'regulations') && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 text-[#0b3d91] font-bold px-2.5 py-0.5 text-xs">Regulations R-2022</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Autonomous Academic Regulations</h2>
              <p className="text-xs text-slate-500">Autonomous status conferred by UGC and Anna University, Chennai</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Velalar College of Engineering and Technology implements Autonomous Regulations (R-2022) with a credit-based framework aligned with the AICTE model curriculum.
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
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Autonomous Curriculum Structure</h2>
              <p className="text-xs text-slate-500">Industry-aligned outcome based education (OBE) framework</p>
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
              <h2 className="text-xl font-bold text-[#0b3d91]">Syllabus Scheme (R-2022)</h2>
              <p className="text-xs text-slate-500">Board of Studies (BoS) approved syllabus for all semesters</p>
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
              <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-xs">CBCS System</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Choice Based Credit System (CBCS)</h2>
              <p className="text-xs text-slate-500">Academic flexibility for multi-disciplinary learning</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              CBCS allows students to tailor their learning paths by selecting open electives from other engineering branches, earning Honors degrees or Minors in emerging disciplines like AI, IoT, and Cyber Security.
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
                <p className="font-bold text-purple-900 text-sm">NPTEL / SWAYAM</p>
                <p className="text-purple-700 mt-1">Credit transfer facility for recognized MOOC certification courses completed on SWAYAM/NPTEL.</p>
              </div>
            </div>
          </div>
        )}

        {norm === 'coe' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 text-[#0b3d91] font-bold px-2.5 py-0.5 text-xs">Autonomous Examination</span>
              <h2 className="mt-2 text-xl font-bold text-[#0b3d91]">Office of the Controller of Examinations (COE)</h2>
              <p className="text-xs text-slate-500">Autonomous evaluation, central assessment, and results publication</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              The Office of the COE conducts continuous internal assessments (CIA) and End Semester Examinations (ESE) in a strictly confidential, fair, and transparent autonomous environment.
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
              <h2 className="text-xl font-bold text-[#0b3d91]">Autonomous Examination Timetable</h2>
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
    { label: 'NBA Accreditation', to: '/accreditation/nba' },
    { label: 'NAAC Accreditation (A+)', to: '/accreditation/naac' },
    { label: 'IQAC Members', to: '/accreditation/iqac' },
    { label: 'AICTE Approvals', to: '/accreditation/aicte' },
  ];

  const accredTitles = {
    accreditation: 'NBA Accreditation',
    nba: 'NBA Accreditation',
    naac: 'NAAC Accreditation (A+)',
    iqac: 'IQAC Members',
    aicte: 'AICTE Approvals',
  };

  const norm = (section || 'accreditation').toLowerCase();

  return (
    <PublicPageLayout
      title="Accreditation & Approvals"
      subtitle="Recognized for Academic Rigor and Infrastructure by National Statutory Bodies"
      breadcrumbs={[{ label: 'Accreditation', to: '/accreditation' }, { label: accredTitles[norm] || 'Accreditations' }]}
      subNav={subNav}
    >
      <div className="space-y-6">
        {(norm === 'accreditation' || norm === 'nba') && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800">NBA Accredited</span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">National Board of Accreditation (NBA)</h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Washington Accord</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Seven eligible undergraduate engineering programmes at VCET are accredited by the National Board of Accreditation (NBA), New Delhi under the Washington Accord framework:
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 pt-2 text-xs">
              {[
                { name: 'Computer Science and Engineering', code: 'CSE', valid: 'Accredited (Tier II)' },
                { name: 'Electronics and Communication Engineering', code: 'ECE', valid: 'Accredited (Tier II)' },
                { name: 'Mechanical Engineering', code: 'MECH', valid: 'Accredited (Tier II)' },
                { name: 'Bio-Medical Engineering', code: 'BME', valid: 'Accredited (Tier II)' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{p.code}</p>
                  </div>
                  <span className="rounded bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    {p.valid}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {norm === 'naac' && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="rounded bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">NAAC A+ Grade</span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">National Assessment and Accreditation Council</h2>
              </div>
              <span className="text-xl font-black text-amber-600">Grade A+</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              VCET has been accredited with a prestigious <strong>'A+' Grade</strong> by the National Assessment and Accreditation Council (NAAC), Bengaluru. The peer team commended the college's state-of-the-art laboratory infrastructure, industry placements, and community outreach.
            </p>
          </div>
        )}

        {norm === 'iqac' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#0b3d91]">Quality Assurance</span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Internal Quality Assurance Cell (IQAC)</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The IQAC at VCET monitors and enhances institutional benchmarks in teaching-learning, curriculum development, research publications, and administrative governance.
            </p>
          </div>
        )}

        {norm === 'aicte' && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">Statutory Approvals</span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">AICTE Extension of Approvals (EoA)</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Velalar College of Engineering and Technology is approved by the All India Council for Technical Education (AICTE), New Delhi for running Undergraduate and Postgraduate programmes in Engineering and Management.
            </p>
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}

// ---------------- NIRF PAGE ---------------- //
export function NirfPage() {
  return (
    <PublicPageLayout
      title="NIRF Rankings"
      subtitle="National Institutional Ranking Framework (Ministry of Education, Govt. of India)"
      breadcrumbs={[{ label: 'NIRF' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">National Institutional Ranking Framework</h2>
        <p className="text-sm text-slate-700">
          VCET participates annually in the NIRF ranking across Engineering and Overall categories. All official ranking reports, data submissions, and sanctioned intake details are made publicly accessible here.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="font-bold text-slate-800">NIRF 2024 Data</p>
            <p className="text-xs text-slate-600">Full institutional report submitted to Ministry of Education.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="font-bold text-slate-800">NIRF 2023 Data</p>
            <p className="text-xs text-slate-600">Verified student placement, intake, and financial metrics.</p>
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
              <p className="text-3xl font-black text-emerald-700">92%+</p>
              <p className="text-xs font-semibold text-slate-600">Placement Percentage</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-3xl font-black text-[#0b3d91]">₹14.5 LPA</p>
              <p className="text-xs font-semibold text-slate-600">Highest Package</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-3xl font-black text-purple-700">120+</p>
              <p className="text-xs font-semibold text-slate-600">Recruiting Companies</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[#0b3d91]">Top Recruiting Companies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Zoho', 'TCS', 'Cognizant', 'Wipro', 'Infosys', 'Capgemini', 'Hexaware', 'Mindtree', 'Virtusa', 'Bosch', 'Soliton Technologies', 'Kaar Technologies', 'HCL Technologies'].map((c, i) => (
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
      subtitle="A vibrant, green, safe, and technologically advanced 25-acre campus in Erode"
      breadcrumbs={[{ label: 'Campus' }]}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Smart Classrooms', desc: 'Audio-visual equipped digital lecture halls with interactive multimedia displays.' },
          { title: 'Central Library', desc: 'Over 80,000+ volumes, IEEE digital access, and spacious reading halls.' },
          { title: 'Hostel Facilities', desc: 'Separate, secure boys and girls hostels with hygienic food and high-speed Wi-Fi.' },
          { title: 'Sports & Gymnasium', desc: 'Standard athletic tracks, cricket grounds, basketball courts, and modern gym.' },
          { title: 'Fleet of Buses', desc: 'Comprehensive transport covering Erode, Tirupur, Salem, and Namakkal districts.' },
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
            <p className="text-2xl font-black text-[#0b3d91]">IEEE / DELNET</p>
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
          <h2 className="text-base font-bold text-[#0b3d91]">Institution's Innovation Council (IIC)</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Rated 4-Stars by the Ministry of Education's Innovation Cell (MIC), Govt. of India, for promoting student-driven patent development.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-base font-bold text-[#0b3d91]">AICTE IDEA Lab</h2>
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
        <h2 className="text-xl font-bold text-[#0b3d91]">Recognized Anna University Research Centres</h2>
        <p className="text-sm text-slate-700">
          The departments of CSE, ECE, EEE, and Mechanical Engineering are recognized research centers under Anna University for conducting Ph.D. and M.S. (By Research) programmes.
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
      subtitle="A global family of 15,000+ VCETians driving tech innovation worldwide"
      breadcrumbs={[{ label: 'Alumni' }]}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">VCET Alumni Network</h2>
        <p className="text-sm text-slate-700">
          The VCET Alumni Association connects graduates across the globe, providing student mentorship, career guidance, and scholarship support for aspiring engineers.
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
        <p className="mt-2 text-xs text-slate-600">Interested candidates can send applications to recruitment@velalarengg.ac.in.</p>
      </div>
    </PublicPageLayout>
  );
}

export function OnlineFeePage() {
  return (
    <PublicPageLayout title="Online Fee Payment" breadcrumbs={[{ label: 'Online Fee' }]}>
      <div className="card p-6">
        <h2 className="text-base font-bold text-slate-900">Online Fee Payment Portal</h2>
        <p className="mt-2 text-xs text-slate-600">Pay tuition, examination, and hostel fees securely via Net Banking, UPI, or Cards.</p>
      </div>
    </PublicPageLayout>
  );
}

export function HallReservationPage() {
  return (
    <PublicPageLayout title="Hall Reservation System" breadcrumbs={[{ label: 'Hall Reservation' }]}>
      <div className="card p-6">
        <h2 className="text-base font-bold text-slate-900">Auditorium & Seminar Hall Booking</h2>
        <p className="mt-2 text-xs text-slate-600">Internal department requests for booking Kasthurba Auditorium and Main Seminar Hall.</p>
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
            Velalar College of Engineering and Technology (Autonomous)<br />
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
