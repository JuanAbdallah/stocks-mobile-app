import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../components/context/authContext';
import { AtualizarUsuario, depositarSaldo } from '../service/UserService';


const DepositoView = () => {
  const [valor, setValor] = useState('');
  const { user, setUser } = useContext(AuthContext); 

  const Depositar = async () => {
    if (!valor) {
      Alert.alert('Erro', 'Por favor, insira um valor para depositar.');
      return;
    }
  
    try {
      const valorFloat = parseFloat(valor);
  
      if (isNaN(valorFloat) || valorFloat <= 0) {
        Alert.alert('Erro', 'Por favor, insira um valor válido.');
        return;
      }
  
      await depositarSaldo(user.id, valorFloat, user.token);
  
      const novoSaldo = parseFloat(user.saldo) + valorFloat; 
  
      await AtualizarUsuario(user.id, { saldo: novoSaldo }, user.token);
      setUser({ ...user, saldo: novoSaldo });
  
      Alert.alert('Sucesso', 'Depósito realizado com sucesso!');
      setValor('');
    } catch (error) {
      Alert.alert('Erro ao realizar depósito', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Depósito</Text>
      <TextInput
        label="Valor do Depósito"
        mode="outlined"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        style={styles.input}
      />
      <Button mode="contained" onPress={Depositar} style={styles.button}>
        Confirmar Depósito
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

export default DepositoView;
