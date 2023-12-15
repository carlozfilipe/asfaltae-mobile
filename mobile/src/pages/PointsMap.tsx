import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import mapMarker from '../images/cone.png';
import locationMarker from '../images/pin.png';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import * as Location from 'expo-location';

interface PointItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

/* interface PointItem {
  latitude: number;
  longitude: number;
} */

export default function PointsMap() {
  const navigation = useNavigation();
  const [points, setPoints] = useState<PointItem[]>([]);
  const [currentLocation, setCurrentLocation] = useState<PointItem | null>(
    null
  );

  useFocusEffect(() => {
    api.get('points').then((response) => {
      setPoints(response.data);
    });
  });

  function handleNavigateToPointDetails(id: number) {
    navigation.navigate('PointDetails', { id });
  }

  function handleNavigateToCreatePoint() {
    navigation.navigate('SelectMapPosition');
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
          setCurrentLocation(location.coords);
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
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          }}
        >
          {points.map((point) => {
            return (
              <>
                <Marker
                  identifier="origin"
                  key={point.id}
                  icon={mapMarker}
                  calloutAnchor={{
                    x: 2.7,
                    y: 0.8,
                  }}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToPointDetails(point.id)}
                ></Marker>

                <Marker
                  identifier="origin2"
                  key={currentLocation.id}
                  icon={locationMarker}
                  calloutAnchor={{
                    x: 2.7,
                    y: 0.8,
                  }}
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                ></Marker>
              </>
            );
          })}
        </MapView>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {points.length === 1 || points.length === 0
            ? `${points.length} ponto encontrado`
            : `${points.length} pontos encontrados`}
        </Text>

        <TouchableOpacity
          style={styles.createPointButton}
          onPress={handleNavigateToCreatePoint}
        >
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    elevation: 10,
  },

  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3',
  },

  createPointButton: {
    width: 56,
    height: 56,
    backgroundColor: '#ffae00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
