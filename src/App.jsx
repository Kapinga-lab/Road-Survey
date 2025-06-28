import { useState } from 'react';
import Navbar from './components/Navbar';
import Maps from './components/maps';
import RiskPrioritisation from './components/risk';
import Heatmap from './components/heatmap';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [mapFocus, setMapFocus] = useState(null); // Focus location from Risk tab

  return (
    <div className="min-h-screen bg-gray-100 min-w-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'map' && <Maps mapFocus={mapFocus} />}
        {activeTab === 'risk' && (
          <RiskPrioritisation setActiveTab={setActiveTab} setMapFocus={setMapFocus} />
        )}
        {activeTab === 'heatmap' && <Heatmap />}
      </main>
    </div>
  );
}

export default App;
