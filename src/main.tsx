import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n';
import { AuthProvider } from './contexts/AuthContext.tsx';
import AppWrapper from './AppWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </BrowserRouter>
);
