import React, { useState, useRef, useEffect } from 'react';
import type { ImageFile } from '../../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

interface ImageUploaderProps {
  onImageUpload: (file: string | null) => void;
  initialImage?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, initialImage }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useApp();
  const { addToast } = useToast();
  
  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    } else {
      setPreview(null);
    }
  }, [initialImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const paramsToSign = {
        timestamp: Math.round(new Date().getTime() / 1000),
        upload_preset: 'ai-landscaping-redesigner', // Create this upload preset in your Cloudinary account
      };

      const response = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paramsToSign }),
      });

      const { signature } = await response.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
      formData.append('timestamp', paramsToSign.timestamp.toString());
      formData.append('signature', signature);
      formData.append('upload_preset', paramsToSign.upload_preset);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Upload to Cloudinary failed');
      }

      const imageData = await uploadResponse.json();
      onImageUpload(imageData.secure_url);
      addToast('Image uploaded successfully!', 'success');

    } catch (error) {
      console.error("Upload error:", error);
      addToast('Image upload failed. Please try again.', 'error');
      setPreview(null); // Clear preview on error
      onImageUpload(null);
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative w-full h-56 rounded-lg text-center transition-all duration-300
          ${!preview 
            ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 flex items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400' 
            : 'border-0'
          }`
        }
        onClick={() => !preview && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {!preview ? (
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L36 16m0 0v12m0-12h8m-4 4h.01M12 28h12m-12 4h12m-12 4h12m16-4h.01M20 20h4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
          </div>
        ) : (
          <div className="relative group w-full h-full rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
               <button onClick={(e) => { e.stopPropagation(); openModal(preview); }} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-2 md:px-4 py-2 rounded-md text-xs md:text-sm mr-2 shadow-md transition-all duration-200">View</button>
               <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-2 md:px-4 py-2 rounded-md text-xs md:text-sm shadow-md transition-all duration-200">Remove</button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        For best results, upload images without people, animals, or cars.
      </p>
    </div>
  );
};