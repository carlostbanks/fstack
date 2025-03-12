import React, {useState, useEffect} from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Line } from "react-simple-maps"
import './App.css';

const dummyData = [
  {
    altitude: 482.77,
    latitude: 40.71285,
    longitude: -74.00355,
    timestamp: "2025-03-11T14:53:25.375173",
  },
  {
    altitude: 547.93,
    latitude: 40.71512,
    longitude: -74.00361,
    timestamp: "2025-03-11T14:53:29.517448",
  },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const apiUrl = "http://127.0.0.1:5055/api/balloon-data";

function App() {
  const [balloonData, setBalloonData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [center, setCenter] = useState([-74.006, 40.7128]); // Default to NYC

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.length > 0) {
          setBalloonData(data);
          // Auto-center on the latest point
          const lastPoint = data[data.length - 1];
          setCenter([lastPoint.longitude, lastPoint.latitude]);
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
      <ComposableMap projection="geoAlbersUsa">
        <ZoomableGroup center={center} zoom={zoomLevel} minZoom={5} maxZoom={12}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#DDD", stroke: "#FFF" },
                    hover: { fill: "#F53", stroke: "#FFF" },
                    pressed: { fill: "#E42", stroke: "#FFF" },
                  }}
                />
              ))
            }
          </Geographies>
          {/* Draw the trajectory line */}
          {balloonData.length > 1 && (
            <Line
              coordinates={balloonData.map((point) => [point.longitude, point.latitude])}
              stroke="#FF0000"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )}
          {/* Render Markers for Balloons */}
          {balloonData.map((balloon, index) => (
            <Marker key={index} coordinates={[balloon.longitude, balloon.latitude]}>
              <circle r={5 / zoomLevel} fill="red" stroke="black" strokeWidth={0.5 / zoomLevel} />
              <text textAnchor="middle" y={-10 / zoomLevel} fontSize={10 / zoomLevel} fill="black">
                {`${balloon.altitude.toFixed(0)}m`}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default App;
