import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMap from './pages/MainMap';
import MapDetails from './pages/MapDetails';

const { Navigator, Screen } = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen
          name="MainMap"
          component={MainMap}
        />
        <Screen
          name="MapDetails"
          component={MapDetails}
        />
      </Navigator>
    </NavigationContainer>
  )
}
