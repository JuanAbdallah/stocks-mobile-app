import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../components/context/authContext';
import { AtualizarUsuario } from '../service/UserService';

const AvaliacaoView = () => {
  const [novaAvaliacao, setNovaAvaliacao] = useState('');
  const { user, setUser } = useContext(AuthContext);

  const AtualizarAvaliacao = async () => {
    if (!novaAvaliacao) {
      Alert.alert('Erro', 'Por favor, insira uma avaliação.');
      return;
    }

    const avaliacaoNum = parseFloat(novaAvaliacao);

    if (isNaN(avaliacaoNum) || avaliacaoNum < 0 || avaliacaoNum > 10) {
      Alert.alert('Erro', 'A avaliação deve ser um número entre 0 e 10.');
      return;
    }

    try {
      await AtualizarUsuario(user.id, { avaliacao: avaliacaoNum }, user.token);
      setUser({ ...user, avaliacao: avaliacaoNum });

      Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
      setNovaAvaliacao('');
    } catch (error) {
      Alert.alert('Erro ao atualizar avaliação', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliação</Text>
      <Text style={styles.subtitle}>
        Avaliação Atual: {user.avaliacao || 'Sem avaliação'}
      </Text>
      <Text style={styles.instructions}>
        Por favor, avalie nosso aplicativo com uma nota de 0 a 10:
      </Text>
      <TextInput
        label="Nova Avaliação"
        mode="outlined"
        keyboardType="numeric"
        value={novaAvaliacao}
        onChangeText={setNovaAvaliacao}
        style={styles.input}
      />
      <Button mode="contained" onPress={AtualizarAvaliacao} style={styles.button}>
        Atualizar Avaliação
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
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default AvaliacaoView;
