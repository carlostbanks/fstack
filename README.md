# Balloon Tracking System

This is a full-stack development task to assess your skills in building a real-time tracking system for a balloon's journey.

## Task Overview

You'll be building a system that tracks a balloon's position and altitude over time, visualizing this data through an interactive map and chart interface.

## Backend Tasks

1. Enhance the existing Flask API to include a new endpoint `/api/balloon-data` that returns balloon tracking information:
   - Each data point should include:
     ```json
     {
       "latitude": ...,
       "longitude": ...,
       "altitude": ...,
       "timestamp": ...
     }
     ```
   - The endpoint should return an array of these data points

## Frontend Tasks

### 1. Map Component Implementation
- Integrate react-simple-maps into the application
- Create a map component that displays the balloon's journey
- Requirements:
  - Display markers for each balloon position
  - Add a "Play" button that:
    - When clicked, animates through the balloon's journey
    - Shows markers appearing in chronological order
  - Implement "real-time updates":
    - Poll the API every 5 seconds for new data points
    - Integrate new points into the existing visualization

### 2. Altitude Chart Implementation
- Create a line chart showing the balloon's altitude over time
- Requirements:
  - X-axis: Time
  - Y-axis: Altitude
  - Chart should update in real-time with new data
  - Use any preferred charting library (e.g., Chart.js, Recharts)
