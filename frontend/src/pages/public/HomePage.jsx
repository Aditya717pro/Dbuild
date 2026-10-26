import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';
import campus1 from '../../assets/campus-1.jpg';
import campus2 from '../../assets/campus-2.jpg';
import campus3 from '../../assets/campus-3.jpg';

const campusSlides = [
  { src: campus1, alt: 'College campus building', label: 'College' },
  { src: campus2, alt: 'Students on campus', label: 'Students' },
  { src: campus3, alt: 'College library', label: 'Library' },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % campusSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        {campusSlides.map((slide, index) => (
          <img
            key={slide.label}
            src={slide.src}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-50" />

        <div
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none text-[16rem] font-black leading-none text-white/[0.05] xl:block"
          aria-hidden="true"
        >
          75
        </div>

        <div className="relative mx-auto flex min-h-[30rem] max-w-7xl items-center px-4 pb-28 pt-16 sm:min-h-[34rem] sm:px-6 sm:pb-36 sm:pt-24 lg:pb-44 lg:pt-28">
          <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur">
                  <span className="text-2xl font-black leading-none text-amber-300">75</span>
                  <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-amber-100">
                    Years of<br />Excellence
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur">
                  <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Admissions Open for Academic Year 2026-27</span>
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Journey <br />
                <span className="text-amber-400">STARTS HERE</span>
              </h1>
              <p className="mt-4 text-lg font-medium text-blue-100 sm:text-xl">
                Building Tomorrow's Leaders Since 1951.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">
                A future-focused engineering education, world-class faculty, advanced research labs, and a global alumni network — built on 75 years of academic excellence in Bengaluru.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/admission/ug"
                  className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300"
                >
                  Apply for Admission &rarr;
                </Link>
                <Link
                  to="/departments"
                  className="rounded-lg border-2 border-white/70 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Explore Departments
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Stats Bar */}
      <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:-mt-24 sm:px-6">
        <div className="pointer-events-none absolute inset-x-10 -top-8 h-24 rounded-full bg-[#0b3d91]/25 blur-3xl" aria-hidden="true" />
        <div className="relative grid grid-cols-2 gap-4 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:grid-cols-4 sm:p-6">
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
        <Link
          to="/departments"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b3d91] via-[#0a347c] to-[#041e42] p-7 text-white shadow-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:p-9 lg:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" aria-hidden="true" />

          <div className="relative">
            <div>
              <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                Academic Departments
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                Explore {siteConfig.departments.length} future-focused departments
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
                From computing and AI to electronics, mechanical, civil, and management — discover the programme that fits your ambition.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-slate-900 shadow-lg transition group-hover:bg-amber-300">
                View all departments
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Access Pillars */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <span className="text-2xl">🎓</span>
              <h3 className="mt-2 text-base font-bold text-[#0b3d91]">Future-Ready Academics</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                A flexible credit framework with industry-tailored syllabi, continuous assessment, and a globally recognised degree.
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
                An award-winning Innovation Council, IDEA Lab, and startup incubator supporting student patents, prototypes, and ventures.
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
