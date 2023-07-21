import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import logo from '../images/cone.png';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  /* function handleLogin() {
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    setUser(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
  } */

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
    console.log(errorMessage);
  });
  }

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Points App</Text>

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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 150,
  },
  input: {
    backgroundColor: '#1f1e25',
    color: '#fff',
    fontSize: 16,
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
  }
});

export default Login;