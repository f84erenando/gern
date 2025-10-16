import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';

interface LanguageSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('langModal.title')}>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default LanguageSwitcher;
