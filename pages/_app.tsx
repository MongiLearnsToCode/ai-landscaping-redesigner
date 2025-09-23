
'use client';

import type { AppProps } from 'next/app';
import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { AppProvider, useApp } from '../src/contexts/AppContext';
import { HistoryProvider } from '../src/contexts/HistoryContext';
import { ToastProvider } from '../src/contexts/ToastContext';
import '../index.css';
import { Layout } from '../src/components/Layout';

function AppContent({ Component, pageProps, router }: AppProps) {
  const { isModalOpen, modalImage, closeModal } = useApp();

  return (
    <Layout isModalOpen={isModalOpen} modalImage={modalImage} closeModal={closeModal}>
      <Component {...pageProps} />
    </Layout>
  );
}

function MyApp({ Component, pageProps, router }: AppProps<{initialSession: Session}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppProvider>
        <ToastProvider>
          <HistoryProvider>
            <AppContent Component={Component} pageProps={pageProps} router={router} />
          </HistoryProvider>
        </ToastProvider>
      </AppProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
