import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: t('about'), path: '/about' },
    { label: t('terms'), path: '/terms' },
    { label: t('privacy'), path: '/privacy' },
    { label: t('contact'), path: '/contact' },
  ];

  return (
    <footer className="bg-background/50 border-t border-white/10 py-8 px-4 md:px-8">
      <div className="container mx-auto text-center text-muted-foreground">
        <div className="flex justify-center items-center gap-6 mb-4">
          {footerLinks.map((link) => (
            <Link key={link.path} to={link.path} className="text-sm hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs">&copy; {year} GERN. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
