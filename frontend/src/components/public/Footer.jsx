import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-sm font-bold">
              {siteConfig.shortName}
            </div>
            <p className="text-sm font-semibold">{siteConfig.collegeName}</p>
          </div>
          <p className="mt-3 text-sm text-slate-400">{siteConfig.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {siteConfig.quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-slate-400 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Departments</p>
          <ul className="mt-3 space-y-2 text-sm">
            {siteConfig.departments.slice(0, 5).map((dept) => (
              <li key={dept.slug}>
                <Link to={`/departments/${dept.slug}`} className="text-slate-400 hover:text-white">
                  {dept.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/departments" className="text-slate-400 hover:text-white">
                View all departments
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>{siteConfig.contact.address}</li>
            <li>Phone: {siteConfig.contact.phone}</li>
            <li>Email: {siteConfig.contact.email}</li>
            <li>{siteConfig.contact.officeHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.collegeName}. All rights reserved.</p>
          <p>Placeholder design for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
