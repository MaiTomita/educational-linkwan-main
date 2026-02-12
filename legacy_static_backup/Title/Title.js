// ロゴを下から中央へスライドインさせるアニメーション
window.addEventListener('DOMContentLoaded', function() {
  const logo = document.getElementById('logo');
  const tapToStart = document.getElementById('tap-to-start');
  const dateEl = document.getElementById('weather-date');
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  const windEl = document.getElementById('weather-wind');

  // 初期位置を下に設定
  logo.style.transform = 'translateY(80px)';
  logo.style.opacity = '0';

  setTimeout(function() {
    // スライドイン
    logo.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.8s';
    logo.style.transform = 'translateY(0)';
    logo.style.opacity = '1';
  }, 100);

  // 1秒後に「タップではじめる」表示
  setTimeout(function() {
    tapToStart.style.display = 'block';
    tapToStart.style.opacity = '0';
    tapToStart.style.transition = 'opacity 0.5s';
    setTimeout(function() {
      tapToStart.style.opacity = '1';
    }, 10);
  }, 1000);

  // 天気取得（Open-Meteo JMA）
  // 東京の緯度経度（必要に応じて変更可）
  const lat = 35.6895;
  const lon = 139.6917;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&hourly=temperature_2m,weather_code,winddirection_10m` +
              `&current=temperature_2m,weather_code,winddirection_10m` +
              `&timezone=${encodeURIComponent(tz)}` +
              `&models=jma_seamless`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // 現在値があれば優先
      const cur = data.current;
      let temp = cur && typeof cur.temperature_2m === 'number' ? cur.temperature_2m : null;
      let wcode = cur && typeof cur.weather_code === 'number' ? cur.weather_code : null;
      let wdir = cur && typeof cur.winddirection_10m === 'number' ? cur.winddirection_10m : null;

      // フォールバックとして最新のhourly
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
      const dateStr = new Intl.DateTimeFormat('ja-JP', { month: '2-digit', day: '2-digit', weekday: 'short' }).format(now);
      dateEl.textContent = dateStr;

      if (typeof temp === 'number') {
        tempEl.textContent = `${Math.round(temp)}℃`;
      }

      descEl.textContent = weatherCodeToText(wcode);
      windEl.textContent = `風向: ${degToCompass(wdir)}`;
    })
    .catch(() => {
      descEl.textContent = '天気情報の取得に失敗しました';
    });
});

function weatherCodeToText(code) {
  // 簡易マッピング（Open-Meteo weather_code）
  // 参考: https://open-meteo.com/en/docs#api_form
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
  const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
  const idx = Math.round(deg / 22.5) % 16;
  return `${dirs[idx]} (${Math.round(deg)}°)`;
}

// ソンさんのブランチ
// Pull Request