import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { sendXmlHttpRequest } from '../../services/sendMultipartForm';
import { PointItem } from '../../types/types';

interface PointDataRouteParams {
  position: {
    latitude: number;
    longitude: number;
  };
}

export default function PointData() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<PointItem | null>(
    null
  );

  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as PointDataRouteParams;

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
        (location: any) => {
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

  let latitude = currentLocation?.latitude;
  let longitude = currentLocation?.longitude;

  async function handleCreatePoint() {
    // const { latitude, longitude } = params.position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });

    try {
      const response = await sendXmlHttpRequest(data);
      alert('Ponto cadastrado com sucesso!');
    } catch (err) {
      alert('Erro ao cadastrar ponto!');
    }

    navigation.navigate('PointsMap');
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Precisamos de acesso a suas fotos...');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    // console.log(result);

    if (result.canceled) {
      return;
    }

    const { uri: image } = result.assets[0];

    setImages([...images, image]);
  }

  async function handleSelectImagesUpload() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Precisamos de acesso a suas fotos...');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    // console.log(result);

    if (result.canceled) {
      return;
    }

    const { uri: image } = result.assets[0];

    setImages([...images, image]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Dados</Text>

      <View style={styles.uploadedImagesContainer}>
        {images.map((image) => {
          return (
            <Image
              key={image}
              source={{ uri: image }}
              style={styles.uploadedImage}
            />
          );
        })}
      </View>

      <Text style={styles.label}>Abrir sua câmera</Text>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name='camera' size={24} color='#b0c7ce' />
      </TouchableOpacity>

      <Text style={styles.label}>Carregar fotos da sua galeria</Text>

      <TouchableOpacity
        style={styles.imagesInputUpload}
        onPress={handleSelectImagesUpload}
      >
        <Feather name='upload' size={24} color='#b0c7ce' />
      </TouchableOpacity>

      <Text style={styles.label}>Nome do ponto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Detalhes do ponto</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={setAbout}
      />

      {currentLocation && (
        <TouchableOpacity style={styles.nextButton} onPress={handleCreatePoint}>
          <Text style={styles.nextButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6',
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
    textAlignVertical: 'top',
  },

  uploadedImagesContainer: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#d3e2e6',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  imagesInputUpload: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dotted',
    borderColor: '#d3e2e6',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#ffae00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
});
