import { useMemo, useState } from 'react';
import { useGolf, liveTotals, playedHoles } from '../state/store.jsx';
import { COURSE, sign, formatDateBadge } from '../data/course.js';
import { SEARCH_COURSES } from '../data/searchCourses.js';
import Modal from './Modal.jsx';

const PIN_COURSE_COUNT = SEARCH_COURSES.filter((c) => c.tags.some((t) => t.k === 'ピン位置データ提供')).length;

export default function Home() {
  const { state, setTab, setUserName } = useGolf();
  const { user, currentRound, history } = state;
  const { scores } = currentRound;

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);

  const today = useMemo(() => formatDateBadge(new Date()), []);
  const played = playedHoles(scores);
  const { total, parSum } = liveTotals(scores);

  function openNameEditor() {
    setNameDraft(user.name);
    setEditingName(true);
  }

  function saveName() {
    setUserName(nameDraft);
    setEditingName(false);
  }

  const stats = useMemo(() => {
    if (history.length === 0) {
      return [
        { v: '－', k: '平均スコア' },
        { v: '－', k: 'ベスト' },
        { v: '－', k: '平均パット' },
      ];
    }
    const avgScore = Math.round(history.reduce((a, r) => a + r.score, 0) / history.length);
    const best = Math.min(...history.map((r) => r.score));
    const avgPutts = (history.reduce((a, r) => a + r.putts, 0) / history.length).toFixed(1);
    return [
      { v: avgScore, k: '平均スコア' },
      { v: best, k: 'ベスト' },
      { v: avgPutts, k: '平均パット' },
    ];
  }, [history]);

  return (
    <div className="screen" style={{ background: 'var(--appbg)' }}>
      <div style={{ padding: '28px 20px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.12em', color: 'var(--sub2)' }}>{today}</div>
          <div style={{ font: "700 22px/1.35 var(--font-ui)", marginTop: 5 }}>こんにちは、{user.name}さん</div>
        </div>
        <div
          onClick={openNameEditor}
          className="clickable"
          title="名前を編集"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--green)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: "700 15px/1 var(--font-ui)",
          }}
        >
          {user.avatar}
        </div>
      </div>

      {editingName && (
        <Modal title="名前を編集" onClose={() => setEditingName(false)}>
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            placeholder="表示名"
            maxLength={20}
            style={{
              padding: '14px 16px',
              background: 'var(--appbg)',
              border: '1px solid var(--line)',
              borderRadius: 13,
              font: "400 15px/1 var(--font-ui)",
              color: 'var(--ink)',
              width: '100%',
            }}
          />
          <div
            onClick={saveName}
            className="clickable"
            style={{
              padding: 14,
              borderRadius: 13,
              background: 'var(--ink)',
              color: '#fff',
              textAlign: 'center',
              font: "700 14px/1 var(--font-ui)",
            }}
          >
            保存する
          </div>
        </Modal>
      )}

      <div
        style={{
          margin: '8px 20px 0',
          padding: 20,
          borderRadius: 18,
          background: 'var(--green)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.12em', color: 'rgba(255,255,255,.7)' }}>
              ROUND IN PROGRESS
            </div>
            <div style={{ font: "700 17px/1.4 var(--font-ui)", marginTop: 6 }}>
              {currentRound.teeName ? `${currentRound.course} ／ ${currentRound.teeName}` : currentRound.course}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: "700 34px/1 var(--font-num)" }}>{played ? sign(total - parSum) : '±0'}</div>
            <div style={{ font: "400 10px/1 var(--font-ui)", color: 'rgba(255,255,255,.72)', marginTop: 3 }}>現在のスコア</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {COURSE.map((h) => (
            <div
              key={h.n}
              style={{
                flex: 1,
                height: 5,
                borderRadius: 3,
                background: scores[h.n]?.s ? '#fff' : 'rgba(255,255,255,.25)',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ font: "400 12px/1 var(--font-ui)", color: 'rgba(255,255,255,.8)' }}>{played} / 18 ホール入力済み</div>
          <div
            onClick={() => setTab('round')}
            className="clickable"
            style={{
              padding: '11px 18px',
              borderRadius: 999,
              background: '#fff',
              color: 'var(--green)',
              font: "700 13px/1 var(--font-ui)",
            }}
          >
            {played ? '入力を続ける →' : '入力を開始する →'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '16px 20px 0' }}>
        {stats.map((s) => (
          <div key={s.k} className="card" style={{ padding: '14px 12px' }}>
            <div style={{ font: "700 26px/1 var(--font-num)", color: 'var(--ink)' }}>{s.v}</div>
            <div style={{ font: "400 10.5px/1.4 var(--font-ui)", color: 'var(--sub2)', marginTop: 5 }}>{s.k}</div>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{ margin: '16px 20px 0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div style={{ font: "500 10px/1 var(--font-mono)", letterSpacing: '.12em', color: 'var(--clay)' }}>TODAY'S TIP</div>
        <div style={{ font: "700 14px/1.5 var(--font-ui)" }}>ピンが「奥」の日はグリーン中央を狙う</div>
        <div style={{ font: "400 12px/1.7 var(--font-ui)", color: 'var(--sub)' }}>
          奥のピンを直接狙うと大きくオーバーしがち。中央に乗せれば2パット圏内です。マップタブで当日の段位置を確認できます。
        </div>
      </div>

      <div
        onClick={() => setTab('search')}
        className="card clickable"
        style={{
          margin: '12px 20px 0',
          padding: '15px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ font: "700 14px/1.4 var(--font-ui)" }}>ゴルフ場を探す</div>
          <div style={{ font: "400 11.5px/1.5 var(--font-ui)", color: 'var(--sub2)', marginTop: 3 }}>
            ピン位置データ提供コース {PIN_COURSE_COUNT}件
          </div>
        </div>
        <div style={{ font: "500 16px/1 var(--font-num)", color: 'var(--sub2)' }}>→</div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}
