import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import mapMarker from '../images/cone.png';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

interface PointItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function PointsMap() {
  const navigation = useNavigation();
  const [points, setPoints] = useState<PointItem[]>([]);

  useFocusEffect(() => {
    api.get('points').then(response => {
      setPoints(response.data);
    });
  });

  function handleNavigateToPointDetails(id: number) {
    navigation.navigate('PointDetails', { id });
  }

  function handleNavigateToCreatePoint() {
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -2.5592567,
          longitude: -44.3095543,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >

        {points.map(point => {
          return (
            <Marker
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
            >
            </Marker>
          )
        })
        }

      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {points.length} pontos encontrados
        </Text>

        <TouchableOpacity
          style={styles.createPointButton}
          onPress={handleNavigateToCreatePoint}
        >
          <Feather
            name="plus"
            size={28}
            color="#fff"
          />
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
    elevation: 10
  },

  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3'
  },

  createPointButton: {
    width: 56,
    height: 56,
    backgroundColor: '#ffae00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
