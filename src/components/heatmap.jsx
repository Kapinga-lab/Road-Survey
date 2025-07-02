import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import * as XLSX from "xlsx";
import "leaflet/dist/leaflet.css";

const ratingColors = {
  p1: "red",
  p2: "orange",
  p3: "yellow",
  p4: "lightgreen",
};

export default function Heatmap() {
  const [clusterData, setClusterData] = useState([]);

  useEffect(() => {
    fetch("/Data_Cracks and Pothole_1.xlsx")
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const clusterGroups = {};

        json.forEach((row) => {
          const cluster = row.Cluster;
          const lat = parseFloat(row.Lattitude);
          const lng = parseFloat(row.Longtitude);
          const rating = (row.Rating || "").toString().trim().toLowerCase();
          const cost = parseFloat(row["Cost of repairing"]) || 0;
          const location = row["Location address"]?.trim() || "Unknown";

          if (!lat || !lng || !cluster) return;

          if (!clusterGroups[cluster]) clusterGroups[cluster] = [];

          clusterGroups[cluster].push({ lat, lng, rating, cost, location });
        });

        const clusters = Object.entries(clusterGroups).map(([clusterId, group]) => {
          const avgLat = group.reduce((sum, p) => sum + p.lat, 0) / group.length;
          const avgLng = group.reduce((sum, p) => sum + p.lng, 0) / group.length;
          const avgCost = group.reduce((sum, p) => sum + p.cost, 0) / group.length;
          const mainRating = group[0].rating;
          const mainLocation = group[0].location;

          return {
            id: clusterId,
            lat: avgLat,
            lng: avgLng,
            avgCost: avgCost.toFixed(2),
            rating: mainRating,
            location: mainLocation,
          };
        });

        setClusterData(clusters);
      });
  }, []);

  return (
    <div style={{ position: 'relative', height: "90vh", width: "100vw" }}>
      {/* Fixed-position Power BI Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() =>
            window.open(
              "https://app.powerbi.com/groups/me/reports/d0ae55d5-522c-4ff1-a7a1-f66958ea36f5/d54b53605101dd04a90b?experience=power-bi",
              "_blank"
            )
          }
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          View Power BI Report
        </button>
      </div>

      <MapContainer
        center={[36.7783, -119.4179]}
        zoom={6}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clusterData.map((cluster) => (
          <CircleMarker
            key={cluster.id}
            center={[cluster.lat, cluster.lng]}
            radius={20}
            color={ratingColors[cluster.rating] || "gray"}
            fillColor={ratingColors[cluster.rating] || "gray"}
            fillOpacity={0.6}
            stroke={true}
            weight={2}
          >
            <Popup>
              <strong>Rating:</strong> {cluster.rating.toUpperCase()}<br />
              <strong>Location:</strong> {cluster.location}<br />
              <strong>Avg Repair Cost:</strong> ${cluster.avgCost}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
