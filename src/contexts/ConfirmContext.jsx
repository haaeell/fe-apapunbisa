import { useCallback, useMemo, useRef, useState } from 'react';
import Button from '../components/common/Button';
import { ConfirmContext } from './confirmContextBase';

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options) => {
    setDialog({
      title: options?.title || 'Konfirmasi',
      message: options?.message || 'Apakah Anda yakin?',
      confirmText: options?.confirmText || 'Ya, lanjutkan',
      cancelText: options?.cancelText || 'Batal',
      variant: options?.variant || 'primary',
    });

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  function handleClose(result) {
    setDialog(null);
    resolveRef.current?.(result);
  }

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="font-heading text-lg font-bold text-dark">{dialog.title}</h2>
            <p className="mt-2 text-sm text-muted">{dialog.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => handleClose(false)}>
                {dialog.cancelText}
              </Button>
              <Button variant={dialog.variant === 'danger' ? 'accent' : 'primary'} onClick={() => handleClose(true)}>
                {dialog.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
