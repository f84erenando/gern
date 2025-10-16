import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User, AuthApiError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    try {
      // Changed from .from('profiles').select() to an RPC call to avoid RLS recursion.
      const { data, error } = await supabase.rpc('get_my_role');

      if (error) {
        console.error("Erro ao buscar role do usuário via RPC:", error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data === 'admin');

    } catch (error) {
      console.error("Erro inesperado ao verificar role de admin:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        await checkAdminRole(currentUser);
      } catch (error) {
        if (error instanceof AuthApiError && error.message === 'Invalid Refresh Token: Refresh Token Not Found') {
          // This is normal for a logged-out user, no need to log an error.
        } else {
          console.error("Falha inesperada ao inicializar a sessão de autenticação:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdminRole(currentUser);

      if (_event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
      if (_event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    isAdmin,
    signOut,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
