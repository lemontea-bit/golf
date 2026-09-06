import { useGolf } from '../state/store.jsx';
import { COURSE, PINS, PIN_TIPS } from '../data/course.js';

const TIER_Y = { 手前: 112, 中央: 75, 奥: 38 };
const SIDE_X = { 左: 38, 中央: 59, 右: 80 };

function chipStyle(on) {
  return on
    ? { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }
    : { background: 'var(--card)', color: 'var(--sub)', borderColor: 'var(--line)' };
}

export default function HoleMap() {
  const { state, setMapHole } = useGolf();
  const pin = PINS[state.mapHole];
  const tip = PIN_TIPS[pin.tier];

  const tierY = TIER_Y[pin.tier];
  const sideX = SIDE_X[pin.side];
  const flagY = tierY - 22;
  const mapLeft = 176 + (sideX - 59) * 0.6;
  const mapTop = 48 + (tierY - 75) * 0.32;
  const badgeLeft = 194 + (sideX - 59) * 0.6;
  const badgeTop = 40 + (tierY - 75) * 0.32;

  const pinRows = [
    { k: '手前まで', v: pin.front, hi: false },
    { k: 'センター', v: pin.center, hi: true },
    { k: '奥まで', v: pin.back, hi: false },
  ];

  return (
    <div className="screen" style={{ background: 'var(--appbg)' }}>
      <div style={{ padding: '28px 20px 0' }}>
        <div style={{ font: "700 20px/1.3 var(--font-ui)" }}>ホールマップ</div>
        <div style={{ font: "400 11.5px/1 var(--font-ui)", color: 'var(--sub2)', marginTop: 5 }}>
          当日のピン位置 ／ 09:40 コース提供データ更新
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, overflow: 'auto', padding: '14px 20px 0' }}>
        {COURSE.map((h) => (
          <div
            key={h.n}
            onClick={() => setMapHole(h.n)}
            className="clickable"
            style={{
              flex: 'none',
              minWidth: 38,
              padding: '8px 0',
              textAlign: 'center',
              borderRadius: 10,
              border: '1px solid',
              font: "600 14px/1 var(--font-num)",
              ...chipStyle(state.mapHole === h.n),
            }}
          >
            {h.n}
          </div>
        ))}
      </div>

      <div
        style={{
          margin: '14px 20px 0',
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          position: 'relative',
          height: 230,
          background: '#dfe3d6',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 360 230" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <pattern id="ph" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#d5dac9" />
              <rect width="4" height="10" fill="#cbd1bd" />
            </pattern>
          </defs>
          <rect width="360" height="230" fill="url(#ph)" />
          <ellipse cx="182" cy="150" rx="52" ry="66" fill="#9db884" opacity="0.85" />
          <ellipse cx="180" cy="52" rx="34" ry="26" fill="#b9cf99" />
          <ellipse cx="146" cy="82" rx="11" ry="8" fill="#e2d3a8" />
          <circle cx="182" cy="216" r="6" fill="#fdfcf9" stroke="#525b58" strokeWidth="2" />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 38,
            transform: 'translate(-50%,0)',
            width: 2,
            height: 170,
            background: 'repeating-linear-gradient(to bottom,#fdfcf9 0 6px,transparent 6px 12px)',
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: mapLeft,
            top: mapTop,
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'var(--clay)',
            boxShadow: '0 0 0 2px #fdfcf9',
          }}
        />
        <div
          key={state.mapHole}
          style={{
            position: 'absolute',
            left: mapLeft,
            top: mapTop,
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'var(--clay)',
            animation: 'pinPulse 2.2s ease-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: badgeLeft,
            top: badgeTop,
            padding: '5px 9px',
            borderRadius: 8,
            background: 'rgba(20,25,27,.82)',
            color: '#fff',
            font: "500 10.5px/1.3 var(--font-ui)",
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(6px)',
          }}
        >
          ピン ／ {pin.tier}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 14,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(253,252,249,.9)',
            font: "500 10px/1 var(--font-mono)",
            color: 'var(--sub)',
          }}
        >
          AERIAL PHOTO PLACEHOLDER
        </div>
        <div style={{ position: 'absolute', right: 14, bottom: 14, textAlign: 'right' }}>
          <div style={{ font: "700 30px/1 var(--font-num)", color: 'var(--ink)' }}>
            {pin.center}
            <span style={{ fontSize: 15 }}>yd</span>
          </div>
          <div style={{ font: "400 10px/1 var(--font-ui)", color: 'var(--sub)', marginTop: 2 }}>残り／センターまで</div>
        </div>
      </div>

      <div className="card" style={{ margin: '14px 20px 0', padding: 18, display: 'flex', gap: 18, alignItems: 'center' }}>
        <div style={{ flex: 'none', width: 118, height: 150, position: 'relative' }}>
          <svg width="118" height="150" viewBox="0 0 118 150" style={{ display: 'block' }}>
            <ellipse cx="59" cy="75" rx="50" ry="70" fill="#a8c47f" />
            <ellipse cx="59" cy="75" rx="50" ry="70" fill="none" stroke="#7d9c5c" strokeWidth="1.5" />
            <line x1="12" y1="52" x2="106" y2="52" stroke="#fdfcf9" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.9" />
            <line x1="12" y1="99" x2="106" y2="99" stroke="#fdfcf9" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.9" />
            <ellipse cx="16" cy="120" rx="12" ry="9" fill="#e2d3a8" />
            <circle cx={sideX} cy={tierY} r="4.5" fill="#c0764a" />
            <line x1={sideX} y1={tierY} x2={sideX} y2={flagY} stroke="#c0764a" strokeWidth="2" />
            <rect x={sideX} y={flagY} width="13" height="9" fill="#c0764a" />
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div>
            <div style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.12em', color: 'var(--sub2)' }}>TODAY'S PIN</div>
            <div style={{ font: "700 19px/1.3 var(--font-ui)", marginTop: 5 }}>
              グリーン{pin.tier}／{pin.side}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pinRows.map((r) => (
              <div
                key={r.k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 9,
                  background: r.hi ? 'rgba(47,93,67,.1)' : 'rgba(20,25,27,.04)',
                }}
              >
                <span style={{ font: "500 11.5px/1 var(--font-ui)", color: r.hi ? 'var(--green)' : 'var(--sub)' }}>{r.k}</span>
                <span style={{ font: "600 17px/1 var(--font-num)", color: r.hi ? 'var(--green)' : 'var(--sub)' }}>
                  {r.v}
                  <span style={{ fontSize: 10 }}>yd</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          margin: '12px 20px 20px',
          padding: '14px 16px',
          borderRadius: 14,
          background: 'rgba(192,118,74,.09)',
          border: '1px solid rgba(192,118,74,.22)',
          font: "400 12px/1.7 var(--font-ui)",
          color: '#7a4526',
        }}
      >
        {tip}
      </div>
    </div>
  );
}
