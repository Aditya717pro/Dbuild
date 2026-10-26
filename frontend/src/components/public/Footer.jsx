import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

function ContactIcon({ path }) {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function Footer() {
  const phoneHref = siteConfig.contact.phone.replace(/[^+\d]/g, '');

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3d91] to-[#041e42] text-sm font-black tracking-wide text-white ring-1 ring-white/10">
                {siteConfig.shortName}
              </span>
              <span>
                <span className="block text-base font-bold leading-snug text-white">
                  {siteConfig.collegeName}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {siteConfig.establishmentText} • Koramangala, Bengaluru, India
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
              {siteConfig.tagline} — <span className="font-semibold text-amber-300">{siteConfig.anniversaryText}</span>.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {siteConfig.accreditations.slice(0, 5).map((item) => (
                <span
                  key={item.code}
                  className="rounded-md border border-slate-800 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  {item.label || item.code}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Quick Links
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm lg:grid-cols-1">
              {siteConfig.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-amber-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-700" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Contact Us
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex gap-3">
                <ContactIcon path="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                <span className="leading-relaxed text-slate-400">{siteConfig.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <ContactIcon path="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                <a href={`tel:${phoneHref}`} className="text-slate-400 transition hover:text-amber-300">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <ContactIcon path="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-slate-400 transition hover:text-amber-300"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <ContactIcon path="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.73-4-2.27V7z" />
                <span className="text-slate-400">{siteConfig.contact.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.collegeName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-1.5 font-semibold text-slate-400 transition hover:text-amber-300"
          >
            Back to top
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 4l8 8h-5v8H9v-8H4l8-8z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
