import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, MarkerPressEvent } from 'react-native-maps';

import mapMarkerImg from '../../images/cone.png';

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  function handleNextStep() {
    navigation.navigate('PointData', { position });
  }

  function handleSelectMapPosition(event: MarkerPressEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: -2.558790, 
          longitude: -44.307287,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        {position.latitude !== 0 && (
          <Marker
            icon={mapMarkerImg}
            coordinate={{ latitude: position.latitude, longitude: position.longitude }}
          />
        )}
      </MapView>

      {position.latitude !== 0 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </TouchableOpacity>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
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
  }
})