import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      toast.success("Denúncia enviada com sucesso. Nossa equipe analisará em breve.");
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('legal_modal_title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Seu Email</label>
          <input
            type="email"
            id="email"
            disabled
            value={user?.email || ''}
            className="mt-1 w-full bg-background border border-border rounded-lg p-2"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Descrição do Problema</label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('legal_message_placeholder')}
            className="mt-1 w-full bg-background border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSending || !message}
          className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors border border-white/20 disabled:opacity-50"
        >
          {isSending ? <Loader2 className="animate-spin" /> : t('send')}
        </button>
      </form>
    </Modal>
  );
};

export default LegalModal;
