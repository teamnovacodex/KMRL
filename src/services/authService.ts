import { User, LoginCredentials } from '../types/auth';

// Mock users for demonstration
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@kmrl.co.in',
    role: 'Admin',
    department: 'Operations Control Center',
    permissions: ['view_all', 'edit_all', 'run_optimization', 'manage_users', 'export_data'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    username: 'supervisor',
    password: 'super123',
    email: 'supervisor@kmrl.co.in',
    role: 'Supervisor',
    department: 'Train Operations',
    permissions: ['view_all', 'edit_trains', 'run_optimization', 'override_decisions'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    username: 'operator',
    password: 'oper123',
    email: 'operator@kmrl.co.in',
    role: 'Operator',
    department: 'Depot Operations',
    permissions: ['view_trains', 'update_status', 'view_reports'],
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    username: 'viewer',
    password: 'view123',
    email: 'viewer@kmrl.co.in',
    role: 'Viewer',
    department: 'Management',
    permissions: ['view_dashboard', 'view_reports'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
];

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('kmrl_user', JSON.stringify(this.currentUser));
      localStorage.setItem('kmrl_token', 'mock_jwt_token_' + Date.now());
      
      return { success: true, user: this.currentUser };
    }

    return { success: false, error: 'Invalid username or password' };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('kmrl_user');
    localStorage.removeItem('kmrl_token');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('kmrl_user');
    const storedToken = localStorage.getItem('kmrl_token');
    
    if (storedUser && storedToken) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }
}

export const authService = new AuthService();