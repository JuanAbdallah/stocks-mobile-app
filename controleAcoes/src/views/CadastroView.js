import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SaveUser  } from '../service/UserService';

const CadastroView = ({ navigation }) => {
  const [user, setUser ] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    saldo: 0,
  });
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const cadUser  = async () => {
    try {
      if (!user.nomeUsuario || !user.email || !user.senha) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      if (user.senha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      await SaveUser (user);
      Alert.alert('Cadastro realizado com sucesso', `Bem-vindo, ${user.nomeUsuario}!`);
      setUser ({
        nomeUsuario: '',
        email: '',
        senha: '',
        saldo: 0,
      });
      navigation.navigate('login');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        label="Nome"
        mode="outlined"
        value={user.nomeUsuario}
        onChangeText={(t) => setUser ({ ...user, nomeUsuario: t })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        onChangeText={(t) => setUser ({ ...user, email: t })}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Senha"
        mode="outlined"
        secureTextEntry
        value={user.senha}
        onChangeText={(t) => setUser ({ ...user, senha: t })}
        style={styles.input}
      />
      <TextInput
        label="Confirmar Senha"
        mode="outlined"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        style={styles.input}
      />
      <Button mode="contained" onPress={cadUser } style={styles.button}>
        Cadastrar
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

export default CadastroView;