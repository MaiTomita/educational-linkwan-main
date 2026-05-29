import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarPage.css';
import { getMe, logout } from '../shared/api.js';

function weatherCodeToIcon(code) {
    const map = {
        0: '☀️', 1: '☀️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌦️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '❄️', 73: '❄️', 75: '❄️',
        80: '🌦️', 81: '🌦️', 82: '🌦️',
        95: '⛈️'
    };
    return map[code] ?? '☁️';
}

const CalendarPage = () => {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);
    const [weather, setWeather] = useState({ date: '--/--', temp: '--', icon: '--' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    useEffect(() => {
        getMe().then(setMe).catch(() => setMe(null));

        const lat = 35.6895;
        const lon = 139.6917;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=${encodeURIComponent(tz)}&models=jma_seamless`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const cur = data.current;
                const now = new Date();
                const dateStr = new Intl.DateTimeFormat('ja-JP', {
                    month: '2-digit',
                    day: '2-digit',
                    weekday: 'short'
                }).format(now);

                setWeather({
                    date: dateStr,
                    temp: cur ? Math.round(cur.temperature_2m) : '--',
                    icon: cur ? weatherCodeToIcon(cur.weather_code) : '--'
                });
            })
            .catch(() => {});
    }, []);

    const schedules = [
        { date: '2026-05-04', displayDate: '4日', content: '通院', pets: 1 },
        { date: '2026-05-15', displayDate: '15日', content: 'トリミング / 飲み会', pets: 2 },
        { date: '2026-05-25', displayDate: '25日', content: 'フィラリア', pets: 1 }
    ];

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const hasSchedule = schedules.find(s => s.date === dateStr);
            if (hasSchedule) {
                return (
                    <div style={{ 
                        position: 'absolute', 
                        right: '5px', 
                        top: '5px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2px' 
                    }}>
                        {[...Array(hasSchedule.pets)].map((_, i) => (
                            <div key={i} className="pet-icon-dot"></div>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    const handleScheduleClick = (dateStr) => {
        setViewDate(new Date(dateStr));
    };

    return (
        <div className="app-layout">
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#5d4037' }}>メニュー</div>
                <div className="sidebar-item" onClick={() => { navigate('/calendar'); setIsSidebarOpen(false); }}>📅 カレンダー</div>
                <div className="sidebar-item" onClick={() => { navigate('/setting'); setIsSidebarOpen(false); }}>⚙️ アカウント設定</div>
                <div className="sidebar-item">🐾 ペット情報</div>
                <div className="sidebar-item">📖 記録一覧</div>
                <div className="sidebar-item" style={{ marginTop: 'auto', color: '#ff6b6b' }} onClick={handleLogout}>🚪 ログアウト</div>
            </div>

            <div className="calendar-container">
                <div className="top-bar">
                    <div className="menu-icon" onClick={() => setIsSidebarOpen(true)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    
                    <div className="center-info">
                        <div className="date-weather-text">
                            {weather.date} {weather.icon} {weather.temp}℃
                        </div>
                    </div>

                    <div className="top-right-group">
                        <button className="start-screen-btn" onClick={() => navigate('/')}>
                            起動画面へ
                        </button>
                        <div 
                            className="user-profile-circle" 
                            onClick={() => navigate('/setting')}
                        >
                            {me?.user?.picture ? (
                                <img src={me.user.picture} alt="profile" />
                            ) : (
                                <div className="default-avatar">👤</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="calendar-card">
                    <Calendar 
                        onChange={setViewDate} 
                        value={viewDate}
                        locale="ja-JP"
                        calendarType="gregory"
                        formatShortWeekday={(locale, date) => ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                        tileContent={tileContent}
                    />
                </div>

                <div className="schedule-list">
                    <div className="list-title">🐾 今月の予定 🐾</div>
                    {schedules.map((item, index) => (
                        <div key={index} className="schedule-item" onClick={() => handleScheduleClick(item.date)}>
                            <div className="item-date">{item.displayDate}</div>
                            <div className="item-content">{item.content}</div>
                            <div className="item-pets">
                                {[...Array(item.pets)].map((_, i) => (
                                    <div key={i} className="pet-icon-small"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="nav-bar">
                    <div className="nav-item">🏠</div>
                    <div className="nav-item">📋</div>
                    <div className="nav-item" onClick={() => navigate('/meal-management')}>🦴</div>
                    <div className="nav-item active">📅</div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
