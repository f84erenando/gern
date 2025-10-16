import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Square, Play, Loader2 } from 'lucide-react';

interface VoiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (voiceName: string) => void;
}

const aiVoices = ["Aurora", "Echo", "Nova", "Orion", "Phoenix", "Sage"];

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ai' | 'record'>('ai');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleRecord = () => {
    setIsRecording(true);
    setRecordedAudio(null);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setRecordedAudio(new Blob()); // Dummy blob
    }, 5000); // Record for 5 seconds
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('voice_selection_title')}>
      <div className="space-y-4">
        <div className="flex bg-secondary p-1 rounded-lg">
          <button onClick={() => setActiveTab('ai')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'ai' ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10'}`}>{t('ai_voices')}</button>
          <button onClick={() => setActiveTab('record')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'record' ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10'}`}>{t('my_voice')}</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {aiVoices.map(voice => (
                <button key={voice} onClick={() => onSelect(voice)} className="w-full text-left p-3 bg-secondary rounded-lg hover:bg-white/10 transition-colors flex justify-between items-center">
                  <span>{voice}</span>
                  <Play size={18} className="text-muted-foreground" />
                </button>
              ))}
            </motion.div>
          )}
          {activeTab === 'record' && (
            <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-center">
              {!isRecording && !recordedAudio && (
                <button onClick={handleRecord} className="mx-auto flex flex-col items-center gap-2 text-primary">
                  <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center">
                    <Mic size={32} />
                  </div>
                  <span>{t('record_new_audio')}</span>
                </button>
              )}
              {isRecording && (
                <div className="space-y-3">
                  <Loader2 size={32} className="mx-auto animate-spin text-primary" />
                  <p className="font-semibold">{t('recording')}</p>
                  <p className="text-2xl font-mono">{formatTime(recordingTime)}</p>
                </div>
              )}
              {recordedAudio && !isRecording && (
                <div className="space-y-4">
                    <p>Gravação Concluída!</p>
                    <div className="flex items-center justify-center gap-4 p-3 bg-secondary rounded-lg">
                        <Play size={20} />
                        <div className="w-full h-1 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm font-mono">{formatTime(5)}</span>
                    </div>
                    <button onClick={() => onSelect('Minha Voz')} className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg">{t('listen_and_add')}</button>
                    <button onClick={() => setRecordedAudio(null)} className="text-sm text-muted-foreground hover:text-foreground">Gravar novamente</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default VoiceSelectionModal;
