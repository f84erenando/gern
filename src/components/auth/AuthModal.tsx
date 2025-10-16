import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2, Chrome } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginView) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success('Login bem-sucedido!');
        onClose();
      }
    } else {
      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) toast.error(error.message);
      else toast.info('Verifique seu e-mail para confirmar o cadastro.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-secondary w-full max-w-md rounded-2xl shadow-2xl border border-white/10 relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center text-white mb-6">{isLoginView ? t('auth_login') : t('auth_signup')}</h2>
              
              <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 mb-4 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Chrome size={20} />}
                {t('auth_google')}
              </button>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLoginView && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder={t('auth_name')} value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="email" placeholder={t('auth_email')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="password" placeholder={t('auth_password')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                </div>
                {!isLoginView && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="password" placeholder={t('auth_confirm_password')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : (isLoginView ? t('auth_login') : t('auth_signup'))}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                {isLoginView ? t('auth_no_account') : t('auth_have_account')}{' '}
                <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-primary hover:underline">
                  {isLoginView ? t('auth_signup') : t('auth_login')}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
