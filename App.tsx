import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { DesignerPage } from './pages/DesignerPage';
import { HistoryPage } from './pages/HistoryPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AppProvider, useApp } from './contexts/AppContext';
import { HistoryProvider, useHistory } from './contexts/HistoryContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';

const PageContent: React.FC = () => {
  const { page, isModalOpen, modalImage, closeModal, navigateTo } = useApp();
  const { history, pinItem, deleteItem, viewFromHistory } = useHistory();

  useEffect(() => {
    const baseTitle = 'AI Landscaping Redesigner';
    switch (page) {
      case 'main':
        document.title = `${baseTitle} | Designer`;
        break;
      case 'history':
        document.title = `${baseTitle} | History`;
        break;
      case 'pricing':
        document.title = `${baseTitle} | Pricing`;
        break;
      case 'contact':
        document.title = `${baseTitle} | Contact`;
        break;
      case 'terms':
        document.title = `${baseTitle} | Terms of Service`;
        break;
      case 'privacy':
        document.title = `${baseTitle} | Privacy Policy`;
        break;
      default:
        document.title = baseTitle;
    }
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {page === 'main' && <DesignerPage />}
        {page === 'history' && (
          <HistoryPage
            historyItems={history}
            onView={viewFromHistory}
            onPin={pinItem}
            onDelete={deleteItem}
          />
        )}
        {page === 'pricing' && <PricingPage onNavigate={navigateTo} />}
        {page === 'contact' && <ContactPage />}
        {page === 'terms' && <TermsPage />}
        {page === 'privacy' && <PrivacyPage />}
      </main>
      {isModalOpen && modalImage && <Modal imageUrl={modalImage} onClose={closeModal} />}
      <Footer />
      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <HistoryProvider>
          <PageContent />
        </HistoryProvider>
      </AppProvider>
    </ToastProvider>
  );
};

export default App;