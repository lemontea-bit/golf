// Course, pin-position and scoring helpers.
//
// Ported from the Claude Design prototype (project/Golf Score App.dc.html).
// Pin positions are derived deterministically from the course layout, the
// same way the prototype does it: this stands in for course-provided pin
// sheet data until a real data source is wired up.

export const COURSE = [
  { n: 1, par: 4, yd: 372, hdcp: 9 },
  { n: 2, par: 5, yd: 512, hdcp: 3 },
  { n: 3, par: 3, yd: 158, hdcp: 17 },
  { n: 4, par: 4, yd: 401, hdcp: 1 },
  { n: 5, par: 4, yd: 355, hdcp: 13 },
  { n: 6, par: 5, yd: 528, hdcp: 5 },
  { n: 7, par: 3, yd: 172, hdcp: 15 },
  { n: 8, par: 4, yd: 385, hdcp: 7 },
  { n: 9, par: 4, yd: 410, hdcp: 11 },
  { n: 10, par: 4, yd: 368, hdcp: 10 },
  { n: 11, par: 3, yd: 165, hdcp: 18 },
  { n: 12, par: 5, yd: 505, hdcp: 4 },
  { n: 13, par: 4, yd: 392, hdcp: 2 },
  { n: 14, par: 4, yd: 340, hdcp: 14 },
  { n: 15, par: 5, yd: 540, hdcp: 6 },
  { n: 16, par: 3, yd: 148, hdcp: 16 },
  { n: 17, par: 4, yd: 415, hdcp: 8 },
  { n: 18, par: 4, yd: 380, hdcp: 12 },
];

export const PAR_TOTAL = COURSE.reduce((a, h) => a + h.par, 0);

const TIERS = ['手前', '中央', '奥'];
const SIDES = ['左', '中央', '右'];

export const PINS = COURSE.reduce((acc, h, i) => {
  const tier = TIERS[i % 3];
  const side = SIDES[(i * 2) % 3];
  const center = Math.max(92, h.yd - 233);
  acc[h.n] = { tier, side, center, front: center - 7, back: center + 8 };
  return acc;
}, {});

export const PIN_TIPS = {
  奥: '当日のピンは奥。グリーン中央を狙えば大きなミスになりません。手前からのアプローチは上り傾斜で寄せやすい位置です。',
  手前: 'ピンは手前。ピンを直接狙うと手前のバンカーに入りやすいので、1クラブ大きめでグリーン中央がおすすめ。',
  中央: 'ピンは中央。表示のセンター距離をそのまま使って番手を選べます。初心者はまず乗せることを優先。',
};

export const COLORS = {
  ink: '#14191b',
  sub: '#525b58',
  green: '#2f5d43',
  clay: '#c0764a',
  card: '#fdfcf9',
  line: 'rgba(20,25,27,.1)',
};

export function relName(d) {
  if (d <= -2) return 'イーグル';
  if (d === -1) return 'バーディー';
  if (d === 0) return 'パー';
  if (d === 1) return 'ボギー';
  if (d === 2) return 'ダブルボギー';
  if (d === 3) return 'トリプルボギー';
  return '+' + d;
}

export function sign(d) {
  return d > 0 ? '+' + d : d === 0 ? 'イーブン' : String(d);
}

export function scoreCellStyle(v, par) {
  if (v == null) return { bg: '#f0ede6', fg: '#b7bcb7', bd: 'rgba(20,25,27,.07)' };
  const d = v - par;
  if (d < 0) return { bg: '#fff', fg: COLORS.clay, bd: COLORS.clay };
  if (d === 0) return { bg: '#fff', fg: COLORS.green, bd: 'rgba(47,93,67,.55)' };
  if (d === 1) return { bg: 'rgba(20,25,27,.05)', fg: COLORS.ink, bd: 'rgba(20,25,27,.1)' };
  return { bg: 'rgba(20,25,27,.82)', fg: '#fff', bd: 'rgba(20,25,27,.82)' };
}

const WEEKDAYS_JA = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function formatDateBadge(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d} ${WEEKDAYS_JA[date.getDay()]}`;
}

export function formatDateShort(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTiny(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
}
