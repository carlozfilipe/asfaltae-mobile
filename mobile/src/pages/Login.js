import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth } from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import road from '../../assets/road.png';
import { useFonts } from 'expo-font';
import { RubikMoonrocks_400Regular } from '@expo-google-fonts/rubik-moonrocks';
import { useNavigation } from '@react-navigation/native';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Login inválido! Preencha corretamente!')
      });
  }

  const [fontsLoaded] = useFonts({
    RubikMoonrocks_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  function handleNavigateToSignUp() {
    navigation.navigate('SignUp');
  }

  return (
    <View style={styles.container}>

      <View style={styles.imageView}>
        <Text style={styles.title}>AsfaltaÊ</Text>
        <Image source={road} style={styles.imageRoad} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9da4b0"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#9da4b0"
        secureTextEntry={true}
        value={password}
        onChangeText={(password) => setPassword(password)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={handleNavigateToSignUp}
      >
        <Text style={styles.buttonTextSignUp}>Não possui conta? Cadastre-se aqui!</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121015',
    paddingHorizontal: 30,
    paddingVertical: 70
  },

  imageView: {
    marginTop: 80,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 56,
    height: 56,
  },
  imageRoad: {
    width: 250,
    height: 50,
  },

  title: {
    color: '#ffae00',
    fontSize: 48,
    fontFamily: 'RubikMoonrocks_400Regular',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1f1e25',
    color: '#fff',
    fontSize: 14,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginTop: 30,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#ffae00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#121015',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonSignUp: {
    backgroundColor: '#121015',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonTextSignUp: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },

});

export default Login;