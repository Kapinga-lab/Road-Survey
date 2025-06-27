import L from 'leaflet';

const iconColors = {
  Pothole: 'red',
  'Aligator Crack': 'orange',
  Trashcan: 'blue',
  'Zebra crossing paint damage': 'purple',
  Bin: 'green',
  'Horizontal Crack': 'yellow',
  'Vertical Crack': 'brown',
};

export const getCustomIcon = (type) => {
  const color = iconColors[type] || 'gray';
  return new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};
