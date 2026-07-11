export default function SectionHeading({ label, title, description, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {label && (
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          {label}
        </span>
      )}
      {title && (
        <h2 className="font-heading text-3xl font-bold tracking-tight text-dark sm:text-4xl">{title}</h2>
      )}
      {description && <p className="text-muted">{description}</p>}
    </div>
  );
}
