import { useMemo, useState } from 'react';
import { useGolf, playedHoles } from '../state/store.jsx';
import { REGIONS, SEARCH_COURSES } from '../data/searchCourses.js';

const FILTER_CHIPS = ['近くのコース', ...REGIONS, 'ピン位置対応', '初心者歓迎'];

const SORTS = [
  { k: 'recommended', label: 'おすすめ順' },
  { k: 'price-asc', label: '料金が安い順' },
  { k: 'price-desc', label: '料金が高い順' },
];

function chipStyle(on) {
  return on
    ? { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }
    : { background: 'var(--card)', color: 'var(--sub)', borderColor: 'var(--line)' };
}

const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

export default function Search() {
  const { state, setTab, selectCourse } = useGolf();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FILTER_CHIPS[0]);
  const [sortKey, setSortKey] = useState(SORTS[0].k);

  const courses = useMemo(() => {
    const q = query.trim();
    let list = SEARCH_COURSES.filter((c) => {
      if (q && !c.name.includes(q) && !c.pref.includes(q) && !c.region.includes(q)) return false;
      if (REGIONS.includes(filter)) return c.region === filter;
      if (filter === 'ピン位置対応') return c.tags.some((t) => t.k === 'ピン位置データ提供');
      if (filter === '初心者歓迎') return c.tags.some((t) => t.k === '初心者歓迎');
      return true; // 近くのコース — no location data yet, show everything
    });
    if (sortKey === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortKey === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, filter, sortKey]);

  function handleSelect(course) {
    const played = playedHoles(state.currentRound.scores);
    if (played > 0) {
      const ok = window.confirm(
        `現在入力中のラウンド（${played}/18ホール）のコース名を「${course.name}」に変更します。よろしいですか？`,
      );
      if (!ok) return;
    }
    selectCourse(course.name, '');
  }

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
        {FILTER_CHIPS.map((a) => (
          <div
            key={a}
            onClick={() => setFilter(a)}
            className="clickable"
            style={{
              flex: 'none',
              padding: '8px 13px',
              borderRadius: 999,
              border: '1px solid',
              font: "500 11.5px/1 var(--font-ui)",
              whiteSpace: 'nowrap',
              ...chipStyle(filter === a),
            }}
          >
            {a}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <div style={{ font: "400 11.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>{courses.length}件のコース</div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          style={{
            border: '1px solid var(--line)',
            borderRadius: 8,
            background: 'var(--card)',
            color: 'var(--sub)',
            font: "500 11.5px/1 var(--font-ui)",
            padding: '6px 8px',
          }}
        >
          {SORTS.map((s) => (
            <option key={s.k} value={s.k}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ padding: '10px 20px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {courses.length ? (
          courses.map((c) => (
            <div
              key={c.name}
              onClick={() => handleSelect(c)}
              className="card clickable"
              style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ font: "700 14.5px/1.35 var(--font-ui)" }}>{c.name}</div>
                  <div style={{ font: "400 11px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 5 }}>
                    {c.pref} ／ {c.drive} ／ 18H P{c.par}
                  </div>
                </div>
                <div style={{ flex: 'none', textAlign: 'right' }}>
                  <div style={{ font: "700 18px/1 var(--font-num)" }}>{yen.format(c.price)}</div>
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
              <div style={{ font: "500 11px/1 var(--font-ui)", color: 'var(--green)' }}>タップしてこのコースでラウンドを開始 →</div>
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
