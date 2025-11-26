
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Prediction, SensorReading } from '../utils/api';

interface HistoryDrawerProps {
  predictions: Prediction[];
  sensorReadings: SensorReading[];
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ predictions, sensorReadings }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDrawer = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false, // height is not supported by native driver
    }).start();
    setExpanded(!expanded);
  };

  const { height } = Dimensions.get('window');
  const drawerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.15, height * 0.6],
  });

  return (
    <Animated.View className="bg-neutral-800 absolute bottom-0 left-0 right-0 rounded-t-2xl" style={{ height: drawerHeight }}>
      <TouchableOpacity onPress={toggleDrawer} className="p-4 border-b border-neutral-700">
        <Text className="text-white text-center text-base font-bold">
          {expanded ? 'Hide History' : 'Show History'}
        </Text>
      </TouchableOpacity>
      <ScrollView>
        <View className="p-4">
          <Text className="text-white text-lg font-bold mb-2">Prediction History</Text>
          {predictions.map((p, i) => (
            <Text key={`pred-${i}`} className="text-white">{p.label} - {new Date(p.timestamp).toLocaleTimeString()}</Text>
          ))}
          <Text className="text-white text-lg font-bold mt-4 mb-2">Sensor History</Text>
          {sensorReadings.map((s, i) => (
            <Text key={`sensor-${i}`} className="text-white">{s.sensor_id}: {s.value} - {new Date(s.timestamp).toLocaleTimeString()}</Text>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default HistoryDrawer;
