import { useMemo, useState } from 'react';
import { useGolf, liveTotals, playedHoles } from '../state/store.jsx';
import { COURSE, sign, scoreCellStyle, formatDateBadge, formatDateShort, formatDateTiny } from '../data/course.js';
import Modal from './Modal.jsx';

const PUTT_BUCKET_COLORS = { 1: 'var(--clay)', 2: 'var(--green)', 3: '#6b7370', 4: '#c9cec9' };
const PUTT_BUCKET_LABELS = { 1: '1パット', 2: '2パット', 3: '3パット', 4: '4パット以上' };

const fieldStyle = {
  padding: '12px 14px',
  background: 'var(--appbg)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  font: "400 14px/1 var(--font-ui)",
  color: 'var(--ink)',
  width: '100%',
};

export default function Scorecard() {
  const { state, completeRound, updateHistoryEntry, deleteHistoryEntry } = useGolf();
  const { currentRound, history } = state;
  const { scores } = currentRound;
  const [editingEntry, setEditingEntry] = useState(null);

  const played = playedHoles(scores);
  const { total, parSum } = liveTotals(scores);

  function openEdit(r) {
    setEditingEntry({ ...r });
  }

  function saveEdit() {
    const { id, course, date, score, par, putts } = editingEntry;
    updateHistoryEntry(id, {
      course: course.trim() || '名称未設定コース',
      date,
      score: Number(score) || 0,
      par: Number(par) || 0,
      putts: Number(putts) || 0,
    });
    setEditingEntry(null);
  }

  function removeEntry(id) {
    if (window.confirm('このラウンドの記録を削除しますか？この操作は取り消せません。')) {
      deleteHistoryEntry(id);
    }
  }

  const cardSections = useMemo(
    () =>
      [
        ['OUT 1–9', 0],
        ['IN 10–18', 9],
      ].map(([name, off]) => {
        const holes = COURSE.slice(off, off + 9);
        let t = 0;
        holes.forEach((h) => {
          t += scores[h.n]?.s || 0;
        });
        return {
          name,
          par: holes.reduce((a, h) => a + h.par, 0),
          total: t || '–',
          holes: holes.map((h) => {
            const v = scores[h.n]?.s;
            return { n: h.n, par: h.par, v: v ?? '–', p: scores[h.n]?.p ?? '–', ...scoreCellStyle(v, h.par) };
          }),
        };
      }),
    [scores],
  );

  const puttDist = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let n = 0;
    COURSE.forEach((h) => {
      const p = scores[h.n]?.p;
      if (p == null) return;
      n++;
      counts[p >= 4 ? 4 : p]++;
    });
    return [1, 2, 3, 4].map((bucket) => {
      const v = counts[bucket];
      const pct = n ? Math.round((v / n) * 100) : 0;
      return { k: PUTT_BUCKET_LABELS[bucket], w: pct + '%', v, c: PUTT_BUCKET_COLORS[bucket] };
    });
  }, [scores]);

  const trend = useMemo(() => {
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-5);
    return sorted.map((r, i) => ({
      v: r.score,
      d: formatDateTiny(r.date),
      h: Math.max(8, Math.round(20 + (120 - r.score) * 2.6)) + 'px',
      c: i === sorted.length - 1 ? 'var(--green)' : 'rgba(47,93,67,.28)',
    }));
  }, [history]);

  const trendDelta = trend.length >= 2 ? trend[0].v - trend[trend.length - 1].v : null;

  return (
    <div className="screen" style={{ background: 'var(--appbg)' }}>
      <div style={{ padding: '28px 20px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: "700 20px/1.3 var(--font-ui)" }}>スコアカード</div>
          <div style={{ font: "400 11.5px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 5 }}>
            {currentRound.teeName ? `${currentRound.course} ／ ${currentRound.teeName}` : currentRound.course} ／{' '}
            {formatDateBadge(new Date())}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: "700 30px/1 var(--font-num)" }}>{total}</div>
          <div style={{ font: "500 11px/1 var(--font-ui)", color: 'var(--clay)' }}>{played ? sign(total - parSum) : '±0'}</div>
        </div>
      </div>

      <div className="card" style={{ margin: '16px 20px 0', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cardSections.map((sec) => (
          <div key={sec.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.12em', color: 'var(--sub2)' }}>{sec.name}</span>
              <span style={{ font: "400 10.5px/1 var(--font-ui)", color: 'var(--sub)', whiteSpace: 'nowrap', flex: 'none' }}>
                PAR {sec.par} ／ 合計 {sec.total}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {sec.holes.map((h) => (
                <div key={h.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ font: "500 8px/1 var(--font-mono)", color: 'var(--sub2)' }}>{h.n}</div>
                  <div style={{ font: "400 9px/1 var(--font-ui)", color: 'var(--sub2)' }}>{h.par}</div>
                  <div
                    style={{
                      width: '100%',
                      height: 26,
                      borderRadius: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: h.bg,
                      color: h.fg,
                      border: `1px solid ${h.bd}`,
                      font: "600 14px/1 var(--font-num)",
                    }}
                  >
                    {h.v}
                  </div>
                  <div style={{ font: "400 8.5px/1 var(--font-mono)", color: 'var(--sub2)' }}>{h.p}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            gap: 14,
            paddingTop: 4,
            borderTop: '1px solid var(--line-soft)',
            font: "400 10.5px/1.5 var(--font-ui)",
            color: 'var(--sub2)',
          }}
        >
          <span>上段=ホール／PAR</span>
          <span>下段=パット数</span>
        </div>
      </div>

      {played === 18 && (
        <div
          onClick={completeRound}
          data-testid="finish-round"
          className="clickable"
          style={{
            margin: '14px 20px 0',
            padding: 16,
            borderRadius: 16,
            background: 'var(--green)',
            color: '#fff',
            textAlign: 'center',
            font: "700 14px/1 var(--font-ui)",
          }}
        >
          ラウンドを終了して履歴に保存する
        </div>
      )}

      <div className="card" style={{ margin: '16px 20px 0', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ font: "700 15px/1 var(--font-ui)" }}>パット数の内訳</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {puttDist.map((d) => (
            <div key={d.k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 'none', width: 52, font: "400 11.5px/1 var(--font-ui)", color: 'var(--sub)' }}>{d.k}</span>
              <div style={{ flex: 1, height: 9, borderRadius: 5, background: '#eeeae1', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: d.w, background: d.c }} />
              </div>
              <span style={{ flex: 'none', width: 34, textAlign: 'right', font: "600 14px/1 var(--font-num)" }}>{d.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ margin: '16px 20px 0', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ font: "700 15px/1 var(--font-ui)" }}>スコア推移</div>
          {trendDelta != null && (
            <div style={{ font: "400 11px/1 var(--font-ui)", color: 'var(--clay)' }}>
              直近{trend.length}ラウンドで{sign(-trendDelta)}
            </div>
          )}
        </div>
        {trend.length ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9, height: 104 }}>
            {trend.map((t, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  justifyContent: 'flex-end',
                  height: '100%',
                }}
              >
                <span style={{ font: "600 14px/1 var(--font-num)", color: 'var(--ink)' }}>{t.v}</span>
                <div style={{ width: '100%', borderRadius: '7px 7px 0 0', background: t.c, height: t.h }} />
                <span style={{ font: "400 9.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>{t.d}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ font: "400 12px/1.6 var(--font-ui)", color: 'var(--sub2)' }}>
            まだラウンド履歴がありません。ラウンドを終了すると、ここに推移が表示されます。
          </div>
        )}
      </div>

      <div style={{ margin: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ font: "700 15px/1 var(--font-ui)", padding: '0 2px' }}>ラウンド履歴</div>
        {history.length ? (
          [...history]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((r) => (
              <div key={r.id} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ font: "700 13.5px/1.3 var(--font-ui)" }}>{r.course}</div>
                    <div style={{ font: "400 11px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 4 }}>
                      {formatDateShort(r.date)} ／ パット {r.putts}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ font: "700 22px/1 var(--font-num)" }}>{r.score}</div>
                    <div style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>{sign(r.score - r.par)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, borderTop: '1px solid var(--line-soft)', paddingTop: 8 }}>
                  <span onClick={() => openEdit(r)} className="clickable" style={{ font: "500 11.5px/1 var(--font-ui)", color: 'var(--sub)' }}>
                    編集
                  </span>
                  <span onClick={() => removeEntry(r.id)} className="clickable" style={{ font: "500 11.5px/1 var(--font-ui)", color: 'var(--clay)' }}>
                    削除
                  </span>
                </div>
              </div>
            ))
        ) : (
          <div className="card" style={{ padding: 16, font: "400 12px/1.6 var(--font-ui)", color: 'var(--sub2)' }}>
            まだラウンド履歴がありません。
          </div>
        )}
      </div>

      {editingEntry && (
        <Modal title="ラウンド記録を編集" onClose={() => setEditingEntry(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>コース名</span>
              <input
                style={fieldStyle}
                value={editingEntry.course}
                onChange={(e) => setEditingEntry({ ...editingEntry, course: e.target.value })}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>日付</span>
              <input
                type="date"
                style={fieldStyle}
                value={editingEntry.date}
                onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
              />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                <span style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>スコア</span>
                <input
                  type="number"
                  style={fieldStyle}
                  value={editingEntry.score}
                  onChange={(e) => setEditingEntry({ ...editingEntry, score: e.target.value })}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                <span style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>パー</span>
                <input
                  type="number"
                  style={fieldStyle}
                  value={editingEntry.par}
                  onChange={(e) => setEditingEntry({ ...editingEntry, par: e.target.value })}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                <span style={{ font: "500 10.5px/1 var(--font-ui)", color: 'var(--sub2)' }}>パット</span>
                <input
                  type="number"
                  style={fieldStyle}
                  value={editingEntry.putts}
                  onChange={(e) => setEditingEntry({ ...editingEntry, putts: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div
            onClick={saveEdit}
            className="clickable"
            style={{ padding: 14, borderRadius: 13, background: 'var(--ink)', color: '#fff', textAlign: 'center', font: "700 14px/1 var(--font-ui)" }}
          >
            保存する
          </div>
        </Modal>
      )}
    </div>
  );
}
