import React, { useState, useRef } from 'react';
import { MoreHorizontal, Shield, User, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminUser } from './UsersTable';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface UserActionsMenuProps {
  user: AdminUser;
  onActionComplete: () => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({ user, onActionComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const menuRef = useRef(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleAction = async (action: 'promote' | 'demote' | 'block' | 'unblock') => {
    setLoadingAction(action);
    let rpcName = '';
    let params = {};
    let successMessage = '';

    switch (action) {
      case 'promote':
        rpcName = 'update_user_role';
        params = { target_user_id: user.id, new_role: 'admin' };
        successMessage = `${user.full_name || user.email} foi promovido a admin.`;
        break;
      case 'demote':
        rpcName = 'update_user_role';
        params = { target_user_id: user.id, new_role: 'user' };
        successMessage = `${user.full_name || user.email} agora é um usuário padrão.`;
        break;
      case 'block':
        rpcName = 'update_user_status';
        params = { target_user_id: user.id, new_status: 'Bloqueado' };
        successMessage = `${user.full_name || user.email} foi bloqueado.`;
        break;
      case 'unblock':
        rpcName = 'update_user_status';
        params = { target_user_id: user.id, new_status: 'active' };
        successMessage = `${user.full_name || user.email} foi reativado.`;
        break;
    }

    const { error } = await supabase.rpc(rpcName, params);

    if (error) {
      toast.error(`Falha: ${error.message}`);
    } else {
      toast.success(successMessage);
      onActionComplete();
    }
    setIsOpen(false);
    setLoadingAction(null);
  };

  const isLoading = loadingAction !== null;

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-white/10" disabled={isLoading}>
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <MoreHorizontal size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-accent rounded-lg shadow-lg border border-white/10 overflow-hidden z-10"
          >
            <div className="p-1">
              {user.role !== 'admin' ? (
                <button onClick={() => handleAction('promote')} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/5">
                  <Shield size={14} /> Tornar Admin
                </button>
              ) : (
                <button onClick={() => handleAction('demote')} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/5">
                  <User size={14} /> Tornar Usuário
                </button>
              )}

              {user.status !== 'Bloqueado' ? (
                <button onClick={() => handleAction('block')} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/5 text-destructive">
                  <XCircle size={14} /> Bloquear
                </button>
              ) : (
                <button onClick={() => handleAction('unblock')} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/5 text-green-500">
                  <CheckCircle size={14} /> Reativar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActionsMenu;
