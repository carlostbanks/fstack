import React, {useState, useEffect} from "react"
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './App.css';

const apiUrl = "http://127.0.0.1:5055/api/balloon-data";

const balloonIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example balloon icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

function App() {
  const [balloonData, setBalloonData] = useState([]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default to NYC

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.length > 0) {
          setBalloonData(data);
          // Center map on latest balloon location
          const lastPoint = data[data.length - 1];
          setMapCenter([lastPoint.latitude, lastPoint.longitude]);
        }
      } catch (error) {
        console.error("Error fetching balloon data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} style={{ height: "90vh", width: "100%" }}>
        {/* Tile layer for real-world map */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Draw the trajectory line */}
        {balloonData.length > 1 && (
          <Polyline positions={balloonData.map((point) => [point.latitude, point.longitude])} color="red" />
        )}

        {/* Render Markers for Balloons */}
        {balloonData.map((balloon, index) => (
          <Marker key={index} position={[balloon.latitude, balloon.longitude]} icon={balloonIcon}>
            <Popup>
              Altitude: {balloon.altitude.toFixed(0)}m <br />
              Time: {new Date(balloon.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
