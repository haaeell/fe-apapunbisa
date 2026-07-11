import { ArrowDownAZ, ArrowUpAZ, ChevronsUpDown, Search } from 'lucide-react';
import { useState } from 'react';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

function flattenValue(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(flattenValue).join(' ');
  if (typeof value === 'object') return Object.values(value).map(flattenValue).join(' ');
  return String(value);
}

function rowMatchesSearch(row, columns, query) {
  if (!query) return true;
  const normalizedQuery = query.toLowerCase();

  return columns.some((column) => flattenValue(row[column.key]).toLowerCase().includes(normalizedQuery));
}

function sortRows(rows, sortConfig) {
  if (!sortConfig.key) return rows;

  return [...rows].sort((a, b) => {
    const first = flattenValue(a[sortConfig.key]).toLowerCase();
    const second = flattenValue(b[sortConfig.key]).toLowerCase();
    const result = first.localeCompare(second, 'id', { numeric: true });

    return sortConfig.direction === 'asc' ? result : -result;
  });
}

export default function Table({ columns, data, isLoading, emptyMessage = 'Belum ada data' }) {
  const [query, setQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  const filteredRows = sortRows(
    data.filter((row) => rowMatchesSearch(row, columns, query)),
    sortConfig,
  );

  function handleSort(column) {
    if (column.sortable === false || column.key === 'actions') return;

    setSortConfig((current) => {
      if (current.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }

      return { key: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  }

  function sortIcon(column) {
    if (column.sortable === false || column.key === 'actions') return null;
    if (sortConfig.key !== column.key) return <ChevronsUpDown size={14} className="text-muted/70" />;

    return sortConfig.direction === 'asc'
      ? <ArrowDownAZ size={14} className="text-primary" />
      : <ArrowUpAZ size={14} className="text-primary" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-dark">Data Table</p>
          <p className="text-xs text-muted">
            Menampilkan {filteredRows.length} dari {data.length} data pada halaman ini
          </p>
        </div>
        <label className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter data..."
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      {filteredRows.length === 0 ? (
        <div className="px-4 py-10">
          <EmptyState title="Data tidak ditemukan" description="Coba gunakan kata kunci filter yang berbeda." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-background/70 text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={`flex items-center gap-2 ${
                        column.sortable === false || column.key === 'actions' ? 'cursor-default' : 'hover:text-dark'
                      }`}
                    >
                      {column.label}
                      {sortIcon(column)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-background/50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
