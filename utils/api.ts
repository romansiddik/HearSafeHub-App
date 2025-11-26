// utils/api.ts

// 1. Centralize the IP and Port
const SERVER_ADDRESS = '192.168.0.107:8000';

// 2. Export distinct base URLs for HTTP and WebSockets
export const API_BASE_URL = `http://${SERVER_ADDRESS}`;
export const WS_BASE_URL = `ws://${SERVER_ADDRESS}`;

export interface Prediction {
  id?: number;
  label: string;
  confidence: number;
  timestamp: string;
}

export interface SensorReading {
  id?: number;
  sensor_id: string;
  value: string;
  timestamp: string;
}

// Update your fetch calls to use the new API_BASE_URL variable
// (Note: The variable now includes 'http://', so don't add it again if you were)

export const getPredictions = async (limit: number = 100): Promise<Prediction[]> => {
  // Ensure your backend handles the trailing slash correctly. 
  // If API_BASE_URL is http://...:8000, this becomes http://...:8000/client/predictions/...
  const response = await fetch(`${API_BASE_URL}/client/predictions/?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch predictions');
  return response.json();
};

export const getRecentPredictions = async (limit: number = 100): Promise<Prediction[]> => {
  const response = await fetch(`${API_BASE_URL}/client/predictions/recent/?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent predictions');
  return response.json();
};

export const getSensorReadings = async (sensor_id?: string, limit: number = 100): Promise<SensorReading[]> => {
  let url = `${API_BASE_URL}/client/sensors/?limit=${limit}`;
  if (sensor_id) {
    url += `&sensor_id=${sensor_id}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch sensor readings');
  return response.json();
};

export const getRecentSensorReadings = async (limit: number = 100): Promise<SensorReading[]> => {
  const response = await fetch(`${API_BASE_URL}/client/sensors/recent/?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent sensor readings');
  return response.json();
};