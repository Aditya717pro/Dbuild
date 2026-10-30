export function formatDate(value, { withTime = false } = {}) {
  if (!value) return '—';
  const dateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(dateOnly ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

export function audienceLabel(announcement) {
  if (announcement.audience === 'department') {
    return `Department · ${announcement.department_name || 'Unknown'}`;
  }
  if (announcement.audience === 'course') {
    return `Course · ${announcement.course_code || 'Unknown'}`;
  }
  return 'All users';
}

export function percentTone(percentage) {
  if (percentage === null || percentage === undefined) return 'bg-slate-300';
  if (percentage >= 75) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}
