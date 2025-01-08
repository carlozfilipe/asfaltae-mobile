import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, MarkerPressEvent } from 'react-native-maps';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import locationMarker from '../../images/pin.png';
import * as Location from 'expo-location';
import { RootStackParamList, PointItem } from '../../types/types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PointData'
>;

export default function SelectMapPosition() {
  const navigation = useNavigation<NavigationProp>();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [currentLocation, setCurrentLocation] = useState<PointItem | null>(
    null
  );

  function handleNextStep() {
    navigation.navigate('PointData', { position });
  }

  function handleSelectMapPosition(event: MarkerPressEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  // Start - Current Location - Google Maps
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        Alert.alert('Habilite a permissão para obter a localização!');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const coords = location.coords;
          setCurrentLocation({
            id: 'current-location',
            name: 'Current Location',
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        }
      ).then((response) => (subscription = response));
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
  // End - Current Location - Google Maps

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          }}
          style={styles.mapStyle}
          onPress={() => handleSelectMapPosition}
        >
          <Marker
            icon={locationMarker}
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          />
        </MapView>
      )}

      {/* {position.latitude !== 0 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </TouchableOpacity>
      )} */}

      <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#ffae00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
});
