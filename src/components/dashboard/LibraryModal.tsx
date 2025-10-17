import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import { Video } from '../../types';
import { Download, Trash2, Play, AlertTriangle } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';
import { toast } from 'sonner';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  onDelete: (videoId: number) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, videos, onDelete }) => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const handlePlay = (video: Video) => {
    if (video.status !== 'Concluído') {
      toast.warning("O vídeo ainda está sendo gerado.");
      return;
    }
    setSelectedVideo(video);
    setPlayerOpen(true);
  };

  const handleDeleteClick = (video: Video) => {
    setVideoToDelete(video);
  };

  const confirmDelete = () => {
    if (videoToDelete) {
      onDelete(videoToDelete.id);
      setVideoToDelete(null);
    }
  };

  const handleDownload = (video: Video) => {
    if (video.status !== 'Concluído') {
      toast.warning("O vídeo ainda está sendo gerado.");
      return;
    }
    toast.info("Iniciando o download do seu vídeo...");
    // Simulate download
    const link = document.createElement('a');
    link.href = video.url;
    link.setAttribute('download', `${video.title}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={t('library_modal_title')}>
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {videos.length > 0 ? (
            videos.map(video => (
              <div key={video.id} className="flex items-center gap-4 p-2 bg-secondary rounded-lg">
                <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.date} - {video.status}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button onClick={() => handlePlay(video)} title={t('view_video')} className="p-2 rounded-full hover:bg-white/10 text-green-400 disabled:text-muted-foreground disabled:cursor-not-allowed" disabled={video.status !== 'Concluído'}><Play size={18} /></button>
                  <button onClick={() => handleDownload(video)} title={t('download_video')} className="p-2 rounded-full hover:bg-white/10 text-blue-400 disabled:text-muted-foreground disabled:cursor-not-allowed" disabled={video.status !== 'Concluído'}><Download size={18} /></button>
                  <button onClick={() => handleDeleteClick(video)} title={t('delete_video')} className="p-2 rounded-full hover:bg-white/10 text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('no_videos_yet')}</p>
          )}
        </div>
      </Modal>

      {selectedVideo && (
        <VideoPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setPlayerOpen(false)}
          video={selectedVideo}
        />
      )}

      {videoToDelete && (
        <Modal isOpen={true} onClose={() => setVideoToDelete(null)} title={t('confirm_delete_title')}>
            <div className="text-center">
                <AlertTriangle className="mx-auto text-destructive" size={48} />
                <p className="mt-4 text-muted-foreground">{t('confirm_delete_message')}</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button onClick={() => setVideoToDelete(null)} className="px-6 py-2 rounded-md bg-secondary hover:bg-white/10">{t('cancel')}</button>
                    <button onClick={confirmDelete} className="px-6 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('delete')}</button>
                </div>
            </div>
        </Modal>
      )}
    </>
  );
};

export default LibraryModal;
