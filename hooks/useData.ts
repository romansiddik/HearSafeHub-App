
import { useState, useEffect } from 'react';
import { getPredictions, getSensorReadings, Prediction, SensorReading } from '../utils/api';

export const useData = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const preds = await getPredictions();
        const sensorData = await getSensorReadings();
        setPredictions(preds);
        setSensorReadings(sensorData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { predictions, sensorReadings, loading, error };
};
