
// utils/api.ts

const API_BASE_URL = 'http://127.0.0.1:8000';

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

export const getPredictions = async (limit: number = 100): Promise<Prediction[]> => {
  const response = await fetch(`${API_BASE_URL}/client/predictions/?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }
  return response.json();
};

export const getRecentPredictions = async (limit: number = 100): Promise<Prediction[]> => {
  const response = await fetch(`${API_BASE_URL}/client/predictions/recent/?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recent predictions');
  }
  return response.json();
};

export const getSensorReadings = async (sensor_id?: string, limit: number = 100): Promise<SensorReading[]> => {
  let url = `${API_BASE_URL}/client/sensors/?limit=${limit}`;
  if (sensor_id) {
    url += `&sensor_id=${sensor_id}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch sensor readings');
  }
  return response.json();
};

export const getRecentSensorReadings = async (limit: number = 100): Promise<SensorReading[]> => {
  const response = await fetch(`${API_BASE_URL}/client/sensors/recent/?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recent sensor readings');
  }
  return response.json();
};
