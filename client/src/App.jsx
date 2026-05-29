import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TitlePage } from './title/titlePage';
import SettingPage from './setting/settingPage';
import CalendarPage from './calendar/calendarPage';
import MealManagementPage from './meal-management/mealManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 初期ルートをTitleページに設定 */}
        <Route path="/" element={<TitlePage />} />
        <Route path="/title" element={<TitlePage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/meal-management" element={<MealManagementPage />} />
        {/* 無効なパスはホームにリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
