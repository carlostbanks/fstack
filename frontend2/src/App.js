import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './App.css';
import AltitudeChart from "./AltitudeChart";

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
  const [playing, setPlaying] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animatedPath, setAnimatedPath] = useState([]);
  const [animatedMarkers, setAnimatedMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.length > 0) {
          setBalloonData((prevData) => {
            // Ensure new data points are added without removing previous ones
            const newPoints = data.filter(newPoint => 
              !prevData.some(existingPoint => existingPoint.timestamp === newPoint.timestamp)
            );
            // Merge and sort all data points by timestamp
            return [...prevData, ...newPoints].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          });
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

  useEffect(() => {
    if (playing) {
      setAnimatedPath([]);
      setAnimatedMarkers([]);
      setAnimationIndex(0);
    }
  }, [playing]);

  useEffect(() => {
    if (playing && animationIndex < balloonData.length) {
      const timer = setTimeout(() => {
        setAnimatedPath(balloonData.slice(0, animationIndex + 1));
        setAnimatedMarkers(balloonData.slice(0, animationIndex + 1));
        setAnimationIndex(animationIndex + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playing, animationIndex, balloonData]);

  return (
    <div className="App">
      <h1>Balloon Tracking System by Carlos Banks</h1>
      <button className="play-button" onClick={() => setPlaying(!playing)}>
        {playing ? "Stop" : "Play"}
      </button>
      <div className="container">
        <div className="map-container">
          <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="leaflet-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {playing ? (
              <Polyline positions={animatedPath.map((point) => [point.latitude, point.longitude])} color="red" />
            ) : (
              <Polyline positions={balloonData.map((point) => [point.latitude, point.longitude])} color="red" />
            )}
            {(playing ? animatedMarkers : balloonData).map((balloon, index) => (
              <Marker key={index} position={[balloon.latitude, balloon.longitude]} icon={balloonIcon}>
                <Popup>
                  <b>Latitude:</b> {balloon.latitude.toFixed(6)} <br />
                  <b>Longitude:</b> {balloon.longitude.toFixed(6)} <br />
                  <b>Altitude:</b> {balloon.altitude.toFixed(2)}m <br />
                  <b>Timestamp:</b> {new Date(balloon.timestamp).toLocaleString()} <br />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <AltitudeChart balloonData={balloonData} />
      </div>
    </div>
  );
}

export default App;
