import { useEffect, useMemo, useState } from 'react';
import {
  clearAuthToken,
  getCurrentUser,
  getAuthToken,
  signin as signinRequest,
  signout as signoutRequest,
  signup as signupRequest,
  setAuthToken
} from '../services/api.js';
import AuthContext from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (getAuthToken() ? 'checking' : 'signedOut'));

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!getAuthToken()) {
        setStatus('signedOut');
        return;
      }

      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data.user);
          setStatus('signedIn');
        }
      } catch {
        clearAuthToken();
        if (isMounted) {
          setUser(null);
          setStatus('signedOut');
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function signin(credentials) {
    const data = await signinRequest(credentials);
    setAuthToken(data.token);
    setUser(data.user);
    setStatus('signedIn');
    return data.user;
  }

  async function signup(credentials) {
    const data = await signupRequest(credentials);
    setAuthToken(data.token);
    setUser(data.user);
    setStatus('signedIn');
    return data.user;
  }

  async function signout() {
    try {
      await signoutRequest();
    } finally {
      clearAuthToken();
      setUser(null);
      setStatus('signedOut');
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isChecking: status === 'checking',
      signin,
      signup,
      signout
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
