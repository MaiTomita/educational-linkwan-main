import React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingPage } from './settingPage.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingPage />
  </React.StrictMode>
);
