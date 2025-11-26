import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';

import './global.css';

import SafetyStatusCard from './components/SafetyStatusCard';
import SensorStatus from './components/SensorStatus';
import { useData } from './hooks/useData';
import { useWebSocket } from './hooks/useWebSocket';
import { Prediction, SensorReading, WS_BASE_URL } from './utils/api';

export default function App() {
  const { predictions, sensorReadings, loading, error } = useData();
  
  const { lastMessage: lastPrediction } = useWebSocket(`${WS_BASE_URL}/client/ws/client/ai`);
  const { lastMessage: lastSensorReading } = useWebSocket(`${WS_BASE_URL}/client/ws/client/data`);

  const latestPrediction: Prediction | null = lastPrediction;
  const latestSensorReading: SensorReading | null = lastSensorReading;

  const [isFireModalVisible, setIsFireModalVisible] = useState(false);
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    const playAlarm = async () => {
      try {
        await sound.current.loadAsync(require('./assets/alarm.mp3'));
        await sound.current.playAsync();
      } catch (error) {
        console.error("Couldn't play sound", error);
      }
    };

    if (latestPrediction?.label === 'Fire') {
      setIsFireModalVisible(true);
      playAlarm();
    }

    return () => {
      sound.current.unloadAsync();
    };
  }, [latestPrediction]);

  const getSafetyStatus = () => {
    if (!latestPrediction) return "Normal Noise Level";
    if (latestPrediction.label === 'Siren') return "Siren Detected!";
    if (latestPrediction.label === 'Fire') return "Fire Detected!";
    return "Normal Noise Level";
  };

  const getGasStatus = () => {
    if (!latestSensorReading) return "Low";
    if (latestSensorReading.sensor_id === 'gas' && Number(latestSensorReading.value) > 500) return "High";
    return "Low";
  };

  const handleModalClose = () => {
    setIsFireModalVisible(false);
    sound.current.stopAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar style="light" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFireModalVisible}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-red-500 p-10 rounded-lg items-center">
            <Text className="text-white text-4xl font-bold mb-4">DANGER</Text>
            <Text className="text-white text-2xl">Fire Detected!</Text>
            <Button title="Dismiss" onPress={handleModalClose} />
          </View>
        </View>
      </Modal>
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
