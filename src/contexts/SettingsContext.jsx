import { useEffect, useState } from 'react';
import { fetchPublicSettings } from '../api/publicSettingApi';
import { SettingsContext } from './settingsContextBase';

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPublicSettings()
      .then(({ data }) => {
        if (isMounted) setSettings(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return <SettingsContext.Provider value={{ settings, isLoading }}>{children}</SettingsContext.Provider>;
}
