import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Loader2, Film, Monitor, Smartphone, Sparkles, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import VoiceSelectionModal from './VoiceSelectionModal';
import AiImageGalleryModal from './AiImageGalleryModal';

interface FramesToVideoFlowProps {
  onComplete: (title: string) => void;
}

const qualities = ["720p", "1080p", "4K"];

const FramesToVideoFlow: React.FC<FramesToVideoFlowProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Padrão IA');
  const [quality, setQuality] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("landscape");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!prompt || uploadedImages.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onComplete(prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''));
    }, 4000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...imageUrls]);
    }
  };
  
  const handleSelectFromGallery = (images: string[]) => {
    setUploadedImages(prev => [...prev, ...images]);
    setGalleryOpen(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <div className="h-[70vh]">
        {!isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
          >
            {/* Left Column: Settings & Prompt */}
            <div className="flex flex-col space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg">{t('video_settings')}</h4>
                <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('select_voice')}</span>
                    <button onClick={() => setVoiceModalOpen(true)} className="flex items-center gap-2 text-sm bg-secondary px-3 py-1 rounded-md hover:bg-white/10"><Sparkles size={14} /> {selectedVoice}</button>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('video_quality')}</span>
                      <div className="flex gap-2">
                         {qualities.map(q => (
                          <button key={q} onClick={() => setQuality(q)} disabled={q === '4K'} className={`text-sm px-3 py-1 rounded-md transition-colors disabled:opacity-50 ${quality === q ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}>{q}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('video_aspect_ratio')}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setAspectRatio('landscape')} className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${aspectRatio === 'landscape' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}><Monitor size={14}/> {t('landscape')}</button>
                        <button onClick={() => setAspectRatio('portrait')} className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${aspectRatio === 'portrait' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-white/10'}`}><Smartphone size={14}/> {t('portrait')}</button>
                      </div>
                    </div>
                </div>
              </div>
              <div className="flex-grow flex flex-col space-y-2">
                <label htmlFor="prompt-frames" className="font-semibold text-lg">{t('describe_your_video_with_frames')}</label>
                <textarea
                  id="prompt-frames"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full flex-grow bg-background border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                  placeholder={t('describe_your_video_with_frames')}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt || uploadedImages.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('generate_now')} <Film size={18} />
              </button>
            </div>

            {/* Right Column: Image Upload & Gallery */}
            <div className="flex flex-col bg-background rounded-lg border border-border h-full">
              <div className="p-4 border-b border-border">
                <div className="flex gap-4">
                  <label htmlFor="image-upload" className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg transition-all border border-border">
                    <UploadCloud size={18} /> {t('upload_frames')}
                  </label>
                  <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button onClick={() => setGalleryOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg transition-all border border-border">
                    <ImageIcon size={18} /> {t('ai_image_gallery')}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((src, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img src={src} className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ImageIcon size={48} className="mb-4" />
                    <h3 className="font-semibold">Adicione suas imagens</h3>
                    <p className="text-sm">Faça o upload do seu computador ou use a galeria IA.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="generating-frames"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-8 flex-grow flex flex-col justify-center h-full"
          >
            <Loader2 size={48} className="mx-auto animate-spin text-primary" />
            <h3 className="text-xl font-semibold">{t('generating_video')}</h3>
            <p className="text-muted-foreground">Sincronizando áudio e frames...</p>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-2.5 rounded-full w-full animate-pulse"></div>
            </div>
          </motion.div>
        )}
      </div>
      <VoiceSelectionModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setVoiceModalOpen(false)}
        onSelect={(voiceName) => {
          setSelectedVoice(voiceName);
          setVoiceModalOpen(false);
        }}
      />
      <AiImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleSelectFromGallery}
      />
    </>
  );
};

export default FramesToVideoFlow;
