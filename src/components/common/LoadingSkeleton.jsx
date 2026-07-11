export default function LoadingSkeleton({ rows = 5, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} aria-busy="true" aria-label="Memuat data">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 w-full animate-pulse rounded-lg bg-border/60" />
      ))}
    </div>
  );
}
