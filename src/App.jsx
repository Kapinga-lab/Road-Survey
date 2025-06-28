import { useState } from 'react';
import Navbar from './components/Navbar';
import Maps from './components/maps';
import RiskPrioritisation from './components/risk';
import Heatmap from './components/heatmap';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="min-h-screen bg-gray-100 min-w-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="">
        {activeTab === 'map' && (
          <div className="">
            <Maps />
          </div>
        )}
        {activeTab === 'risk' && (
          <div >
            <RiskPrioritisation />
          </div>
        )}
        {activeTab === 'heatmap' && (
          <div className="">
            <Heatmap/>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;