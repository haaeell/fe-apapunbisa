export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: currentPage, last_page: lastPage, total } = meta;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (page) => page === 1 || page === lastPage || Math.abs(page - currentPage) <= 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 text-sm text-muted">
      <span>
        Halaman {currentPage} dari {lastPage} ({total} data)
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>

        {pages.map((page, index) => {
          const prevPage = pages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 rounded-lg ${
                  page === currentPage ? 'bg-primary text-white' : 'border border-border hover:bg-background'
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
