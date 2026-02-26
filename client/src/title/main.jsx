import React from 'react';
import { createRoot } from 'react-dom/client';
import { TitlePage } from './titlePage.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TitlePage />
  </React.StrictMode>
);
