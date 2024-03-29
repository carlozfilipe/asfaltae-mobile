import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import roadRoller from '../../assets/road-roller.png';
import { useFonts } from 'expo-font';
import { RubikMoonrocks_400Regular } from '@expo-google-fonts/rubik-moonrocks';
import { useNavigation } from '@react-navigation/native';


const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  function handleCreateAccount() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Cadastro bem-sucedido!', 'Usuário criado com sucesso.');
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        Alert.alert('Erro ao tentar cadastrar!', error.message);
      });
  }

  const [fontsLoaded] = useFonts({
    RubikMoonrocks_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  function handleNavigateToLogin() {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>

      <View style={styles.imageView}>
        <Image source={roadRoller} style={styles.image} />
        <Text style={styles.title}>Cadastro</Text>
      </View>

      <Text style={styles.label}>Digite seu nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#555"
        value={name}
        onChangeText={(name) => setName(name)}
      />

      <Text style={styles.label}>Digite seu e-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <Text style={styles.label}>Crie uma senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#555"
        secureTextEntry={true}
        value={password}
        onChangeText={(password) => setPassword(password)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateAccount}
      >
        <Text style={styles.buttonText}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={handleNavigateToLogin}
      >
        <Text style={styles.buttonTextLogin}>Já possui conta? Faça login aqui!</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121015',
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  imageView: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 56,
    height: 56,
  },
  title: {
    color: '#ffae00',
    fontSize: 48,
    fontFamily: 'RubikMoonrocks_400Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'normal',
  },
  input: {
    backgroundColor: '#1f1e25',
    color: '#fff',
    fontSize: 14,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#ffae00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: {
    color: '#121015',
    fontSize: 16,
    fontWeight: 'bold'
  },
  imageRoad: {
    width: 250,
    height: 50,
  },
  buttonLogin: {
    backgroundColor: '#121015',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonTextLogin: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  }
});

export default SignUp;