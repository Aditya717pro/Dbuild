import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { siteConfig } from '../../config/siteConfig.js';

export default function TopBar() {
  const { user, logout } = useAuth();
  const [erpOpen, setErpOpen] = useState(false);
  const erpRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (erpRef.current && !erpRef.current.contains(event.target)) {
        setErpOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setErpOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleLogout() {
    logout();
    setErpOpen(false);
    navigate('/', { replace: true });
  }

  function getDashboardPath(role) {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'faculty') return '/faculty/dashboard';
    return '/student/dashboard';
  }

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-3">
        {/* Left: VCET Branding */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-3">
            {/* VCET Crest SVG Logo */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0b3d91] to-[#041e42] p-2 text-white shadow-md transition group-hover:scale-105">
              <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" aria-hidden="true">
                {/* Shield Outline */}
                <path
                  d="M20 2L6 8V19C6 27.5 12 35 20 38C28 35 34 27.5 34 19V8L20 2Z"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="#0b3d91"
                />
                {/* Open Book */}
                <path
                  d="M13 18C15 16.5 18 16.8 20 18C22 16.8 25 16.5 27 18V26C25 24.5 22 24.8 20 26C18 24.8 15 24.5 13 26V18Z"
                  fill="#ffffff"
                />
                {/* Torch / Flame */}
                <path
                  d="M20 9C20 9 22 12 21 14C20.5 15 19.5 15 19 14C18 12 20 9 20 9Z"
                  fill="#f59e0b"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0b3d91] sm:text-2xl">
                  {siteConfig.shortName}
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-amber-700 sm:inline-block">
                  Autonomous
                </span>
              </div>
              <h1 className="text-sm font-bold leading-tight text-slate-800 sm:text-base lg:text-lg">
                {siteConfig.collegeName}
              </h1>
              <p className="text-xs font-medium text-slate-500">
                {siteConfig.autonomousText} • Affiliated to Anna University, Chennai
              </p>
            </div>
          </Link>

          {/* 25 Years of Academic Excellence Badge */}
          <div className="hidden border-l border-slate-200 pl-3 md:flex md:items-center">
            <div className="flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200/60 shadow-sm">
              <span className="text-base">🏆</span>
              <div className="leading-tight">
                <p className="font-bold">25 Years</p>
                <p className="text-[10px] text-amber-700">of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Accreditation Badges & Utility Bar */}
        <div className="mt-3 flex flex-col items-start gap-2.5 lg:mt-0 lg:items-end">
          {/* Top Row: Accreditations */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* TNEA Code Badge */}
            <div className="flex items-center gap-1 rounded border-2 border-slate-800 bg-slate-50 px-2 py-0.5 font-bold tracking-tight text-slate-900 shadow-xs">
              <span className="text-[10px] uppercase text-slate-600">TNEA CODE</span>
              <span className="text-sm text-[#0b3d91]">{siteConfig.tneaCode}</span>
            </div>

            {/* NIRF Badge */}
            <div className="flex items-center rounded border border-blue-200 bg-blue-50/70 px-2 py-0.5 font-semibold text-blue-900 shadow-xs">
              <span className="font-extrabold text-[#0b3d91]">nirf</span>
            </div>

            {/* NAAC A+ Badge */}
            <div className="flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-950 shadow-xs">
              <span className="rounded-full bg-amber-500 px-1 text-[10px] text-white">A+</span>
              <span>NAAC</span>
            </div>

            {/* NBA Badge */}
            <div className="flex items-center rounded border border-cyan-300 bg-cyan-50 px-2 py-0.5 font-bold text-cyan-950 shadow-xs">
              <span>NBA</span>
            </div>

            {/* IIC Badge */}
            <div className="hidden sm:flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-900 shadow-xs">
              <span>IIC</span>
              <span className="text-amber-500 text-[10px]">★★★★</span>
            </div>

            {/* SDGs Badge */}
            <div className="hidden md:flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 shadow-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-tr from-green-500 to-teal-400"></span>
              <span>SDGs</span>
            </div>
          </div>

          {/* Bottom Row: Quick Utility Links & ERP Login */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-wide text-[#0b3d91]">
            <Link
              to="/hall-reservation"
              className="transition hover:text-blue-800 hover:underline"
            >
              HALL RESERVATION
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/career"
              className="transition hover:text-blue-800 hover:underline"
            >
              CAREER
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/online-fee"
              className="transition hover:text-blue-800 hover:underline"
            >
              ON-LINE FEE
            </Link>
            <span className="text-slate-300">|</span>

            {/* ERP - LOGIN Dropdown */}
            <div className="relative" ref={erpRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setErpOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-md bg-[#0b3d91] px-2.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-[#082f70]"
                  aria-expanded={erpOpen}
                >
                  <span>{user.name}</span>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setErpOpen((v) => !v)}
                  className="flex items-center gap-1 rounded bg-[#0b3d91] px-2.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-[#082f70]"
                  aria-expanded={erpOpen}
                >
                  <span>ERP - LOGIN</span>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {erpOpen && (
                <div
                  className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
                  role="menu"
                >
                  {user ? (
                    <>
                      <div className="border-b border-slate-100 px-3 py-1.5 text-xs text-slate-500">
                        Signed in as <span className="font-semibold text-slate-800">{user.role}</span>
                      </div>
                      <Link
                        to={getDashboardPath(user.role)}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0b3d91]"
                        onClick={() => setErpOpen(false)}
                      >
                        📊 Open Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="border-b border-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Portal Login
                      </div>
                      <Link
                        to="/login/student"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0b3d91]"
                        onClick={() => setErpOpen(false)}
                      >
                        🎓 Student Login
                      </Link>
                      <Link
                        to="/login/faculty"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0b3d91]"
                        onClick={() => setErpOpen(false)}
                      >
                        👨‍🏫 Faculty Login
                      </Link>
                      <div className="border-t border-slate-100" />
                      <Link
                        to="/admin/login"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setErpOpen(false)}
                      >
                        🛡️ Admin Portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
