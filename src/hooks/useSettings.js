import { useContext } from 'react';
import { SettingsContext } from '../contexts/settingsContextBase';

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings harus digunakan di dalam SettingsProvider');
  }

  return context;
}
