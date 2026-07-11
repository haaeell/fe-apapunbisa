const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-white text-dark border border-border hover:bg-background',
  accent: 'bg-accent text-white hover:brightness-95',
  ghost: 'bg-transparent text-dark hover:bg-background',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </Component>
  );
}
