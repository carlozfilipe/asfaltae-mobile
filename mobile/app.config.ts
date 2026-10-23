import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Asfaltaê',
  slug: 'mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-font',
    'expo-status-bar',
    [
      'expo-splash-screen',
      {
        image: './assets/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Permita que $(PRODUCT_NAME) use sua localização para registrar buracos.',
      },
    ],
    [
      'expo-image-picker',
      {
        cameraPermission: 'Permita que $(PRODUCT_NAME) use a câmera para fotografar buracos.',
        photosPermission: 'Permita que $(PRODUCT_NAME) acesse suas fotos.',
      },
    ],
    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
};

export default config;
