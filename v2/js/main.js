// さくら薬局 v2
// 受付時間はここを書き換えるだけで、ページ内の「本日の受付」「ただいま」の表示が変わります。
// 0=日曜 … 6=土曜。お休みの日は null。祝日は自動判定していません（下の HOLIDAYS に日付を足してください）。
const HOURS = {
  0: null,
  1: ['9:00', '18:30'],
  2: ['9:00', '18:30'],
  3: ['9:00', '18:30'],
  4: ['9:00', '18:30'],
  5: ['9:00', '18:30'],
  6: ['9:00', '13:00'],
};
// 祝日・臨時休業日（YYYY-MM-DD）
const HOLIDAYS = ['2026-11-23', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03'];

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// 閲覧者の端末の設定に関係なく、日本時間で判定する
function nowInTokyo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return {
    iso: `${get('year')}-${get('month')}-${get('day')}`,
    month: Number(get('month')),
    date: Number(get('day')),
    weekday,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

function hoursFor(iso, weekday) {
  return HOLIDAYS.includes(iso) ? null : HOURS[weekday];
}

function nextOpening(now) {
  const base = new Date(`${now.iso}T00:00:00Z`);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const weekday = d.getUTCDay();
    const h = hoursFor(iso, weekday);
    if (h) return `${i === 1 ? '明日' : `${DAY_NAMES[weekday]}曜`} ${h[0]}`;
  }
  return '';
}

function renderStatus() {
  const now = nowInTokyo();
  const today = hoursFor(now.iso, now.weekday);
  let text;
  let open = false;

  if (today && now.minutes < toMinutes(today[0])) {
    text = `本日は ${today[0]} から受け付けます`;
  } else if (today && now.minutes < toMinutes(today[1])) {
    open = true;
    text = `受付中（${today[1]} まで）`;
  } else {
    const next = nextOpening(now);
    text = today ? '本日の受付は終了しました' : '本日はお休みです';
    if (next) text += `（次は ${next}）`;
  }

  document.querySelectorAll('[data-status]').forEach((el) => {
    el.textContent = text;
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
  });
  document.querySelectorAll('[data-status-row]').forEach((el) => { el.hidden = false; });
  document.querySelectorAll('[data-today]').forEach((el) => {
    el.textContent = `${now.month}月${now.date}日（${DAY_NAMES[now.weekday]}）`;
  });
  document.querySelectorAll('[data-today-hours]').forEach((el) => {
    el.textContent = today ? `${today[0]} – ${today[1]}` : 'お休み';
  });
  const column = HOLIDAYS.includes(now.iso) ? 0 : now.weekday;
  document.querySelectorAll('.hours [data-day]').forEach((el) => {
    el.classList.toggle('is-today', Number(el.dataset.day) === column);
  });
}

renderStatus();
setInterval(renderStatus, 60000);

// スマートフォン用メニューの開閉
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('gnav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
