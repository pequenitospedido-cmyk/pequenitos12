import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  mode: 'DEMO' | 'SUPABASE';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithSupabase: (email: string, password: string) => Promise<{ error?: string }>;
  enterDemoSession: (email?: string) => void;
  signOut: () => Promise<void>;
}

const DEMO_AUTH_STORAGE_KEY = 'pequenitos_admin_demo_session_v1';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (isConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || 'admin@pequenitos.co',
            mode: 'SUPABASE',
          });
        }
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'admin@pequenitos.co',
            mode: 'SUPABASE',
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    } else {
      // Check local DEMO session
      try {
        const saved = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch {
        // Ignore storage error
      }
      setLoading(false);
    }
  }, [isConfigured]);

  const signInWithSupabase = async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    if (!isConfigured || !supabase) {
      return {
        error:
          'Variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no detectadas. Usa el acceso en Modo DEMO mientras conectas tu proyecto Supabase.',
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        mode: 'SUPABASE',
      });
    }

    return {};
  };

  const enterDemoSession = (email: string = 'admin@pequenitos.co') => {
    const demoUser: AdminUser = {
      id: 'demo-admin',
      email: email.trim() || 'admin@pequenitos.co',
      mode: 'DEMO',
    };
    setUser(demoUser);
    try {
      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    } catch {
      // Ignore storage error
    }
  };

  const signOut = async () => {
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
    try {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signInWithSupabase,
        enterDemoSession,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de un AdminAuthProvider');
  }
  return ctx;
};
