import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Video } from '../../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, onClose, video }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors z-10"
            >
              <X size={32} />
            </button>
            <video
              src={video.url}
              controls
              autoPlay
              className="w-full h-full rounded-lg bg-black"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayerModal;
