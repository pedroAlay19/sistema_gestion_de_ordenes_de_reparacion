import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImagePreviewProps {
  imageData: string;
  onRemove: () => void;
}

export default function ImagePreview({ imageData, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative inline-block">
      <img
        src={imageData}
        alt="Preview"
        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
