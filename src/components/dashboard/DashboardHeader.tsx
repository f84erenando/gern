import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { MoreVertical, MessageSquare, AlertTriangle, Library, LogOut, Loader2, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  onFeedbackClick: () => void;
  onLegalClick: () => void;
  onLibraryClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onFeedbackClick, onLegalClick, onLibraryClick }) => {
  const { t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isActionsMenuOpen, setActionsMenuOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  const actionsMenuRef = useRef(null);

  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false));
  useOnClickOutside(actionsMenuRef, () => setActionsMenuOpen(false));

  const getInitials = (currentUser: User | null) => {
    if (!currentUser) return 'G';
    const name = currentUser.user_metadata?.full_name;
    const email = currentUser.email;

    if (name) {
        const nameParts = name.split(' ').filter(Boolean);
        if (nameParts.length > 1) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return 'G';
  };

  return (
    <header className="bg-secondary/50 backdrop-blur-sm sticky top-0 z-20 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/dashboard" className="text-xl font-bold">GERN</Link>
        <div className="flex items-center gap-4">
          {/* Actions Menu */}
          <div ref={actionsMenuRef} className="relative">
            <button onClick={() => setActionsMenuOpen(!isActionsMenuOpen)} className="p-2 rounded-full hover:bg-white/10">
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {isActionsMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-accent rounded-lg shadow-lg border border-white/10 overflow-hidden z-10"
                >
                  <nav className="p-2">
                    <button onClick={() => { onFeedbackClick(); setActionsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                      <MessageSquare size={18} /> {t('send_feedback')}
                    </button>
                    <button onClick={() => { onLegalClick(); setActionsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                      <AlertTriangle size={18} /> {t('report_issue')}
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 rounded-full hover:bg-white/10">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-sm">
                {user ? getInitials(user) : <Loader2 className="animate-spin" />}
              </div>
            </button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-accent rounded-lg shadow-lg border border-white/10 overflow-hidden z-10"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="font-semibold truncate">{user?.user_metadata.full_name || user?.email}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <nav className="p-2">
                    <button onClick={() => { onLibraryClick(); setUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                      <Library size={18} /> {t('my_library')}
                    </button>
                    {isAdmin && (
                       <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                        <Shield size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-white/10 my-2"></div>
                    <button onClick={signOut} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/20 text-red-500">
                      <LogOut size={18} /> {t('logout')}
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
