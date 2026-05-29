import React from 'react';
import { useNavigate } from 'react-router-dom';
import './mealManagementPage.css';

const meals = [
  {
    id: 'breakfast',
    icon: '🌅',
    label: '朝ごはん',
    kcal: 36,
    details: [{ name: 'ゆでささみ', amount: '40 g' }]
  },
  {
    id: 'lunch',
    icon: '☀️',
    label: '昼ごはん',
    kcal: 0,
    details: []
  },
  {
    id: 'dinner',
    icon: '🌙',
    label: '夜ごはん',
    kcal: 440,
    details: [
      { name: 'ゆでささみ', amount: '50 g' },
      { name: 'ベストバランス 柴犬用', amount: '100 g' },
      { name: 'いなば 総合栄養食ツインズ', amount: '40 g' }
    ]
  },
  {
    id: 'snack',
    icon: '❤️',
    label: 'おやつ',
    kcal: 262,
    details: [
      { name: 'グランデリ おっとっと 犬用', amount: '20 g' },
      { name: 'ベストバランス 柴犬用', amount: '50 g' }
    ]
  }
];

function getTodayLabel() {
  const now = new Date();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekday = weekdays[now.getDay()];
  return `${month}/${day}(${weekday})`;
}

const MealManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="meal-layout">
      <div className="meal-container">
        <header className="meal-header">
          <button type="button" className="meal-menu-btn" aria-label="menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="meal-date-pill">{getTodayLabel()} ☁️ 11℃</div>

          <button type="button" className="meal-start-btn" onClick={() => navigate('/')}> 
            起動画面へ
          </button>
        </header>

        <section className="meal-profile-row">
          <div className="meal-profile-card">
            <div className="meal-pet-thumb" aria-hidden="true">🐶</div>
            <span className="meal-pet-name">海</span>
            <span className="meal-profile-arrow">&gt;</span>
          </div>
          <button type="button" className="meal-med-btn">服薬管理</button>
        </section>

        <section className="meal-summary-card">
          <h3>🐾 今日の記録 🐾</h3>

          <div className="meal-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={85}>
            <div className="meal-progress-fill" style={{ width: '85%' }}>
              <span className="meal-flag">🚩</span>
            </div>
          </div>

          <div className="meal-calorie-stats">
            <div>
              <p className="meal-stat-label">摂取カロリー</p>
              <p className="meal-stat-value meal-intake">738 <small>Kcal</small></p>
            </div>
            <div>
              <p className="meal-stat-label">目標</p>
              <p className="meal-stat-value meal-target">688 <small>Kcal</small></p>
            </div>
          </div>
        </section>

        <section className="meal-list" aria-label="食事リスト">
          {meals.map((meal) => (
            <article key={meal.id} className="meal-card-item">
              <div className="meal-card-header">
                <span>{meal.icon} {meal.label}</span>
                <span>{String(meal.kcal).padStart(3, '0')}Kcal 📝</span>
              </div>

              {meal.details.length > 0 && (
                <div className="meal-card-details">
                  {meal.details.map((detail) => (
                    <div key={`${meal.id}-${detail.name}`} className="meal-row">
                      <span>{detail.name}</span>
                      <span>{detail.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>

        <nav className="meal-nav-bar" aria-label="フッターメニュー">
          <button type="button" className="meal-nav-item" aria-label="home">🏠</button>
          <button type="button" className="meal-nav-item" aria-label="records">📋</button>
          <button type="button" className="meal-nav-item active" aria-label="meal management">🦴</button>
          <button
            type="button"
            className="meal-nav-item"
            aria-label="calendar"
            onClick={() => navigate('/calendar')}
          >
            📅
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MealManagementPage;
