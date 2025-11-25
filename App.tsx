import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import './global.css';

import SafetyStatusCard from './components/SafetyStatusCard';
import SensorStatus from './components/SensorStatus';
import { useData } from './hooks/useData';
import { useWebSocket } from './hooks/useWebSocket';
import { Prediction, SensorReading } from './utils/api';

export default function App() {
  const { predictions, sensorReadings, loading, error } = useData();
  const { lastMessage: lastPrediction } = useWebSocket('ws://127.0.0.1:8000/client/ws/client/ai');
  const { lastMessage: lastSensorReading } = useWebSocket('ws://127.0.0.1:8000/client/ws/client/data');

  const latestPrediction: Prediction | null = lastPrediction ? JSON.parse(lastPrediction) : null;
  const latestSensorReading: SensorReading | null = lastSensorReading ? JSON.parse(lastSensorReading) : null;

  const getSafetyStatus = () => {
    if (!latestPrediction) return "Normal Noise Level";
    if (latestPrediction.label === 'Siren') return "Siren Detected!";
    if (latestPrediction.label === 'Fire') return "Fire Detected!";
    return "Normal Noise Level";
  };

  const getGasStatus = () => {
    if (!latestSensorReading) return "Low";
    if (latestSensorReading.sensor_id === 'gas' && latestSensorReading.value > 500) return "High";
    return "Low";
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900 text-white">
      <StatusBar style="light" />
      <ScrollView>
        <View className="p-5 items-center">
          <Text className="text-2xl font-bold text-white">Main Sensor Unit</Text>
          <Text className="text-lg text-green-500 font-bold">Status: OK</Text>
          <Text className="text-xs text-gray-400 mt-1">Last updated: 10 seconds ago</Text>
        </View>

        <View className="px-4">
          <SafetyStatusCard title="🔥 Fire/Flame" value={getSafetyStatus()} bgColor="bg-teal-500" />
          <SafetyStatusCard title="💨 Gas/Smoke" value={getGasStatus()} bgColor="bg-blue-500" />
          <SafetyStatusCard title="🔊 Audio Status" value={getSafetyStatus()} bgColor="bg-indigo-500" />
        </View>

        <View className="p-5 mt-2.5 bg-custom-purple rounded-xl mx-4">
          <Text className="text-xl font-bold text-white mb-4">Secondary Sensors</Text>
          {loading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            <>
              {sensorReadings.map((reading) => (
                <SensorStatus key={reading.id} label={`🌡️ ${reading.sensor_id}`} value={reading.value} />
              ))}
            </>
          )}
          {error && <Text className="text-red-500">{error}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
