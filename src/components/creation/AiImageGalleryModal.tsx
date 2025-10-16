import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import { faker } from '@faker-js/faker';
import { Check, Loader2 } from 'lucide-react';

interface AiImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: string[]) => void;
}

const AiImageGalleryModal: React.FC<AiImageGalleryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Generate fake images when the modal opens
      const fakeImages = Array.from({ length: 12 }, () => faker.image.urlLoremFlickr({ category: 'nature', width: 400, height: 400 }));
      setImages(fakeImages);
      setSelectedImages([]);
      setLoading(false);
    }
  }, [isOpen]);

  const toggleSelection = (imgUrl: string) => {
    setSelectedImages(prev =>
      prev.includes(imgUrl)
        ? prev.filter(url => url !== imgUrl)
        : [...prev, imgUrl]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_image_gallery')} className="max-w-4xl">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {images.map((img, index) => (
              <div key={index} className="relative cursor-pointer group" onClick={() => toggleSelection(img)}>
                <img src={img} alt={`AI Generated Image ${index + 1}`} className="w-full h-full object-cover rounded-lg aspect-square" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {selectedImages.includes(img) && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center border-4 border-primary rounded-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleConfirm}
            disabled={selectedImages.length === 0}
            className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50"
          >
            Confirmar Seleção ({selectedImages.length})
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AiImageGalleryModal;
