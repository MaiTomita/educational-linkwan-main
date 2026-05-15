import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './settingPage.css';
import { getMe, logout } from '../shared/api.js';

const SettingPage = () => {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);

    useEffect(() => {
        getMe().then(setMe).catch(() => setMe(null));
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <div className="setting-container">
            <div className="back-link" onClick={() => navigate('/calendar')}>←</div>
            
            <div className="settings-card">
                <div className="profile-container">
                    {/* Owner Section */}
                    <div className="profile-item">
                        <div className="profile-name">飼い主</div>
                        <div className="avatar-row">
                            <div className="avatar">
                                {me?.user?.picture ? (
                                    <img src={me.user.picture} alt="profile" />
                                ) : (
                                    '👤'
                                )}
                            </div>
                            <div className="owner-info">
                                <span className="owner-name">{me?.user?.name || 'ゲスト'}</span>
                                <button className="edit-profile">プロフィールを編集</button>
                            </div>
                        </div>
                    </div>

                    {/* Pets Section */}
                    <div className="profile-item">
                        <div className="profile-name">愛犬</div>
                        <div className="avatar-row">
                            <div className="avatar">🐶</div>
                            <div className="add-circle">＋</div>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <div className="middle-section">
                    <div className="notifications-header">
                        <div className="notif-icon">🔔</div>
                        <div className="notif-title">通知設定</div>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">散歩アラーム</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">プッシュ通知</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <hr className="divider" style={{ marginLeft: '-40px', width: 'calc(100% + 40px)' }} />

                    <div className="help-header">
                        <div className="help-icon">❓</div>
                        <div className="help-title">ヘルプ</div>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">アプリの使い方</span>
                        <span className="chevron">&gt;</span>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">よくある質問</span>
                        <span className="chevron">&gt;</span>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">お問い合わせ</span>
                        <span className="chevron">&gt;</span>
                    </div>
                </div>

                <div className="logout-link" onClick={handleLogout}>ログアウト</div>
                
                <img src="/images/logo_linkwan.svg" alt="Linkwan" className="card-logo" />
            </div>
        </div>
    );
};

export default SettingPage;
