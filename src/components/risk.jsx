import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const severityColors = {
  high: 'red',
  medium: 'orange',
  low: 'yellow',
  negligible: 'lightgreen',
};

const RiskPrioritisation = ({ setActiveTab, setMapFocus }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/Data_Cracks and Potholes 2.xlsx')
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const wb = XLSX.read(buffer, { type: 'buffer' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const formatted = json
          .filter((row) => row['Lattitude'] && row['Longtitude'])
          .map((row, index) => ({
            id: index + 1,
            location: row['Location address']?.trim() || 'Unknown',
            latitude: row['Lattitude'],
            longitude: row['Longtitude'],
            severity: row['Severity']?.trim().toLowerCase() || 'none',
            ratingQuarter: (row['Rating'] || '').toString().trim().toUpperCase(),
          }));

        setData(formatted);
      });
  }, []);

  const handleLocationClick = (lat, lng) => {
    setMapFocus({ lat, lng, zoom: 17}); 
    setActiveTab('map');
  };

  return (
    <div className="p-6 overflow-x-auto">
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eee', fontWeight: 'bold' }}>
            <td style={cellStyle}>S.No</td>
            <td style={cellStyle}>Location</td>
            <td style={cellStyle}>Latitude Longitude</td>
            <td style={cellStyle}>Severity</td>
            <td style={cellStyle}>Q1</td>
            <td style={cellStyle}>Q2</td>
            <td style={cellStyle}>Q3</td>
            <td style={cellStyle}>Q4</td>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={cellStyle}>{row.id}</td>
              <td style={cellStyle}>{row.location}</td>
              <td
                style={{ ...cellStyle, cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                onClick={() => handleLocationClick(row.latitude, row.longitude)}
              >
                {row.latitude}, {row.longitude}
              </td>
              <td style={cellStyle}>{row.severity}</td>
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                <td
                  key={quarter}
                  style={{
                    ...cellStyle,
                    backgroundColor:
                      row.ratingQuarter === quarter ? severityColors[row.severity] || '' : '',
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
};

export default RiskPrioritisation;
