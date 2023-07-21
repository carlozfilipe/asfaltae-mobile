import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PointsMap from './pages/PointsMap';
import PointDetails from './pages/PointDetails';
import SelectMapPosition from './pages/CreatePoint/SelectMapPosition';
import PointData from './pages/CreatePoint/PointData';
import Header from './components/Header';

const { Navigator, Screen } = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, headerStyle: { backgroundColor: '#f2f3f5'}}}>
        <Screen
          name="PointsMap"
          component={PointsMap}
        />

        <Screen
          name="PointDetails"
          component={PointDetails}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Ponto cadastrado" />
          }}
        />

        <Screen
          name="SelectMapPosition"
          component={SelectMapPosition}
          options={{
            headerShown: true,
            header: () => <Header title="Selecione no mapa" />
          }}
        />

        <Screen
          name="PointData"
          component={PointData}
          options={{
            headerShown: true,
            header: () => <Header title="Informe os dados" />
          }}
        />
      </Navigator>
    </NavigationContainer>
  )
}