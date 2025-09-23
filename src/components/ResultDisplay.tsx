import React from 'react';
import { DesignCatalog } from './DesignCatalog';
import type { DesignCatalog as DesignCatalogType } from '../../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { EnlargeIcon } from './icons/EnlargeIcon';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { ImageWithLoader } from './ImageWithLoader';

interface ResultDisplayProps {
  originalImageFile: string | null;
  redesignedImage: string | null;
  designCatalog: DesignCatalogType | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse w-full flex flex-col">
        <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/3 rounded mb-4"></div>
        <div className="bg-gray-300 dark:bg-gray-700 aspect-[4/3] w-full rounded-lg"></div>
        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="bg-gray-300 dark:bg-gray-700 h-5 w-1/2 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/3 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-300 dark:bg-gray-700 h-3 w-3/4 rounded"></div>
                        <div className="bg-gray-300 dark:bg-gray-700 h-3 w-5/6 rounded"></div>
                    </div>
                </div>
                 <div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/3 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-300 dark:bg-gray-700 h-3 w-3/4 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ImageCard: React.FC<{ title: string; imageUrl: string; catalog: DesignCatalogType | null; }> = ({ title, imageUrl, catalog }) => {
    const { openModal } = useApp();
    const { addToast } = useToast();

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileExtension = blob.type.split('/')[1] || 'png';
            link.download = `redesigned-landscape.${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            addToast("Image download started!", "success");
        } catch (error) {
            console.error('Error downloading image:', error);
            addToast("Failed to download image.", "error");
        }
    };
    
    const handleShare = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const fileExtension = blob.type.split('/')[1] || 'png';
            const file = new File([blob], `redesigned-landscape.${fileExtension}`, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'AI Landscape Redesign',
                    text: 'Check out this landscape design I created with the AI Redesigner!',
                    files: [file],
                });
            } else {
                addToast('Web Share API is not supported in your browser.', 'info');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            if ((err as Error).name !== 'AbortError') {
                 addToast('An error occurred while trying to share the image.', 'error');
            }
        }
    };
    
    const canShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
            <div className="relative w-full">
                <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-2">
                    <button
                        onClick={() => openModal(imageUrl)}
                        className="bg-white/90 hover:bg-white text-gray-800 font-bold px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center"
                        aria-label="View larger"
                    >
                        <EnlargeIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                        Larger
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-white/90 hover:bg-white text-gray-800 font-bold px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center"
                        aria-label="Download image"
                    >
                        <DownloadIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                        Download
                    </button>
                    {canShare && (
                         <button
                            onClick={handleShare}
                            className="bg-white/90 hover:bg-white text-gray-800 font-bold px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center"
                            aria-label="Share image"
                        >
                            <ShareIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                            Share
                        </button>
                    )}
                </div>
                <div className="relative group w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <ImageWithLoader src={imageUrl} alt={title} />
                </div>
            </div>
            <DesignCatalog catalog={catalog} />
        </div>
    );
};

const Placeholder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center text-gray-500 dark:text-gray-400">
            {children}
        </div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImageFile,
  redesignedImage,
  designCatalog,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (redesignedImage) {
      return <ImageCard title="Redesigned" imageUrl={redesignedImage} catalog={designCatalog} />;
  }

  if (!originalImageFile) {
    return (
      <Placeholder>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">Your design will appear here</h3>
        <p className="mt-1 text-sm">Upload an image and select a style to get started.</p>
      </Placeholder>
    );
  }

  return (
      <Placeholder>
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707" />
        </svg>
        <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">Ready to Redesign</h3>
        <p className="mt-1 text-sm">{'Click "Generate Redesign" to see the magic happen.'}</p>
      </Placeholder>
  );
};