import { GolfProvider, useGolf } from './state/store.jsx';
import TabBar from './components/TabBar.jsx';
import Home from './components/Home.jsx';
import Round from './components/Round.jsx';
import HoleMap from './components/HoleMap.jsx';
import Scorecard from './components/Scorecard.jsx';
import Search from './components/Search.jsx';

function Screen() {
  const { state } = useGolf();
  switch (state.tab) {
    case 'round':
      return <Round />;
    case 'map':
      return <HoleMap />;
    case 'rec':
      return <Scorecard />;
    case 'search':
      return <Search />;
    case 'home':
    default:
      return <Home />;
  }
}

function Shell() {
  const { state } = useGolf();
  return (
    <div className="app-shell">
      <Screen />
      {state.tab !== 'search' && <TabBar />}
    </div>
  );
}

export default function App() {
  return (
    <GolfProvider>
      <Shell />
    </GolfProvider>
  );
}
