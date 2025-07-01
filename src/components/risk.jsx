import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const severityColors = {
  high: "red",
  medium: "orange",
  low: "yellow",
  negligible: "lightgreen",
};

const ratingColors = {
  P1: "red",
  P2: "orange",
  P3: "yellow",
  P4: "lightgreen",
};

const RiskPrioritisation = ({ setActiveTab, setMapFocus }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Data_Cracks and Pothole_1.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const wb = XLSX.read(buffer, { type: "buffer" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const formatted = json
          .filter((row) => row["Lattitude"] && row["Longtitude"])
          .map((row, index) => ({
            id: index + 1,
            location: row["Location address"]?.trim() || "Unknown",
            latitude: row["Lattitude"],
            longitude: row["Longtitude"],
            severity: row["Severity"]
              ? row["Severity"].trim().charAt(0).toUpperCase() +
                row["Severity"].trim().slice(1).toLowerCase()
              : "None",
            Rating: (row["Rating"] || "").toString().trim().toUpperCase(),
          }))
          .sort((a, b) => {
            const order = { P1: 1, P2: 2, P3: 3, P4: 4 };
            return (order[a.Rating] || 5) - (order[b.Rating] || 5);
          });

        setData(formatted);
      });
  }, []);

  const handleLocationClick = (lat, lng) => {
    setMapFocus({ lat, lng, zoom: 17 });
    setActiveTab("map");
  };

  return (
    <div className="p-6 overflow-x-auto">
      <table
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#eee", fontWeight: "bold" }}>
            <td style={cellStyle}>ID</td>
            <td style={cellStyle}>Location</td>
            <td style={cellStyle}>Latitude Longitude</td>
            <td style={cellStyle}>Rating</td>
            <td style={cellStyle}>Severity</td>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={cellStyle}>{row.id}</td>
              <td style={cellStyle}>{row.location}</td>
              <td
                style={{
                  ...cellStyle,
                  cursor: "pointer",
                  color: "#007bff",
                  textDecoration: "underline",
                }}
                onClick={() => handleLocationClick(row.latitude, row.longitude)}
              >
                {row.latitude}, {row.longitude}
              </td>
              <td
                style={{
                  ...cellStyle,
                  backgroundColor: ratingColors[row.Rating] || "",
                  color: "black",
                }}
              >
                {row.Rating}
              </td>
              <td style={cellStyle}>{row.severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  wordWrap: "break-word",
  fontSize: "12px",
};

export default RiskPrioritisation;
