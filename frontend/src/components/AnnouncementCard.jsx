import { audienceLabel, formatDate } from '../utils/format.js';

export default function AnnouncementCard({ announcement, canDelete, onDelete }) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{announcement.title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {announcement.posted_by_name || 'Unknown author'} · {formatDate(announcement.created_at, { withTime: true })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-indigo-50 text-indigo-700">{audienceLabel(announcement)}</span>
          {canDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(announcement)}>
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{announcement.body}</p>
    </article>
  );
}
