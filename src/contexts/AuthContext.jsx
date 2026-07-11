import { useEffect, useState } from 'react';
import * as authApi from '../api/authApi';
import { getToken, setToken as persistToken, clearToken } from '../utils/tokenStorage';
import { AuthContext } from './authContextBase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    let isMounted = true;

    authApi
      .fetchProfile()
      .then(({ data }) => {
        if (isMounted) setUser(data);
      })
      .catch(() => {
        clearToken();
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(credentials) {
    const { data } = await authApi.login(credentials);
    persistToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      setUser(null);
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
