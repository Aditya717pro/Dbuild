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

  const badgeTones = {
    code: 'border-slate-300 bg-slate-50 text-slate-900',
    qs: 'border-amber-300 bg-amber-50 text-amber-900',
    the: 'border-blue-200 bg-blue-50 text-[#0b3d91]',
    abet: 'border-cyan-300 bg-cyan-50 text-cyan-900',
    sdg: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-1.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-2">
        {/* Left: HIT Branding */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            {/* HIT Crest SVG Logo */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#0b3d91] to-[#041e42] p-1.5 text-white shadow-sm transition group-hover:scale-105 sm:h-11 sm:w-11">
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

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold leading-none tracking-tight text-[#0b3d91] sm:text-xl">
                  {siteConfig.shortName}
                </span>
                <span className="hidden rounded bg-amber-50 px-1 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-amber-700 ring-1 ring-amber-200 sm:inline-block">
                  Est. 1951
                </span>
              </div>
              <h1 className="mt-0.5 truncate text-[12px] font-semibold leading-tight text-slate-800 sm:text-[13px] lg:text-sm">
                {siteConfig.collegeName}
              </h1>
              <p className="truncate text-[10px] leading-tight text-slate-500 sm:text-[11px]">
                {siteConfig.establishmentText} • Koramangala, Bengaluru, India
              </p>
            </div>
          </Link>

          {/* 75 Years of Academic Excellence Badge */}
          <div className="hidden shrink-0 border-l border-slate-200 pl-2.5 md:flex md:items-center">
            <div className="group flex items-center gap-2 rounded-lg bg-gradient-to-br from-amber-100 via-amber-50 to-white px-2.5 py-1 shadow-sm ring-1 ring-amber-300/80 transition hover:shadow-md">
              <span className="text-lg font-black leading-none text-amber-600 transition group-hover:scale-110">75</span>
              <div className="leading-tight">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-amber-900">Years</p>
                <p className="text-[9px] leading-tight text-amber-700">of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Accreditation Badges & Utility Bar */}
        <div className="flex flex-col gap-1 lg:items-end">
          {/* Top Row: Accreditations */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] leading-none">
            {siteConfig.accreditations.map((item) => (
              <div
                key={item.code}
                title={item.label}
                className={`rounded-sm border px-1.5 py-1 font-bold ${badgeTones[item.type] || badgeTones.code}`}
              >
                {item.code}
              </div>
            ))}
          </div>

          {/* Bottom Row: Quick Utility Links & ERP Login */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold tracking-wide text-[#0b3d91] sm:text-[11px]">
            <Link
              to="/career"
              className="transition hover:text-blue-800 hover:underline"
            >
              CAREER
            </Link>
            <span className="text-slate-300">|</span>

            {user ? (
              <div className="relative" ref={erpRef}>
                <button
                  type="button"
                  onClick={() => setErpOpen((v) => !v)}
                  className="flex items-center gap-1 rounded bg-[#0b3d91] px-2 py-0.5 text-[10px] font-bold text-white transition hover:bg-[#082f70] sm:text-[11px]"
                  aria-expanded={erpOpen}
                >
                  <span className="max-w-[7rem] truncate">{user.name}</span>
                  <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {erpOpen && (
                  <div
                    className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
                    role="menu"
                  >
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
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded bg-[#0b3d91] px-2 py-0.5 text-[10px] font-bold text-white transition hover:bg-[#082f70] sm:text-[11px]"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
