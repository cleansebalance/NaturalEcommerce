import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo user
const DEMO_USER = {
  id: 1,
  email: 'user@example.com',
  name: 'Demo User',
  role: 'user' as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for saved auth on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('harmony_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setState({
          user: parsedAuth.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse saved auth:', error);
        localStorage.removeItem('harmony_auth');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we're simulating a successful login
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === 'demo@example.com' && password === 'password') {
      const user = DEMO_USER;
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('harmony_auth', JSON.stringify({ user }));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we're simulating a successful registration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = {
      id: 1,
      email,
      name,
      role: 'user' as const,
    };
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    localStorage.setItem('harmony_auth', JSON.stringify({ user }));
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('harmony_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}