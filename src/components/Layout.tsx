
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { ToastContainer } from './ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
  isModalOpen: boolean;
  modalImage: string | null;
  closeModal: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isModalOpen, modalImage, closeModal }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {isModalOpen && modalImage && <Modal imageUrl={modalImage} onClose={closeModal} />}
      <Footer />
      <ToastContainer />
    </div>
  );
};
