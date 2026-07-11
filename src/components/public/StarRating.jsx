export default function StarRating({ rating = 5, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari ${max}`}>
      {Array.from({ length: max }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${index < rating ? 'fill-accent' : 'fill-border'}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.77l-5.21 2.75 1-5.8-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}
