import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PointsMap from './pages/PointsMap';
import PointDetails from './pages/PointDetails';
import SelectMapPosition from './pages/CreatePoint/SelectMapPosition';
import PointData from './pages/CreatePoint/PointData';
import Header from './components/Header';
import Login from './pages/Login';
import OnboardingScreen from './pages/OnboardingScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export default function Routes() {
  const [user, setUser] = useState();
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, headerStyle: { backgroundColor: '#f2f3f5'}}}>

      <Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
        />

        <Screen
          name="Login"
          component={() => !user ? <Login setUser={setUser} /> : <PointsMap />}
        />

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