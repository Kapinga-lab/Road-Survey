import { useState } from 'react';

// Navbar Component
const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white border-b border-gray-300 shadow-sm w-full">
      <div className="flex justify-between items-center px-2 py-2">
       
        <h2 className="text-xl font-bold text-gray-900">
          Cracks & Pothole Analysis
        </h2>
        <div className="flex space-x-2 px-4">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Map View
          </button>
          {/* <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Heat Map
          </button> */}
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'risk'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Risk Prioritisation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;