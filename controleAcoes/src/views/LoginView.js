import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../components/context/authContext';


const LoginView = ({ navigation }) => {
  const [user, setUser] = useState({
    email: '',
    senha: ''
  });

  const { login } = useContext(AuthContext);

  const UserLogin = async () => {
    const { email, senha } = user; 

    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login(email, senha);
      Alert.alert('Login realizado com sucesso');
      navigation.navigate('home'); 
    } catch (error) {
      Alert.alert('Erro ao fazer login', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        onChangeText={(t) => setUser({...user, email: t})} 
        style={styles.input}
      />
      <TextInput
        label="Senha"
        mode="outlined"
        secureTextEntry
        value={user.senha} 
        onChangeText={(t) => setUser({...user, senha: t})} 
        style={styles.input}
      />
      <Button mode="contained" onPress={UserLogin} style={styles.button}>
        Entrar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee', 
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default LoginView;
