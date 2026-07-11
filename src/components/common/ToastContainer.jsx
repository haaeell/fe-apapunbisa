import { useToast } from '../../hooks/useToast';

const VARIANTS = {
  success: 'bg-success text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-dark text-white',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${VARIANTS[toast.variant]}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="text-white/70 hover:text-white"
            aria-label="Tutup notifikasi"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
