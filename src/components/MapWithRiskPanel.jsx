import { useState } from 'react';
import Heatmap from './heatmap';
import RiskPrioritisation from './risk';

export default function MapWithRiskPanel({ setMapFocus, mapFocus, setActiveTab }) {
  const [tableVisible, setTableVisible] = useState(true);

  return (
    <div style={{ position: 'relative', height: '90vh', width: '100vw' }}>
      {/* Main Map */}
      <Heatmap mapFocus={mapFocus} />

      {/* Floating Risk Table */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: '500px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        {/* Toggle Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 12px',
            backgroundColor: '#f5f5f5',
            color: 'black',
            borderBottom: '1px solid #ddd',
            cursor: 'pointer',
          }}
          onClick={() => setTableVisible(!tableVisible)}
        >
          <strong>Risk Prioritisation</strong>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            {tableVisible ? '−' : '+'}
          </span>
        </div>

        {tableVisible && (
          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            <RiskPrioritisation
              setActiveTab={setActiveTab}
              setMapFocus={setMapFocus}
            />
          </div>
        )}
      </div>
    </div>
  );
}
