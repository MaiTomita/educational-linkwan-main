import React, { useEffect, useMemo, useRef, useState } from 'react';
import './titlePage.css';

import { authWithGoogleCredential, getMe } from '../shared/api.js';
import { getGoogleClientId, loadGoogleIdentityScript } from '../shared/googleIdentity.js';

function weatherCodeToText(code) {
  const map = {
    0: '快晴',
    1: '晴れ',
    2: '薄曇り',
    3: '曇り',
    45: '霧',
    48: '霧氷着霧',
    51: '霧雨(弱)',
    53: '霧雨(中)',
    55: '霧雨(強)',
    56: '着氷性霧雨(弱)',
    57: '着氷性霧雨(強)',
    61: '雨(弱)',
    63: '雨(中)',
    65: '雨(強)',
    66: '着氷性雨(弱)',
    67: '着氷性雨(強)',
    71: '雪(弱)',
    73: '雪(中)',
    75: '雪(強)',
    77: '霰',
    80: 'にわか雨(弱)',
    81: 'にわか雨(中)',
    82: 'にわか雨(強)',
    85: 'にわか雪(弱)',
    86: 'にわか雪(強)',
    95: '雷雨',
    96: '雷雨(雹あり)',
    99: '激しい雷雨(雹あり)'
  };
  return map[code] ?? '--';
}

function degToCompass(deg) {
  if (typeof deg !== 'number') return '--';
  const dirs = [
    '北',
    '北北東',
    '北東',
    '東北東',
    '東',
    '東南東',
    '南東',
    '南南東',
    '南',
    '南南西',
    '南西',
    '西南西',
    '西',
    '西北西',
    '北西',
    '北北西'
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return `${dirs[idx]} (${Math.round(deg)}°)`;
}

export function TitlePage() {
  const googleButtonRef = useRef(null);
  const [me, setMe] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const isLoggedIn = useMemo(() => Boolean(me?.user?.email), [me]);

  useEffect(() => {
    // existing title animation + weather fetch behavior
    const logo = document.getElementById('logo');
    const tapToStart = document.getElementById('tap-to-start');
    const dateEl = document.getElementById('weather-date');
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const windEl = document.getElementById('weather-wind');

    if (logo) {
      logo.style.transform = 'translateY(80px)';
      logo.style.opacity = '0';
      setTimeout(() => {
        logo.style.transition =
          'transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.8s';
        logo.style.transform = 'translateY(0)';
        logo.style.opacity = '1';
      }, 100);
    }

    if (tapToStart) {
      setTimeout(() => {
        tapToStart.style.display = 'block';
        tapToStart.style.opacity = '0';
        tapToStart.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          tapToStart.style.opacity = '1';
        }, 10);
      }, 1000);
    }

    const lat = 35.6895;
    const lon = 139.6917;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,weather_code,winddirection_10m` +
      `&current=temperature_2m,weather_code,winddirection_10m` +
      `&timezone=${encodeURIComponent(tz)}` +
      `&models=jma_seamless`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const cur = data.current;
        let temp =
          cur && typeof cur.temperature_2m === 'number' ? cur.temperature_2m : null;
        let wcode =
          cur && typeof cur.weather_code === 'number' ? cur.weather_code : null;
        let wdir =
          cur && typeof cur.winddirection_10m === 'number'
            ? cur.winddirection_10m
            : null;

        if (temp === null || wcode === null || wdir === null) {
          const hourly = data.hourly || {};
          const times = hourly.time || [];
          const temps = hourly.temperature_2m || [];
          const wcodes = hourly.weather_code || [];
          const wdirs = hourly.winddirection_10m || [];
          const idx = times.length - 1;
          if (idx >= 0) {
            temp = temp ?? temps[idx];
            wcode = wcode ?? wcodes[idx];
            wdir = wdir ?? wdirs[idx];
          }
        }

        const now = new Date();
        const dateStr = new Intl.DateTimeFormat('ja-JP', {
          month: '2-digit',
          day: '2-digit',
          weekday: 'short'
        }).format(now);
        if (dateEl) dateEl.textContent = dateStr;

        if (typeof temp === 'number' && tempEl) {
          tempEl.textContent = `${Math.round(temp)}℃`;
        }

        if (descEl) descEl.textContent = weatherCodeToText(wcode);
        if (windEl) windEl.textContent = `風向: ${degToCompass(wdir)}`;
      })
      .catch(() => {
        if (descEl) descEl.textContent = '天気情報の取得に失敗しました';
      });
  }, []);

  useEffect(() => {
    // fetch login state
    getMe()
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  useEffect(() => {
    // render google button
    let cancelled = false;

    async function setup() {
      try {
        setAuthError('');
        await loadGoogleIdentityScript();
        if (cancelled) return;

        const clientId = getGoogleClientId();
        // eslint-disable-next-line no-undef
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              setLoadingAuth(true);
              setAuthError('');
              const result = await authWithGoogleCredential(response.credential);
              setMe({ ok: true, user: result.user });
              window.location.href = '/Setting.html';
            } catch (e) {
              const message = e instanceof Error ? e.message : 'Login failed';
              setAuthError(message);
            } finally {
              setLoadingAuth(false);
            }
          }
        });

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '';
          // eslint-disable-next-line no-undef
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 260
          });
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Google login unavailable';
        setAuthError(message);
      }
    }

    if (!isLoggedIn) {
      setup();
    }

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  return (
    <div className="wrapper">
      <div className="container">
        <img id="logo" src="/images/logo_linkwan.svg" alt="リンクワン ロゴ" />

        <div id="weather" aria-live="polite">
          <div className="weather-row">
            <span className="weather-date" id="weather-date">
              --/-- (--)
            </span>
          </div>
          <div className="weather-row">
            <span className="weather-temp" id="weather-temp">
              --℃
            </span>
            <span className="weather-desc" id="weather-desc">
              --
            </span>
          </div>
          <div className="weather-row">
            <span className="weather-wind" id="weather-wind">
              風向: --
            </span>
          </div>
        </div>

        <div className="login-box" aria-live="polite">
          {isLoggedIn ? (
            <div className="login-state">
              <div className="login-text">ログイン中: {me.user?.name || me.user?.email}</div>
              <button
                className="go-setting"
                type="button"
                onClick={() => {
                  window.location.href = '/Setting.html';
                }}
              >
                設定へ
              </button>
            </div>
          ) : (
            <>
              <div ref={googleButtonRef} />
              {loadingAuth ? <div className="login-muted">ログイン中...</div> : null}
            </>
          )}
          {authError ? <div className="login-error">{authError}</div> : null}
        </div>

        <div id="tap-to-start" style={{ display: 'none' }}>
          タップではじめる
        </div>
      </div>
    </div>
  );
}
