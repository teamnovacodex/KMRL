export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Operator' | 'Viewer';
  department: string;
  permissions: string[];
  lastLogin?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}