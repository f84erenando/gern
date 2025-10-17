import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onAuthClick={() => setAuthModalOpen(true)} />
      <main className="flex-grow">
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-black z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
              src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30"></div>
          </div>
          <div className="relative z-10 p-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {t('hero_title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-8"
            >
              {t('hero_description')}
            </motion.p>
            <motion.button
              onClick={() => setAuthModalOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
              className="bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:bg-primary/90 transition-all duration-300"
            >
              {t('get_started_free')}
            </motion.button>
          </div>
        </section>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
