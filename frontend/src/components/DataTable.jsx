import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from './States.jsx';

export default function DataTable({
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  filters = [],
  actions,
  pageSize = 8,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your search or filters.',
}) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);

  const safeRows = useMemo(() => rows || [], [rows]);

  useEffect(() => {
    setPage(1);
  }, [query, filterValues]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return safeRows.filter((row) => {
      const matchesSearch =
        !term ||
        searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(term));

      if (!matchesSearch) return false;

      return filters.every((filter) => {
        const selected = filterValues[filter.key];
        if (!selected) return true;
        return String(row[filter.key] ?? '') === String(selected);
      });
    });
  }, [safeRows, query, searchKeys, filters, filterValues]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const hasToolbar = searchKeys.length > 0 || filters.length > 0;

  return (
    <div className="card overflow-hidden">
      {hasToolbar && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchKeys.length > 0 && (
            <div className="relative w-full sm:max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
              </span>
              <input
                type="search"
                className="input pl-9"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <select
                  key={filter.key}
                  className="input w-auto min-w-[9rem]"
                  value={filterValues[filter.key] || ''}
                  onChange={(event) =>
                    setFilterValues((prev) => ({ ...prev, [filter.key]: event.target.value }))
                  }
                  aria-label={filter.label}
                >
                  <option value="">{filter.label}: All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} message={safeRows.length === 0 ? emptyMessage : 'No rows match the current search or filters.'} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col" className="th">
                      {column.label}
                    </th>
                  ))}
                  {actions && <th className="th text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {visible.map((row, index) => (
                  <tr key={row.id ?? row.user_id ?? index} className="transition hover:bg-slate-50">
                    {columns.map((column) => (
                      <td key={column.key} className={column.className || 'td'}>
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="td text-right">
                        <div className="flex items-center justify-end gap-1.5">{actions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing {filtered.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Page {currentPage} of {pageCount}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={currentPage >= pageCount}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
