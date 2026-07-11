import { useContext } from 'react';
import { ConfirmContext } from '../contexts/confirmContextBase';

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm harus digunakan di dalam ConfirmProvider');
  }

  return context.confirm;
}
