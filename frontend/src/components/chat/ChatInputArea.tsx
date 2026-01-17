import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImagePreview from './ImagePreview';

interface ChatInputAreaProps {
  onSendMessage: (text: string, images: string[]) => void;
  disabled: boolean;
}

export default function ChatInputArea({ onSendMessage, disabled }: ChatInputAreaProps) {
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          
          // Compress image before adding
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Max dimensions
            const MAX_WIDTH = 1024;
            const MAX_HEIGHT = 1024;
            
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedData);
          };
          img.onerror = reject;
          img.src = result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const images = await Promise.all(imagePromises);
      setSelectedImages((prev) => [...prev, ...images]);
    } catch (error) {
      console.error('Error reading images:', error);
      alert('Error al cargar las imágenes');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!inputText.trim() && selectedImages.length === 0) || disabled) return;

    onSendMessage(inputText, selectedImages);
    setInputText('');
    setSelectedImages([]);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-3 py-3 rounded-b-2xl">
      {/* Image previews */}
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedImages.map((image, idx) => (
            <ImagePreview
              key={idx}
              imageData={image}
              onRemove={() => handleRemoveImage(idx)}
            />
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Subir imagen"
        >
          <PhotoIcon className="w-5 h-5 text-gray-600" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          disabled={disabled}
          rows={1}
          className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ minHeight: '36px', maxHeight: '100px' }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!inputText.trim() && selectedImages.length === 0)}
          className="shrink-0 w-9 h-9 rounded-lg bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Enviar"
        >
          <PaperAirplaneIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}