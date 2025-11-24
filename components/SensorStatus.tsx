import React from 'react';
import { View, Text } from 'react-native';

const SensorStatus = ({ label, value }) => {
  return (
    <View className="flex-row justify-between mb-2.5">
      <Text className="text-base text-white">{label}</Text>
      <Text className="text-base text-gray-400">{value}</Text>
    </View>
  );
};

export default SensorStatus;
