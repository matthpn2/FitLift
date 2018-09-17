import React from 'react';
import { Text, View } from 'react-native';

const Friends = ({ navigation }) => (
  <View>
    <Text>This is where you will be able to see your friends workouts.</Text>
  </View>
);

Friends.navigationOptions = {
  title: 'Feed'
};

export default Friends;
