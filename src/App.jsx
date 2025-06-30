import { useState } from 'react';
import Navbar from './components/Navbar';
import Maps from './components/maps';
import MapWithRiskPanel from './components/MapWithRiskPanel';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [mapFocus, setMapFocus] = useState(null); // <-- add this

  return (
    <div className="min-h-screen bg-gray-100 min-w-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'map' && <Maps mapFocus={mapFocus} />}
        {activeTab === 'heatmap' && (
          <MapWithRiskPanel
            setActiveTab={setActiveTab}
            mapFocus={mapFocus}
            setMapFocus={setMapFocus}
          />
        )}
      </main>
    </div>
  );
}

export default App;
