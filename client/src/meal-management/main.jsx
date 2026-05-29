import React from 'react';
import { createRoot } from 'react-dom/client';
import { MealManagementPage } from './mealManagementPage.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MealManagementPage />
  </React.StrictMode>
);

