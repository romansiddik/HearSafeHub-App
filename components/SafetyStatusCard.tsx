import React from 'react';
import { View, Text } from 'react-native';

const SafetyStatusCard = ({ title, value, bgColor }) => {
  return (
    <View className={`rounded-2xl p-5 mb-4 items-center ${bgColor}`}>
      <Text className="text-xl font-bold text-white">{title}</Text>
      <Text className="text-lg text-white mt-2.5">{value}</Text>
    </View>
  );
};

export default SafetyStatusCard;
