import { percentTone } from '../utils/format.js';

export default function AttendanceBar({ percentage }) {
  const value = percentage === null || percentage === undefined ? 0 : Math.min(100, Math.max(0, percentage));
  const label = percentage === null || percentage === undefined ? 'No classes recorded' : `${percentage}%`;

  return (
    <div className="w-full min-w-[8rem]">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        {percentage !== null && percentage !== undefined && percentage < 75 && (
          <span className="font-medium text-rose-600">Below 75%</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${percentTone(percentage)}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
