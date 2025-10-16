import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, Film, Monitor, Smartphone, Sparkles, Check } from 'lucide-react';
import VoiceSelectionModal from './VoiceSelectionModal';

interface TextToVideoFlowProps {
  onComplete: (title: string) => void;
}

const qualities = ["720p", "1080p", "4K"];
const aspectRatios = ["landscape", "portrait"];

const TextToVideoFlow: React.FC<TextToVideoFlowProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Padrão IA');
  const [quality, setQuality] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("landscape");

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onComplete(prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''));
    }, 3000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <label htmlFor="prompt" className="font-semibold text-foreground">{t('describe_your_video')}</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="w-full bg-background border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder={t('create_video_title')}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!prompt}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && !isGenerating && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h4 className="font-semibold mb-2">{t('video_settings')}</h4>
                <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('select_voice')}</span>
                    <button onClick={() => setVoiceModalOpen(true)} className="flex items-center gap-2 text-sm bg-secondary px-3 py-1 rounded-md hover:bg-white/10"><Sparkles size={14} /> {selectedVoice}</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('video_quality')}</span>
                    <div className="flex gap-2">
                       {qualities.map(q => (
                        <button key={q} onClick={() => setQuality(q)} disabled={q === '4K'} className={`text-sm px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${quality === q ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}>{q}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('video_aspect_ratio')}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setAspectRatio('landscape')} className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${aspectRatio === 'landscape' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}><Monitor size={14}/> {t('landscape')}</button>
                      <button onClick={() => setAspectRatio('portrait')} className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${aspectRatio === 'portrait' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}><Smartphone size={14}/> {t('portrait')}</button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20"
              >
                {t('generate_video')} <Film size={18} />
              </button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center space-y-4 py-8"
            >
              <Loader2 size={48} className="mx-auto animate-spin text-primary" />
              <h3 className="text-xl font-semibold">{t('generating_video')}</h3>
              <p className="text-muted-foreground">Isso pode levar alguns instantes...</p>
              <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                <div className="bg-primary h-2.5 rounded-full w-full animate-pulse"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <VoiceSelectionModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setVoiceModalOpen(false)}
        onSelect={(voiceName) => {
          setSelectedVoice(voiceName);
          setVoiceModalOpen(false);
        }}
      />
    </>
  );
};

export default TextToVideoFlow;
