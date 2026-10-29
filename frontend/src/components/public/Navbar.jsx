import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const navRef = useRef(null);
  const location = useLocation();

  // Close dropdown on route change or click outside
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function toggleDropdown(label) {
    setActiveDropdown((prev) => (prev === label ? null : label));
  }

  function toggleMobileSection(label) {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }

  return (
    <>
      {/* Sticky Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0b3d91] shadow-md border-t border-blue-900/40" ref={navRef}>
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex h-11 items-center justify-center">
            {/* Desktop Navigation Links */}
            <nav className="hidden min-w-0 lg:flex lg:flex-nowrap lg:items-center lg:gap-0 xl:gap-0.5 2xl:gap-1 text-[10px] xl:text-[11px] 2xl:text-[12px] font-bold text-white tracking-wide">
              {siteConfig.navItems.map((item) => {
                // Home Icon button
                if (item.isHome) {
                  return (
                    <NavLink
                      key="home"
                      to="/"
                      className={({ isActive }) =>
                        `flex items-center justify-center rounded px-1.5 py-1 transition ${
                          isActive
                            ? 'bg-[#06265e] text-amber-300'
                            : 'text-white/95 hover:bg-white/15 hover:text-white'
                        }`
                      }
                      title="Home"
                      aria-label="Home"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
                      </svg>
                    </NavLink>
                  );
                }

                // Mega-dropdown for DEPARTMENTS
                if (item.isMega) {
                  const isOpen = activeDropdown === item.label;
                  const isSectionActive = location.pathname.startsWith('/departments');
                  return (
                    <div
                      key={item.label}
                      className="relative flex items-center"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.label)}
                        className={`flex items-center gap-1 rounded px-1.5 py-1 transition uppercase text-[10px] xl:text-[11px] 2xl:text-[12px] ${
                          isOpen || isSectionActive
                            ? 'bg-[#06265e] text-amber-300'
                            : 'text-white/95 hover:bg-white/15 hover:text-white'
                        }`}
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${item.label} menu`}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`h-2.5 w-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div
                          className="absolute left-0 top-full z-50 mt-0.5 w-[760px] max-w-[calc(100vw-2rem)] rounded-b-xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl ring-1 ring-black/10"
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-[#0b3d91]">
                              Academic Departments
                            </h3>
                            <p className="text-xs text-slate-500">
                              Select a department to view details
                            </p>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                            {siteConfig.departments.map((dept) => (
                              <Link
                                key={dept.slug}
                                to={`/departments/${dept.slug}`}
                                className="group flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-50 hover:text-[#0b3d91]"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-11 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-[#0b3d91] group-hover:bg-[#0b3d91] group-hover:text-white transition">
                                    {dept.code}
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-[#0b3d91]">
                                    {dept.name}
                                  </span>
                                </div>
                                {dept.accredited && (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700 border border-emerald-200">
                                    Accredited
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular dropdown tabs (ABOUT, ADMISSION, ACADEMICS, etc.)
                if (item.hasDropdown) {
                  const isOpen = activeDropdown === item.label;
                  const isSectionActive = location.pathname.startsWith(item.to);
                  return (
                    <div
                      key={item.label}
                      className="relative flex items-center"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setActiveDropdown(null)}
                        className={`flex items-center rounded-l px-1 py-1 transition uppercase text-[10px] xl:text-[11px] 2xl:text-[12px] ${
                          isOpen || isSectionActive
                            ? 'bg-[#06265e] text-amber-300'
                            : 'text-white/95 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.label)}
                        className={`flex items-center rounded-r py-1 pl-0.5 pr-1.5 transition ${
                          isOpen || isSectionActive
                            ? 'bg-[#06265e] text-amber-300'
                            : 'text-white/95 hover:bg-white/15 hover:text-white'
                        }`}
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${item.label} menu`}
                      >
                        <svg
                          className={`h-2.5 w-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        item.label === 'ADMISSION' ? (
                          <div
                            className="absolute left-0 top-full z-50 mt-0.5 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-b-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl ring-1 ring-black/10"
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            <p className="px-2 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600">
                              Admissions 2026-27
                            </p>

                            <div className="space-y-1.5">
                              <Link
                                to="/admission/ug"
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-center gap-3 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white px-3 py-2.5 transition hover:border-[#0b3d91]/30 hover:from-blue-50 hover:shadow-sm"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#0b3d91] to-[#06265e] text-[9px] font-black tracking-wide text-white shadow-sm">
                                  UG
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-extrabold text-slate-900 group-hover:text-[#0b3d91]">
                                    Undergraduate
                                  </span>
                                  <span className="block text-[10px] font-medium text-slate-500">
                                    B.E. / B.Tech · 4 Years
                                  </span>
                                </span>
                                <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0b3d91]">
                                  &rarr;
                                </span>
                              </Link>

                              <Link
                                to="/admission/pg"
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-center gap-3 rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50/80 to-white px-3 py-2.5 transition hover:border-amber-300 hover:from-amber-50 hover:shadow-sm"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-500 text-[9px] font-black tracking-wide text-slate-900 shadow-sm">
                                  PG
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-extrabold text-slate-900 group-hover:text-amber-700">
                                    Postgraduate
                                  </span>
                                  <span className="block text-[10px] font-medium text-slate-500">
                                    M.E. / MBA · 2 Years
                                  </span>
                                </span>
                                <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600">
                                  &rarr;
                                </span>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="absolute left-0 top-full z-50 mt-0.5 w-64 rounded-b-lg border border-slate-200 bg-white py-2 text-slate-800 shadow-xl ring-1 ring-black/10"
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            {item.children?.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                className="block px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0b3d91]"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  );
                }

                // Direct nav link (FACULTY DETAILS, etc.)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded px-1 py-1 transition uppercase text-[10px] xl:text-[11px] 2xl:text-[12px] ${
                        isActive
                          ? 'bg-[#06265e] text-amber-300'
                          : 'text-white/95 hover:bg-white/15 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Header elements */}
            <div className="flex w-full items-center justify-between lg:hidden">
              <span className="text-xs font-bold text-white tracking-wide">
                MAIN MENU
              </span>
              <button
                type="button"
                className="rounded-md p-1.5 text-white hover:bg-white/15 focus:outline-none"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-blue-900 bg-[#082e6d] px-4 py-3 lg:hidden text-white">
            <div className="flex flex-col gap-1 text-sm font-medium">
              <NavLink
                to="/"
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                🏠 Home
              </NavLink>

              {siteConfig.navItems.map((item) => {
                if (item.isHome) return null;

                // Department mega list in mobile
                if (item.isMega) {
                  const isExpanded = mobileExpanded[item.label];
                  return (
                    <div key={item.label} className="border-b border-white/10 pb-1">
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.label)}
                        className="flex w-full items-center justify-between rounded px-3 py-2 text-left font-bold text-amber-200 hover:bg-white/10"
                      >
                        <span>{item.label}</span>
                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-white/20 pl-2">
                          {siteConfig.departments.map((dept) => (
                            <Link
                              key={dept.slug}
                              to={`/departments/${dept.slug}`}
                              className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-white/90 hover:bg-white/10"
                              onClick={() => setMobileOpen(false)}
                            >
                              <span>{dept.name}</span>
                              {dept.accredited && (
                                <span className="rounded bg-emerald-600/80 px-1 text-[9px] text-white">Accredited</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.hasDropdown) {
                  const isExpanded = mobileExpanded[item.label];
                  return (
                    <div key={item.label} className="border-b border-white/10 pb-1">
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.label)}
                        className="flex w-full items-center justify-between rounded px-3 py-2 text-left font-bold text-white hover:bg-white/10"
                      >
                        <span>{item.label}</span>
                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-white/20 pl-2">
                          {item.children?.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              className="rounded px-2 py-1.5 text-xs text-white/90 hover:bg-white/10"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="rounded px-3 py-2 text-white hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              <div className="mt-3 border-t border-white/20 pt-3 text-xs">
                <p className="px-3 font-semibold uppercase tracking-wider text-amber-300">Quick Links</p>
                <div className="mt-1 flex flex-col gap-1">
                  <Link to="/career" className="rounded px-3 py-1.5 text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Career</Link>
                  <Link to="/login/student" className="rounded px-3 py-1.5 font-bold text-amber-300 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Student Portal Login</Link>
                  <Link to="/login/teacher" className="rounded px-3 py-1.5 font-bold text-amber-300 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Teacher Portal Login</Link>
                  <Link to="/login/admin" className="rounded px-3 py-1.5 font-bold text-amber-300 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Admin Portal Login</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Vertical "Admission" Side Badge on right edge (as seen in screenshot) */}
      <Link
        to="/admission/ug"
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-md bg-[#0b3d91] px-2 py-4 text-xs font-extrabold uppercase tracking-widest text-white shadow-2xl transition hover:bg-[#082f70] hover:px-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
        title="Apply for Admission"
      >
        <span className="flex items-center gap-2">
          <span>Admission</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"></span>
        </span>
      </Link>
    </>
  );
}
