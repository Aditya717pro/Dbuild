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
                  const isActive = location.pathname === item.to;
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
  const subNav = [
    { label: 'Programmes Offered', to: '/admission/programmes' },
    { label: 'Fees Structure', to: '/admission/fees-structure' },
    { label: 'Admission Procedure', to: '/admission/procedure' },
    { label: 'Online Enquiry Form', to: '/admission/enquiry' },
  ];

  return (
    <PublicPageLayout
      title="Admissions 2026 - 2027"
      subtitle="Join one of Tamil Nadu's leading autonomous technical institutions."
      breadcrumbs={[{ label: 'Admission', to: '/admission' }, { label: section.toUpperCase() }]}
      subNav={subNav}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {section === 'enquiry' ? (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-[#0b3d91]">Online Admission Enquiry Form</h2>
              <p className="mt-1 text-xs text-slate-500">Submit your details and our admission counselor will contact you within 24 hours.</p>

              {formSubmitted ? (
                <div className="mt-6 rounded-lg bg-emerald-50 p-6 text-center border border-emerald-200">
                  <p className="text-lg font-bold text-emerald-800">✓ Enquiry Submitted Successfully!</p>
                  <p className="mt-2 text-xs text-emerald-700">Thank you for your interest in VCET. Our admission desk will get in touch shortly.</p>
                  <button type="button" onClick={() => setFormSubmitted(false)} className="mt-4 btn btn-secondary btn-sm">
                    Submit Another Enquiry
                  </button>
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
                      <label className="label">Student Name *</label>
                      <input className="input" required placeholder="Full Name" />
                    </div>
                    <div>
                      <label className="label">Contact Mobile *</label>
                      <input className="input" type="tel" required placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Email Address *</label>
                      <input className="input" type="email" required placeholder="name@example.com" />
                    </div>
                    <div>
                      <label className="label">Preferred Degree *</label>
                      <select className="input">
                        <option>B.E. Computer Science & Engineering</option>
                        <option>B.Tech Information Technology</option>
                        <option>B.Tech Artificial Intelligence & Data Science</option>
                        <option>B.Tech Artificial Intelligence & Machine Learning</option>
                        <option>B.E. Electronics & Communication</option>
                        <option>B.E. Mechanical Engineering</option>
                        <option>B.E. Bio-Medical Engineering</option>
                        <option>MBA (Master of Business Administration)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Message / Query</label>
                    <textarea className="input" rows={3} placeholder="Inquire about hostel, scholarships, or quota..." />
                  </div>
                  <button type="submit" className="btn btn-primary bg-[#0b3d91] hover:bg-blue-800">
                    Submit Admission Enquiry
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0b3d91]">Undergraduate (B.E. / B.Tech) Programmes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                    <tr>
                      <th className="p-3">Programme</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Intake</th>
                      <th className="p-3">Accreditation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {siteConfig.departments.map((dept) => (
                      <tr key={dept.slug} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">{dept.name}</td>
                        <td className="p-3 text-slate-600 font-mono">{dept.code}</td>
                        <td className="p-3 text-slate-700 font-bold">60 - 180</td>
                        <td className="p-3">
                          {dept.nba ? (
                            <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 text-[10px]">
                              NBA Accredited
                            </span>
                          ) : (
                            <span className="text-slate-400">Anna Univ / AICTE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">TNEA Counselling</h3>
            <p className="mt-2 text-xl font-extrabold text-[#0b3d91]">TNEA CODE: 2723</p>
            <p className="mt-1 text-xs text-slate-600">Choose VCET code 2723 during government single-window engineering counselling.</p>
          </div>
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Admission Office</h3>
            <p className="mt-2 text-xs font-bold text-slate-900">Phone: {siteConfig.contact.phone}</p>
            <p className="text-xs text-slate-600">Email: {siteConfig.contact.email}</p>
            <Link to="/admission/enquiry" className="mt-3 block text-center btn btn-primary bg-[#0b3d91] btn-sm">
              Online Enquiry &rarr;
            </Link>
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

  return (
    <PublicPageLayout
      title="Academics"
      subtitle="Autonomous Curriculum, Choice Based Credit System (CBCS), and Academic Regulations"
      breadcrumbs={[{ label: 'Academics', to: '/academics' }, { label: section.toUpperCase() }]}
      subNav={subNav}
    >
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#0b3d91]">Autonomous Academic Framework</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          VCET functions as an autonomous institution affiliated to Anna University, Chennai. The curriculum is continuously revamped in consultation with industry experts to incorporate emerging technologies, hands-on lab experiments, and mandatory industrial internships.
        </p>
        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <p className="font-bold text-[#0b3d91]">Regulations R-2022</p>
            <p className="text-xs text-slate-600 mt-1">Autonomous curriculum aligned with AICTE model framework.</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <p className="font-bold text-[#0b3d91]">Choice Based Credit System</p>
            <p className="text-xs text-slate-600 mt-1">Flexibility to pick open electives and professional tracks.</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <p className="font-bold text-[#0b3d91]">Continuous Assessment</p>
            <p className="text-xs text-slate-600 mt-1">Robust internal evaluation and semester examinations.</p>
          </div>
        </div>
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

  return (
    <PublicPageLayout
      title="Accreditation & Approvals"
      subtitle="Recognized for Academic Rigor and Infrastructure by National Statutory Bodies"
      breadcrumbs={[{ label: 'Accreditation', to: '/accreditation' }, { label: section.toUpperCase() }]}
      subNav={subNav}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">NAAC A+</span>
          <h2 className="mt-2 text-lg font-bold text-slate-900">National Assessment and Accreditation Council</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            VCET has been accredited with 'A+' Grade by the National Assessment and Accreditation Council (NAAC) for institutional governance, research, and infrastructure.
          </p>
        </div>
        <div className="card p-6">
          <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-800">NBA</span>
          <h2 className="mt-2 text-lg font-bold text-slate-900">National Board of Accreditation</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Seven eligible undergraduate programmes (CSE, ECE, MECH, BME, etc.) are accredited by NBA under the Washington Accord framework.
          </p>
        </div>
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
