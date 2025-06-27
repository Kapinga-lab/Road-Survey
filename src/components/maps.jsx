import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as XLSX from 'xlsx';
import L from 'leaflet';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});


const iconColors = {
  Pothole: 'red',
  'Aligator Crack': 'orange',
  Trashcan: 'blue',
  'Zebra crossing paint damage': 'purple',
  Bin: 'green',
  'Horizontal Crack': 'yellow',
  'Vertical Crack': 'brown',
};

// Marker icon generator
const getCustomIcon = (type) => {
  const color = iconColors[type] || 'gray';
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 2px #000;
    "></div>`,
    iconSize: [16, 16],
    className: 'custom-div-icon',
  });
};

function Maps() {
  const [markers, setMarkers] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(() =>
    Object.keys(iconColors).reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );

  useEffect(() => {
    fetch('/Data_Cracks and Potholes (1).xlsx')
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const formatted = json
          .filter((row) => row['Lattitude'] && row['Longtitude'])
          .map((row) => ({
            lat: parseFloat(row['Lattitude']),
            lng: parseFloat(row['Longtitude']),
            location: row['Location address'],
            crackType: row['Crack/Pothole'],
            type: row['Type'],
            height: row['Height'],
            width: row['Width'],
            severity: row['Severity'],
            rating: row['Rating'],
            cost: row['Cost of repairing'],
          }));

        setMarkers(formatted);
      });
  }, []);

  
  const toggleType = (type) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  
  const allSelected = Object.values(selectedTypes).every(Boolean);
  const toggleAll = () => {
    const newState = Object.keys(iconColors).reduce((acc, type) => ({
      ...acc,
      [type]: !allSelected,
    }), {});
    setSelectedTypes(newState);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={[37.0902, -95.7129]}
        zoom={4}
        maxZoom={22}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers
          .filter((marker) => selectedTypes[marker.type])
          .map((marker, idx) => (
            <Marker
              key={idx}
              position={[marker.lat, marker.lng]}
              icon={getCustomIcon(marker.type)}
            >
              <Popup>
                <strong>{marker.type}</strong><br />
                {marker.crackType}<br />
                {marker.location}<br />
                <small>
                  Height: {marker.height}, Width: {marker.width}<br />
                  Severity: {marker.severity}, Rating: {marker.rating}<br />
                  Cost: ₹{marker.cost}
                </small>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Legend + Filter */}
      <div style={{
        color: 'black',
        position: 'absolute',
        bottom: 10,
        right: 10,
        background: 'white',
        padding: '10px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1000,
        maxWidth: '260px',
        fontSize: '14px',
        overflowY: 'auto',
        maxHeight: '50vh',
      }}>
        <h4 style={{ marginBottom: '8px' }}>Type</h4>

        
        <label style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            style={{ marginRight: 8 }}
          />
          Select All
        </label>

        {Object.entries(iconColors).map(([type, color]) => (
          <label
            key={type}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 6, cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={selectedTypes[type]}
              onChange={() => toggleType(type)}
              style={{ marginRight: 8 }}
            />
            <span style={{
              width: 14,
              height: 14,
              backgroundColor: color,
              display: 'inline-block',
              marginRight: 8,
              borderRadius: '50%',
              border: '1px solid #555',
            }} />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Maps;
