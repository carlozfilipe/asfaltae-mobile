import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { 
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold 
} from '@expo-google-fonts/nunito';
import Routes from './src/routes';
import Login from './src/pages/Login';


export default function App() {

  const [user, setUser] = useState();

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if (!fontsLoaded) {
    return null;
  }

  /* return (
    !user ? <Login setUser={setUser} /> : <Routes />
  ); */

  return (
    <Routes />
  );
}
