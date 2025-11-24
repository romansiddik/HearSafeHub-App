import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import './global.css';

import SafetyStatusCard from './components/SafetyStatusCard';
import SensorStatus from './components/SensorStatus';

export default function App() {
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
          <SafetyStatusCard title="🔥 Fire/Flame" value="Clear" bgColor="bg-green-800" />
          <SafetyStatusCard title="💨 Gas/Smoke" value="Low" bgColor="bg-green-600" />
          <SafetyStatusCard title="🔊 Audio Status" value="Normal Noise Level" bgColor="bg-green-600" />
        </View>

        <View className="p-5 mt-2.5 bg-neutral-800 rounded-xl mx-4">
          <Text className="text-xl font-bold text-white mb-4">Secondary Sensors</Text>
          <SensorStatus label="🌡️ Temperature" value="25.5°C" />
          <SensorStatus label="💧 Humidity" value="55%" />
          <SensorStatus label="📏 Proximity/Distance" value="1.2 meters" />
          <SensorStatus label="🎤 Ambient Noise" value="Low" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
