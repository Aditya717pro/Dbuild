import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

export default function PageLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    setVisible(true);
    setLeaving(false);
    const fadeTimer = setTimeout(() => setLeaving(true), 600);
    const hideTimer = setTimeout(() => setVisible(false), 900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className={`pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        aria-hidden="true"
      />

      <div
        className="absolute -left-24 -top-20 h-80 w-80 animate-loader-blob rounded-full bg-blue-500/30 blur-3xl"
        style={{ animationDelay: '-1.5s' }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 top-1/4 h-96 w-96 animate-loader-blob rounded-full bg-amber-400/20 blur-3xl"
        style={{ animationDelay: '-3.5s' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 left-1/3 h-80 w-80 animate-loader-blob rounded-full bg-blue-600/25 blur-3xl"
        style={{ animationDelay: '-5s' }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-white/10">
        <div className="h-full w-1/3 animate-hit-progress rounded-full bg-gradient-to-r from-[#0b3d91] via-sky-500 to-amber-400" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="absolute -inset-2 animate-loader-spin rounded-[2rem] opacity-80 blur-[3px]"
            style={{
              background:
                'conic-gradient(from 0deg, #0b3d91, #0284c7, #fbbf24, #0b3d91)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -inset-6 animate-loader-spin rounded-full bg-gradient-to-r from-blue-500/30 via-sky-400/20 to-amber-400/20 blur-2xl"
            style={{ animationDirection: 'reverse' }}
            aria-hidden="true"
          />

          <div className="relative flex items-center gap-2.5 rounded-[1.75rem] border border-white/20 bg-slate-950/60 p-3.5 shadow-2xl backdrop-blur-2xl">
            {siteConfig.shortName.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="flex h-14 w-14 animate-loader-letter items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b3d91] to-[#041e42] text-2xl font-black text-white shadow-xl shadow-blue-900/40 ring-1 ring-amber-300/30"
                style={{ animationDelay: `${index * 130}ms` }}
              >
                {letter}
              </span>
            ))}
            <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-amber-400 ring-4 ring-[#0b3d91]/60" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-amber-200">Loading</p>
          <p className="mt-2 text-sm font-extrabold text-white">{siteConfig.collegeName}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
            {siteConfig.establishmentText} • Bengaluru
          </p>
        </div>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/3 animate-hit-progress rounded-full bg-gradient-to-r from-[#0b3d91] via-sky-500 to-amber-400" />
        </div>
      </div>
    </div>
  );
}
