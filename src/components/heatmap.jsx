import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import * as XLSX from "xlsx";
import "leaflet/dist/leaflet.css";

const ratingColors = {
  q1: "red",
  q2: "orange",
  q3: "yellow",
  q4: "lightgreen",
};

export default function Heatmap() {
  const [clusterData, setClusterData] = useState([]);

  useEffect(() => {
    fetch("/Data_Cracks and Potholes 2.xlsx")
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

          if (!lat || !lng || !cluster) return;

          if (!clusterGroups[cluster]) clusterGroups[cluster] = [];

          clusterGroups[cluster].push({ lat, lng, rating, cost });
        });

        const clusters = Object.entries(clusterGroups).map(([clusterId, group]) => {
          const avgLat = group.reduce((sum, p) => sum + p.lat, 0) / group.length;
          const avgLng = group.reduce((sum, p) => sum + p.lng, 0) / group.length;
          const avgCost = group.reduce((sum, p) => sum + p.cost, 0) / group.length;
          const mainRating = group[0].rating;

          return {
            id: clusterId,
            lat: avgLat,
            lng: avgLng,
            avgCost: avgCost.toFixed(2),
            rating: mainRating,
          };
        });

        setClusterData(clusters);
      });
  }, []);

  return (
    <div style={{ height: "90vh", width: "100vw" }}>
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
              {/* <strong>Cluster:</strong> {cluster.id}<br /> */}
              <strong>Rating:</strong> {cluster.rating.toUpperCase()}<br />
              <strong>Avg Repair Cost:</strong> ${cluster.avgCost}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
