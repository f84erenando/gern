import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import { PenSquare, Image, ArrowLeft } from 'lucide-react';
import TextToVideoFlow from './TextToVideoFlow';
import FramesToVideoFlow from './FramesToVideoFlow';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoCreated: (title: string) => void;
}

type Step = 'initial' | 'options' | 'text_flow' | 'frames_flow';

const CreateVideoModal: React.FC<CreateVideoModalProps> = ({ isOpen, onClose, onVideoCreated }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('initial');

  const handleClose = () => {
    setStep('initial');
    onClose();
  };
  
  const handleVideoCreatedAndClose = (title: string) => {
    onVideoCreated(title);
    handleClose();
  };

  const getTitle = () => {
    switch(step) {
      case 'initial': return t('create_video_title');
      case 'options': return t('create_video_options_title');
      case 'text_flow': return t('text_to_video');
      case 'frames_flow': return t('frames_to_video');
      default: return '';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={getTitle()} 
      className={cn(
        "max-w-xl lg:max-w-3xl",
        step === 'frames_flow' && 'lg:max-w-6xl'
      )}
    >
      {step !== 'initial' && step !== 'options' && (
        <button onClick={() => setStep('options')} className="absolute top-5 left-5 text-muted-foreground hover:text-foreground z-10">
          <ArrowLeft size={20} />
        </button>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          {step === 'initial' && (
            <div className="text-center">
              <button onClick={() => setStep('options')} className="w-full flex flex-col items-center justify-center gap-3 p-8 bg-accent hover:bg-white/10 border border-border rounded-lg transition-all">
                <PenSquare size={32} className="text-primary" />
                <span className="font-semibold">{t('text_to_video')}</span>
              </button>
            </div>
          )}
          {step === 'options' && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep('text_flow')} className="flex-1 flex flex-col items-center justify-center gap-3 p-8 bg-accent hover:bg-white/10 border border-border rounded-lg transition-all">
                <PenSquare size={32} className="text-primary" />
                <span className="font-semibold">{t('text_to_video')}</span>
              </button>
              <button onClick={() => setStep('frames_flow')} className="flex-1 flex flex-col items-center justify-center gap-3 p-8 bg-accent hover:bg-white/10 border border-border rounded-lg transition-all">
                <Image size={32} className="text-primary" />
                <span className="font-semibold">{t('frames_to_video')}</span>
              </button>
            </div>
          )}
          {step === 'text_flow' && (
            <TextToVideoFlow onComplete={handleVideoCreatedAndClose} />
          )}
          {step === 'frames_flow' && (
            <FramesToVideoFlow onComplete={handleVideoCreatedAndClose} />
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default CreateVideoModal;
