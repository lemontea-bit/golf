import { useGolf } from '../state/store.jsx';

const TABS = [
  ['home', 'ホーム', 'HOME'],
  ['round', 'ラウンド', 'ROUND'],
  ['map', 'マップ', 'MAP'],
  ['rec', '記録', 'CARD'],
];

export default function TabBar() {
  const { state, setTab } = useGolf();
  return (
    <div className="tabbar">
      {TABS.map(([key, ja, en]) => (
        <button
          key={key}
          type="button"
          data-testid={`tab-${key}`}
          className={'tab' + (state.tab === key ? ' active' : '')}
          onClick={() => setTab(key)}
        >
          <div className="tab-k">{ja}</div>
          <div className="tab-en">{en}</div>
        </button>
      ))}
    </div>
  );
}
