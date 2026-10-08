import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Database, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { user, loading, isConfigured, signInWithSupabase, enterDemoSession } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('pequenitospedido@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await signInWithSupabase(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/admin');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterDemo = () => {
    enterDemoSession(email || 'pequenitospedido@gmail.com');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
          Panel Administrativo CMS
        </h1>
        <p className="text-xs sm:text-sm text-[#6E685F]">
          Gestiona productos, fotografías, categorías, inicio e identidad de marca sin tocar el
          código.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xs rounded-3xl border border-black/6 sm:px-10 space-y-6">
          {/* Status Indicator */}
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
              isConfigured
                ? 'bg-[#ECF9F4] text-[#2D2A26] border border-[#53C59B]/30'
                : 'bg-[#EBF5FD] text-[#2D2A26] border border-[#4FA6EE]/25'
            }`}
          >
            <Database className="w-4 h-4 text-[#4FA6EE] shrink-0 mt-0.5" />
            <div>
              {isConfigured ? (
                <span>
                  <strong>Supabase Conectado:</strong> Inicia sesión con las credenciales de tu
                  cuenta en Supabase Auth.
                </span>
              ) : (
                <span>
                  <strong>Modo DEMO Activo:</strong> Las variables{' '}
                  <code className="font-mono text-[11px]">VITE_SUPABASE_URL</code> aún no están
                  configuradas. Puedes entrar directamente al CMS en modo DEMO interactivo.
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-[#FEF1EF] border border-[#F48B7B]/30 text-xs text-[#2D2A26]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSupabaseLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">
                Correo del administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required={isConfigured}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pequenitos.co"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">
                Contraseña (Supabase Auth)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required={isConfigured}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>
            </div>

            {isConfigured && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{submitting ? 'Verificando...' : 'Iniciar sesión con Supabase'}</span>
                <ArrowRight className="w-4 h-4 text-[#FACC48]" />
              </button>
            )}
          </form>

          {!isConfigured && (
            <div className="pt-2 border-t border-black/6 space-y-3">
              <button
                type="button"
                onClick={handleEnterDemo}
                className="w-full py-3.5 px-5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#FACC48]" />
                <span>Entrar al Administrador (Modo DEMO)</span>
              </button>
              <p className="text-[11px] text-[#6E685F] text-center leading-relaxed">
                Sin contraseñas hardcodeadas. Cuando agregues tus claves de Supabase en Netlify o{' '}
                <code>.env</code>, este acceso requerirá autenticación real mediante Supabase Auth.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-black/6 flex items-center justify-between text-xs text-[#6E685F]">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#53C59B]" />
              <span>Acceso privado</span>
            </span>
            <Link to="/" className="font-semibold text-[#4FA6EE] hover:underline">
              ← Ir a la tienda pública
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
