import { useGolf, liveTotals } from '../state/store.jsx';
import { COURSE, relName, sign, scoreCellStyle } from '../data/course.js';

const PAD_NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const PUTT_OPTIONS = [1, 2, 3, 4, 5];

function chipStyle(on) {
  return on
    ? { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }
    : { background: 'var(--card)', color: 'var(--sub)', borderColor: 'var(--line)' };
}

export default function Round() {
  const { state, prevHole, nextHole, setHole, setScore } = useGolf();
  const { hole: holeN, currentRound } = state;
  const { scores } = currentRound;

  const hole = COURSE.find((h) => h.n === holeN);
  const sc = scores[holeN] || {};
  const strokes = sc.s ?? hole.par;
  const putts = sc.p;
  const rel = strokes - hole.par;
  const relColor = rel <= 0 ? 'var(--green)' : rel >= 3 ? 'var(--clay)' : 'var(--sub)';

  const { total, parSum } = liveTotals(scores);

  const saveLabel = '保存して' + (holeN < 18 ? `${holeN + 1}番へ` : 'スコアカードへ');

  return (
    <div className="screen" style={{ background: 'var(--appbg)' }}>
      <div style={{ padding: '28px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="round-btn" data-testid="prev-hole" onClick={prevHole}>
          ←
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.14em', color: 'var(--sub2)' }}>HOLE</div>
          <div style={{ font: "700 30px/1 var(--font-num)", marginTop: 2 }}>{hole.n}</div>
        </div>
        <div className="round-btn" data-testid="next-hole" onClick={nextHole}>
          →
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          padding: '8px 0 0',
          font: "400 12px/1 var(--font-ui)",
          color: 'var(--sub)',
          whiteSpace: 'nowrap',
        }}
      >
        <span>PAR {hole.par}</span>
        <span style={{ color: '#c9cec9' }}>|</span>
        <span>{hole.yd} yd</span>
        <span style={{ color: '#c9cec9' }}>|</span>
        <span>HDCP {hole.hdcp}</span>
      </div>

      <div className="card" style={{ margin: '18px 20px 0', padding: 20, borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ font: "700 14px/1 var(--font-ui)" }}>打数</div>
          <div style={{ font: "500 12px/1 var(--font-ui)", color: relColor, whiteSpace: 'nowrap' }}>
            {sign(rel)} {relName(rel)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
          {PAD_NUMBERS.map((n) => (
            <div
              key={n}
              data-testid={`stroke-${n}`}
              onClick={() => setScore(holeN, { s: n })}
              className="clickable"
              style={{
                height: 64,
                borderRadius: 15,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                border: '1px solid',
                userSelect: 'none',
                ...chipStyle(strokes === n),
              }}
            >
              <span style={{ font: "600 27px/1 var(--font-num)" }}>{n === 10 ? '10+' : n}</span>
              <span style={{ font: "500 9.5px/1 var(--font-ui)", opacity: 0.72, whiteSpace: 'nowrap' }}>
                {n === 10 ? 'それ以上' : relName(n - hole.par)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ margin: '12px 20px 0', padding: '18px 20px', borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ font: "700 14px/1 var(--font-ui)" }}>パット数</div>
          <div style={{ font: "400 11px/1 var(--font-ui)", color: 'var(--sub2)', whiteSpace: 'nowrap' }}>グリーン上で打った数</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {PUTT_OPTIONS.map((v) => (
            <div
              key={v}
              data-testid={`putt-${v}`}
              onClick={() => setScore(holeN, { p: v })}
              className="clickable"
              style={{
                flex: 1,
                height: 52,
                borderRadius: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                font: "600 21px/1 var(--font-num)",
                ...chipStyle(putts === v),
              }}
            >
              {v === 5 ? '5+' : v}
            </div>
          ))}
        </div>
      </div>

      <div
        onClick={nextHole}
        data-testid="save-hole"
        className="clickable"
        style={{
          margin: '14px 20px 0',
          padding: 17,
          borderRadius: 16,
          background: 'var(--ink)',
          color: '#fff',
          textAlign: 'center',
          font: "700 15px/1 var(--font-ui)",
        }}
      >
        {saveLabel}
      </div>

      <div style={{ margin: '16px 0 0', padding: '14px 20px 18px', borderTop: '1px solid var(--line-soft)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: "400 11px/1 var(--font-ui)",
            color: 'var(--sub2)',
            marginBottom: 9,
          }}
        >
          <span>ここまでのスコア</span>
          <span>
            合計 {total} ／ {sign(total - parSum)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {COURSE.map((h) => {
            const v = scores[h.n]?.s;
            const s = scoreCellStyle(v, h.par);
            const active = h.n === holeN;
            return (
              <div
                key={h.n}
                onClick={() => setHole(h.n)}
                className="clickable"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
              >
                <div style={{ font: "500 8px/1 var(--font-mono)", color: active ? 'var(--ink)' : 'var(--sub2)' }}>{h.n}</div>
                <div
                  style={{
                    width: '100%',
                    height: 24,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: s.bg,
                    color: s.fg,
                    border: `1px solid ${active ? 'var(--ink)' : s.bd}`,
                    font: "600 13px/1 var(--font-num)",
                  }}
                >
                  {v ?? '–'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
