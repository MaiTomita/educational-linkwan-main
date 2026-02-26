import React, { useEffect, useState } from 'react';
import './settingPage.css';

import { getMe, logout } from '../shared/api.js';

export function SettingPage() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMe()
      .then((data) => setMe(data))
      .catch(() => {
        setMe(null);
        setError('ログインが必要です');
      });
  }, []);

  const user = me?.user;
  const isLoggedIn = Boolean(user?.email);

  return (
    <div className="container">
      <div className="settings-card">
        <div className="profile-container">
          <div className="profile-item owner">
            <div className="profile-name">飼い主</div>
            <div className="avatar-row">
              <div className="avatar">
                {user?.picture ? (
                  <img className="avatar-img" src={user.picture} alt="avatar" />
                ) : (
                  '👤'
                )}
              </div>
              <div className="owner-info">
                <span className="owner-name">
                  {isLoggedIn ? user?.name || user?.email : '未ログイン'}
                </span>
                <span className="login-status">
                  {isLoggedIn ? 'ログイン中' : 'ログインなし'}
                </span>
              </div>
            </div>
          </div>

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
              <span className="slider" />
            </label>
          </div>

          <div className="setting-row">
            <span className="setting-label">プッシュ通知</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>

          <hr className="divider" />

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

          {error ? <div className="auth-error">{error}</div> : null}

          {isLoggedIn ? (
            <button
              className="logout"
              type="button"
              onClick={async () => {
                try {
                  await logout();
                } finally {
                  window.location.href = '/Title.html';
                }
              }}
            >
              ログアウト
            </button>
          ) : (
            <button
              className="back"
              type="button"
              onClick={() => {
                window.location.href = '/Title.html';
              }}
            >
              タイトルへ
            </button>
          )}
        </div>

        <img src="/images/logo_linkwan.svg" alt="Linkwan" className="card-logo" />
      </div>
    </div>
  );
}
