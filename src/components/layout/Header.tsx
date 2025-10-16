import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [isLangModalOpen, setLangModalOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-10 py-6 px-4 md:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-2xl font-bold tracking-wider">GERN</Link>
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 md:gap-6"
          >
            {!session ? (
              <button
                onClick={onAuthClick}
                className="font-medium hover:text-primary transition-colors"
              >
                {t('login_signin')}
              </button>
            ) : (
              <Link to="/dashboard" className="font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
            >
              <Globe size={20} />
              <span className="hidden md:inline">{t('language')}</span>
            </button>
          </motion.nav>
        </div>
      </header>
      <LanguageSwitcher isOpen={isLangModalOpen} onClose={() => setLangModalOpen(false)} />
    </>
  );
};

export default Header;
