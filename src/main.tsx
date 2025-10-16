import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Loader2 } from 'lucide-react';

const FullscreenLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<FullscreenLoader />}>
        <App />
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);
