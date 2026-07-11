export default function SectionTitle({ title, description, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      <h3 className="font-heading text-base font-semibold text-dark">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
    </div>
  );
}
