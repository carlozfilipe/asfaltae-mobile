import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFonts } from 'expo-font';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Feather } from '@expo/vector-icons';
import mapMarker from './assets/marker.png';

export default function App() {

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if (!fontsLoaded) {
    return null;
  }

  function createBumpyStreetAlert() {

  }

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -2.5597771,
          longitude: -44.3111192,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }} 
      >
      
      <Marker
        icon={mapMarker}
        coordinate={{
          latitude: -2.5597771,
          longitude: -44.3111192,
        }}
        calloutAnchor={{
          x: 2.7,
          y: 0.8
        }}
      >
        <Callout tooltip onPress={ () => { alert('Oi')} }>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutText}>Rua com defeito</Text>
          </View>
        </Callout>

      </Marker>

      </MapView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ruas com defeito encontradas</Text>
        <TouchableOpacity style={styles.bumpyStreetAlertButton} onPress={createBumpyStreetAlert}>
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 168,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },

  calloutText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0889a5',
    fontSize: 14,
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },

  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3'
  },

  bumpyStreetAlertButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
