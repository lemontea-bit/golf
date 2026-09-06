import { useMemo, useState } from 'react';
import { useGolf } from '../state/store.jsx';

const AREA_CHIPS = ['近くのコース', '関東', 'ピン位置対応', '初心者歓迎'];

const KANTO_KEYWORDS = ['神奈川', '千葉', '埼玉', '東京', '群馬', '栃木', '茨城'];

const COURSES = [
  {
    name: '相模グリーンカントリークラブ',
    meta: '神奈川県 ／ 車で42分 ／ 18H P72',
    price: '¥9,800',
    tags: [
      { k: 'ピン位置データ提供', bg: 'rgba(47,93,67,.1)', fg: 'var(--green)' },
      { k: '初心者歓迎', bg: 'rgba(192,118,74,.12)', fg: '#7a4526' },
    ],
  },
  {
    name: '房総ヒルズゴルフクラブ',
    meta: '千葉県 ／ 車で1時間15分 ／ 18H P72',
    price: '¥7,200',
    tags: [
      { k: 'ピン位置データ提供', bg: 'rgba(47,93,67,.1)', fg: 'var(--green)' },
      { k: 'フラット', bg: 'rgba(20,25,27,.05)', fg: 'var(--sub)' },
    ],
  },
  {
    name: '武蔵野リバーサイドGC',
    meta: '埼玉県 ／ 車で55分 ／ 18H P71',
    price: '¥8,400',
    tags: [
      { k: '2サム保証', bg: 'rgba(20,25,27,.05)', fg: 'var(--sub)' },
      { k: '練習場あり', bg: 'rgba(20,25,27,.05)', fg: 'var(--sub)' },
    ],
  },
];

function chipStyle(on) {
  return on
    ? { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }
    : { background: 'var(--card)', color: 'var(--sub)', borderColor: 'var(--line)' };
}

export default function Search() {
  const { setTab } = useGolf();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState(AREA_CHIPS[0]);

  const courses = useMemo(() => {
    const q = query.trim();
    return COURSES.filter((c) => {
      if (q && !c.name.includes(q) && !c.meta.includes(q)) return false;
      if (area === '関東') return KANTO_KEYWORDS.some((k) => c.meta.includes(k));
      if (area === 'ピン位置対応') return c.tags.some((t) => t.k === 'ピン位置データ提供');
      if (area === '初心者歓迎') return c.tags.some((t) => t.k === '初心者歓迎');
      return true; // 近くのコース — no location data yet, show everything
    });
  }, [query, area]);

  return (
    <div className="screen" style={{ background: 'var(--appbg)' }}>
      <div style={{ padding: '28px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="round-btn" onClick={() => setTab('home')} style={{ width: 36, height: 36 }}>
          ←
        </div>
        <div style={{ font: "700 18px/1.3 var(--font-ui)" }}>ゴルフ場を探す</div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="コース名・エリアで検索"
        style={{
          margin: '16px 20px 0',
          padding: '14px 16px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 13,
          font: "400 13.5px/1 var(--font-ui)",
          color: 'var(--ink)',
          display: 'block',
          width: 'calc(100% - 40px)',
        }}
      />

      <div style={{ display: 'flex', gap: 7, overflow: 'auto', padding: '12px 20px 0' }}>
        {AREA_CHIPS.map((a) => (
          <div
            key={a}
            onClick={() => setArea(a)}
            className="clickable"
            style={{
              flex: 'none',
              padding: '8px 13px',
              borderRadius: 999,
              border: '1px solid',
              font: "500 11.5px/1 var(--font-ui)",
              whiteSpace: 'nowrap',
              ...chipStyle(area === a),
            }}
          >
            {a}
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {courses.length ? (
          courses.map((c) => (
            <div key={c.name} className="card clickable" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ font: "700 14.5px/1.35 var(--font-ui)" }}>{c.name}</div>
                  <div style={{ font: "400 11px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 5 }}>{c.meta}</div>
                </div>
                <div style={{ flex: 'none', textAlign: 'right' }}>
                  <div style={{ font: "700 18px/1 var(--font-num)" }}>{c.price}</div>
                  <div style={{ font: "400 9.5px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 3 }}>平日1R</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.tags.map((t) => (
                  <span
                    key={t.k}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 7,
                      background: t.bg,
                      color: t.fg,
                      font: "500 10.5px/1.3 var(--font-ui)",
                    }}
                  >
                    {t.k}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: 16, font: "400 12px/1.6 var(--font-ui)", color: 'var(--sub2)' }}>
            該当するゴルフ場が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
