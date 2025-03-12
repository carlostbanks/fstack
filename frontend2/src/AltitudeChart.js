import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./AltitudeChart.css";

function AltitudeChart({ balloonData }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (balloonData.length > 0) {
      setChartData(
        balloonData.map((point) => ({
          time: new Date(point.timestamp).toLocaleTimeString(),
          altitude: point.altitude,
        }))
      );
    }
  }, [balloonData]);

  return (
    <div className="chart-container">
      <h3>Altitude Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 30, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
          <YAxis label={{ value: 'Altitude (m)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="altitude" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AltitudeChart;