import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import CreateVideoModal from '../components/creation/CreateVideoModal';
import FeedbackModal from '../components/dashboard/FeedbackModal';
import LegalModal from '../components/dashboard/LegalModal';
import LibraryModal from '../components/dashboard/LibraryModal';
import { toast } from 'sonner';
import { Video } from '../types';

const initialVideos: Video[] = [
  { id: 1, title: "A Jornada do Herói", date: "20/07/2025", status: "Concluído", thumbnail: "https://i.imgur.com/8zHmH3z.jpeg", url: "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" },
  { id: 2, title: "Reflexões ao Amanhecer", date: "18/07/2025", status: "Concluído", thumbnail: "https://i.imgur.com/sWp3R4s.jpeg", url: "https://videos.pexels.com/video-files/853877/853877-hd_1920_1080_25fps.mp4" },
  { id: 3, title: "Ecos do Passado", date: "15/07/2025", status: "Concluído", thumbnail: "https://i.imgur.com/j6e6mUu.jpeg", url: "https://videos.pexels.com/video-files/3840441/3840441-hd_1920_1080_25fps.mp4" },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isLegalModalOpen, setLegalModalOpen] = useState(false);
  const [isLibraryModalOpen, setLibraryModalOpen] = useState(false);

  const handleVideoCreated = (title: string) => {
    const newVideo: Video = {
      id: Date.now(),
      title: title,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Gerando...',
      thumbnail: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/fbbf24/ffffff?text=${encodeURIComponent(title.substring(0,10))}`,
      url: ''
    };
    setVideos(prev => [newVideo, ...prev]);
    toast.success(`Seu vídeo "${title}" começou a ser gerado!`);

    setTimeout(() => {
      setVideos(prev => prev.map(v => v.id === newVideo.id ? { ...v, status: 'Concluído', url: 'https://videos.pexels.com/video-files/4434249/4434249-hd_1920_1080_25fps.mp4' } : v));
      toast.info(`Vídeo "${title}" concluído e pronto para assistir.`);
    }, 5000);
  };

  const handleDeleteVideo = (videoId: number) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    toast.success("Vídeo excluído com sucesso.");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onFeedbackClick={() => setFeedbackModalOpen(true)}
        onLegalClick={() => setLegalModalOpen(true)}
        onLibraryClick={() => setLibraryModalOpen(true)}
      />
      <main className="container mx-auto p-4 md:p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{t('my_videos')}</h2>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <motion.div 
                key={video.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-secondary rounded-lg overflow-hidden group border border-transparent hover:border-primary transition-all"
              >
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  {video.status !== 'Concluído' && (
                     <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {video.status}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-secondary rounded-lg">
            <h3 className="text-xl font-semibold">{t('no_videos_yet')}</h3>
            <p className="text-muted-foreground mt-2">Clique em "Criar Vídeo" para começar.</p>
          </div>
        )}
      </main>
      
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-8 z-30">
        <motion.button
          onClick={() => setCreateModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full p-4 shadow-2xl flex items-center gap-3 transition-colors border border-white/20"
        >
          <Plus size={24} />
          <span>{t('create_video')}</span>
        </motion.button>
      </div>


      <CreateVideoModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onVideoCreated={handleVideoCreated} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />
      <LegalModal isOpen={isLegalModalOpen} onClose={() => setLegalModalOpen(false)} />
      <LibraryModal 
        isOpen={isLibraryModalOpen} 
        onClose={() => setLibraryModalOpen(false)} 
        videos={videos}
        onDelete={handleDeleteVideo} 
      />
    </div>
  );
};

export default DashboardPage;
