import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section matching the Screenshot */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b3d91] via-[#093275] to-[#041e42] text-white">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xs border border-white/15">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Admissions Open for Academic Year 2026-27</span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
                Your Journey <br />
                <span className="text-amber-400">STARTS HERE</span>
              </h1>
              <p className="mt-4 text-lg font-medium text-blue-100 sm:text-xl">
                Building Tomorrow's Leaders.
              </p>
              <p className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
                Empowering students through cutting-edge autonomous engineering curriculum, world-class faculty, advanced industry-partnered research labs, and exceptional campus placements.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/admission/enquiry"
                  className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg hover:bg-amber-300 transition"
                >
                  Apply for Admission &rarr;
                </Link>
                <Link
                  to="/departments"
                  className="rounded-lg border-2 border-white/80 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs hover:bg-white/20 transition"
                >
                  Explore Departments
                </Link>
              </div>

              {/* Badges in hero */}
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-blue-200">
                <span className="font-semibold text-white">Accreditations:</span>
                <span className="rounded bg-white/15 px-2 py-0.5">TNEA 2723</span>
                <span className="rounded bg-white/15 px-2 py-0.5">NAAC A+</span>
                <span className="rounded bg-white/15 px-2 py-0.5">NBA (7 Depts)</span>
                <span className="rounded bg-white/15 px-2 py-0.5">Anna Univ Autonomous</span>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl">
                <h2 className="text-base font-bold text-amber-300 uppercase tracking-wider">
                  VCET Highlights
                </h2>
                <div className="mt-4 space-y-4 text-xs">
                  <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-bold text-white text-sm">25 Years of Excellence</p>
                      <p className="text-blue-100">Serving technical education since 2001 with 15,000+ graduates.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-bold text-white text-sm">92%+ Placement Record</p>
                      <p className="text-blue-100">Top recruitments in Zoho, TCS, Cognizant, Wipro, and Qualcomm.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <span className="text-2xl">🔬</span>
                    <div>
                      <p className="font-bold text-white text-sm">Recognized Research Centres</p>
                      <p className="text-blue-100">Approved by Anna University with AICTE IDEA Lab prototyping.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/15 pt-4 flex items-center justify-between text-xs">
                  <span className="text-blue-200">Need Guidance?</span>
                  <Link to="/contact" className="font-bold text-amber-300 hover:underline">
                    Contact Admission Desk &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Stats Bar */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-[#0b3d91] sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b3d91]">
              Academic Programs
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Academic Departments
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Each department features dedicated tabs for Faculty, Labs, Syllabus, and Activities.
            </p>
          </div>
          <Link
            to="/departments"
            className="text-xs font-bold text-[#0b3d91] hover:underline"
          >
            View All 12 Departments &rarr;
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.departments.map((dept) => (
            <Link
              key={dept.slug}
              to={`/departments/${dept.slug}`}
              className="group card p-5 transition hover:-translate-y-1 hover:border-[#0b3d91] hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-extrabold text-[#0b3d91] border border-blue-100">
                  {dept.code}
                </span>
                {dept.nba && (
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
                    NBA Accredited
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-[#0b3d91] transition">
                {dept.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {dept.category} • B.E. / B.Tech Autonomous
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#0b3d91]">
                <span>View Department Tabs</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Access Pillars */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <span className="text-2xl">🎓</span>
              <h3 className="mt-2 text-base font-bold text-[#0b3d91]">Autonomous Academics</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Autonomous curriculum under CBCS system with industry-tailored syllabi, continuous assessment, and Anna University degree award.
              </p>
              <Link to="/academics" className="mt-3 inline-block text-xs font-bold text-[#0b3d91] hover:underline">
                Read Regulations &rarr;
              </Link>
            </div>

            <div className="card p-6">
              <span className="text-2xl">💼</span>
              <h3 className="mt-2 text-base font-bold text-[#0b3d91]">Career & Placements</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Dedicated Training & Placement Cell providing aptitude, soft-skill, and coding bootcamps with 100% placement facilitation.
              </p>
              <Link to="/career-development" className="mt-3 inline-block text-xs font-bold text-[#0b3d91] hover:underline">
                Placement Records &rarr;
              </Link>
            </div>

            <div className="card p-6">
              <span className="text-2xl">💡</span>
              <h3 className="mt-2 text-base font-bold text-[#0b3d91]">Innovation & Research</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                4-Star IIC Innovation Council, AICTE IDEA Lab, and Startup TN pre-incubation centre supporting student patents and projects.
              </p>
              <Link to="/innovation" className="mt-3 inline-block text-xs font-bold text-[#0b3d91] hover:underline">
                Explore Innovations &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
