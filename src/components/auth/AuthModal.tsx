import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2, Chrome, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  const handleGoogleLogin = async () => {
    toast.info("A autenticação com Google está desativada no modo de simulação.");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginView) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login bem-sucedido!');
        onClose();
      }
    } else {
      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(fullName, email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.info('Cadastro realizado! Por favor, faça o login.');
        setIsLoginView(true); // Switch to login view after successful signup
      }
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
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {isLoginView ? t('auth_welcome_back') : t('auth_signup')}
              </h2>
              {isLoginView && (
                <p className="text-center text-muted-foreground mb-6">{t('auth_login_to_continue')}</p>
              )}
              
              <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-300 mb-4 disabled:opacity-50">
                <Chrome size={20} />
                {t('auth_google')}
              </button>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              {isLoginView && (
                <div className="bg-blue-950/70 border border-blue-700/50 rounded-lg p-3 text-sm text-blue-200 flex items-start gap-3 mb-4">
                  <Info size={18} className="flex-shrink-0 mt-0.5 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">Modo de Demonstração</h4>
                    <p className="mt-1">
                      Use qualquer e-mail (ex: <code className="bg-background/50 px-1 py-0.5 rounded">admin@gern.com</code>) com a senha universal: <code className="bg-background/50 px-1 py-0.5 rounded">password123</code>.
                    </p>
                  </div>
                </div>
              )}

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
                  <input type="password" placeholder={`${t('auth_password')}`} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                </div>
                {!isLoginView && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="password" placeholder={t('auth_confirm_password')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                  </div>
                )}
                
                {isLoginView && (
                  <div className="text-right -mt-2">
                    <button
                      type="button"
                      onClick={() => toast.info("Funcionalidade não implementada no modo de simulação.")}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('auth_forgot_password')}
                    </button>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed !mt-6">
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
