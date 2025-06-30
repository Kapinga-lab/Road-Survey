import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as XLSX from 'xlsx';
import L from 'leaflet';

const iconColors = {
  Pothole: 'red',
'Alligator Crack': 'orange',
Trashcan: 'blue',
'Damage Paint': 'purple',
Manhole: 'green',
'Horizontal Crack': 'yellow',

};

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

function FlyToLocation({ mapFocus, onFlyComplete }) {
  const map = useMap();

  useEffect(() => {
    if (mapFocus?.lat && mapFocus?.lng) {
      map.flyTo([mapFocus.lat, mapFocus.lng], mapFocus.zoom || 18, {
        animate: true,
        duration: 1.5,
      });
      const timeout = setTimeout(() => {
        if (onFlyComplete) onFlyComplete(mapFocus.lat, mapFocus.lng);
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [mapFocus]);

  return null;
}

function AnimatedMarker({ marker, markerRefs }) {
  const map = useMap();
  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current) {
      markerRefs.current[`${marker.lat}_${marker.lng}`] = markerRef.current;
    }
  }, [marker, markerRefs]);

  const handleClick = () => {
    map.flyTo([marker.lat, marker.lng], 18, {
      animate: true,
      duration: 1.2,
    });
  };

  return (
    <Marker
      ref={markerRef}
      position={[marker.lat, marker.lng]}
      icon={getCustomIcon(marker.type)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup autoPan={true}>
        <strong>{marker.type}</strong><br />
        {marker.crackType}<br />
        {marker.location}<br />
        <small>
          <strong>Latitude, Longitude:</strong> {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}<br />
          Height: {marker.height}, Width: {marker.width}<br />
          Severity: {marker.severity}, Rating: {marker.rating}<br />
          Cost: ${marker.cost}
        </small><br />
        {marker.image && (
          <img
            src={marker.image.startsWith('http') ? marker.image : `/potholes/${marker.image}`}
            alt="Issue"
            style={{
              width: '100%',
              maxWidth: '200px',
              marginTop: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        )}
      </Popup>
    </Marker>
  );
}

function Maps({ mapFocus }) {
  const [markers, setMarkers] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(() =>
    Object.keys(iconColors).reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );
  const [legendVisible, setLegendVisible] = useState(true);
  const markerRefs = useRef({});

  useEffect(() => {
    fetch('/Data_Cracks and Pothole.xlsx')
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
            image: row['Image'],
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

  const openPopup = (lat, lng) => {
    const ref = markerRefs.current[`${lat}_${lng}`];
    if (ref) ref.openPopup();
  };

  return (
    <div style={{ height: '90vh', width: '100vw', position: 'relative' }}>
      <MapContainer
        center={[36.7783, -119.4179]}
        zoom={6}
        maxZoom={22}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation mapFocus={mapFocus} onFlyComplete={openPopup} />
        {markers
          .filter((marker) => selectedTypes[marker.type])
          .map((marker, idx) => (
            <AnimatedMarker key={idx} marker={marker} markerRefs={markerRefs} />
          ))}
      </MapContainer>

      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1001,
        width: '260px',
        fontSize: '14px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          backgroundColor: '#f5f5f5',
          color: 'black',
          borderBottom: '1px solid #ddd',
          cursor: 'pointer',
        }} onClick={() => setLegendVisible(!legendVisible)}>
          <strong>Filter by Type</strong>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#007bff',
          }}>
            {legendVisible ? '−' : '+'}
          </span>
        </div>

        {legendVisible && (
          <div style={{
            padding: '10px 12px',
            maxHeight: '45vh',
            overflowY: 'auto'
          }}>
            <label style={{
              display: 'flex',
              color: 'black',
              alignItems: 'center',
              marginBottom: 10,
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
                style={{
                  display: 'flex',
                  color: 'black',
                  alignItems: 'center',
                  marginBottom: 6,
                  cursor: 'pointer'
                }}
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
        )}
      </div>
    </div>
  );
}

export default Maps;
