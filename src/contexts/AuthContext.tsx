import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../lib/mockApi';

// Simulate a Supabase Session object structure
interface MockSession {
  user: User;
  token: string;
}

interface AuthContextType {
  session: MockSession | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
  signIn: (email: string, pass: string) => Promise<{error?: {message: string}}>;
  signUp: (name: string, email: string, pass: string) => Promise<{error?: {message: string}}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<MockSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const { role } = await mockApi.getUserRole(currentUser.id);
    setIsAdmin(role === 'admin');
  };

  // This effect runs once on startup to check for an existing session
  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data } = await mockApi.getSession();
        const currentSession = data.session as MockSession | null;
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        await checkAdminRole(currentUser);
      } catch (error) {
        console.error("Falha ao inicializar a sessão mock:", error);
      } finally {
        setLoading(false);
      }
    };
    getSessionAndProfile();
  }, []);

  const updateAuthState = async (newSession: MockSession | null) => {
    setSession(newSession);
    const currentUser = newSession?.user ?? null;
    setUser(currentUser);
    await checkAdminRole(currentUser);
  };

  const signIn = async (email: string, pass: string) => {
    const { data, error } = await mockApi.signInWithPassword(email, pass);
    if (error) return { error };
    
    const newSession = data.session as MockSession;
    await updateAuthState(newSession);
    navigate('/dashboard');
    return {};
  };

  const signUp = async (name: string, email: string, pass: string) => {
      const { error } = await mockApi.signUp(name, email, pass);
      if (error) return { error };
      return {};
  };

  const signOut = async () => {
    await mockApi.signOut();
    await updateAuthState(null);
    navigate('/');
  };

  const value = {
    session,
    user,
    isAdmin,
    loading,
    signOut,
    signIn,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
