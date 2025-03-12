from flask import Flask, jsonify
from flask_cors import CORS
from telemetry import get_telemetry

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)  # Allow only frontend origin

@app.route('/api/test', methods=['GET'])
def test():
    return {'ok': True}

@app.route('/api/balloon-data', methods=['GET'])
def get_balloon_data():
    telemetry_data = get_telemetry()
    response = jsonify(telemetry_data)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Explicitly set CORS header
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,OPTIONS")
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5055) 