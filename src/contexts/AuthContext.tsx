import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, isAuthenticated: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, error: null };
    case 'RESTORE_SESSION':
      return { ...state, isAuthenticated: true, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Restore session on app load
    const user = authService.getCurrentUser();
    if (user) {
      dispatch({ type: 'RESTORE_SESSION', payload: user });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    const result = await authService.login(credentials);
    
    if (result.success && result.user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
      return { success: true };
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: result.error || 'Login failed' });
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (permission: string) => {
    return authService.hasPermission(permission);
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};