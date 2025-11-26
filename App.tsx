import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import './global.css';

import SafetyStatusCard from './components/SafetyStatusCard';
import SensorStatus from './components/SensorStatus';
import { useData } from './hooks/useData';
import { useWebSocket } from './hooks/useWebSocket';
// 1. Import the shared WS_BASE_URL here
import { Prediction, SensorReading, WS_BASE_URL } from './utils/api';

export default function App() {
  const { predictions, sensorReadings, loading, error } = useData();
  
  // 2. Use the variable, NOT the hardcoded string
  const { lastMessage: lastPrediction } = useWebSocket(`${WS_BASE_URL}/client/ws/client/ai`);
  const { lastMessage: lastSensorReading } = useWebSocket(`${WS_BASE_URL}/client/ws/client/data`);

  // 3. REMOVED JSON.parse(). 
  // Your hook already parses the data. lastPrediction is already an object.
  const latestPrediction: Prediction | null = lastPrediction; 
  const latestSensorReading: SensorReading | null = lastSensorReading;

  const getSafetyStatus = () => {
    if (!latestPrediction) return "Normal Noise Level";
    if (latestPrediction.label === 'Siren') return "Siren Detected!";
    if (latestPrediction.label === 'Fire') return "Fire Detected!";
    return "Normal Noise Level";
  };

  const getGasStatus = () => {
    if (!latestSensorReading) return "Low";
    // cast value to Number just to be safe, as your interface defined it as a string
    if (latestSensorReading.sensor_id === 'gas' && Number(latestSensorReading.value) > 500) return "High";
    return "Low";
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar style="light" />
      <ScrollView>
        <View className="p-5 items-center">
          <Text className="text-2xl font-bold text-white">Main Sensor Unit</Text>
          <Text className="text-lg text-green-500 font-bold">Status: OK</Text>
          <Text className="text-xs text-gray-400 mt-1">Last updated: Live</Text>
        </View>

        <View className="px-4">
          <SafetyStatusCard title="🔥 Fire/Flame" value={getSafetyStatus()} bgColor="bg-teal-500" />
          <SafetyStatusCard title="💨 Gas/Smoke" value={getGasStatus()} bgColor="bg-blue-500" />
          <SafetyStatusCard title="🔊 Audio Status" value={getSafetyStatus()} bgColor="bg-indigo-500" />
        </View>

        <View className="p-5 mt-2.5 bg-violet-900/50 rounded-xl mx-4">
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