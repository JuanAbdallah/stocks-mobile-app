import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../components/context/authContext';
import { retirarSaldo } from '../service/UserService';
import { AtualizarUsuario } from '../service/UserService';  // Para atualizar o saldo após a retirada

const RetiradaView = () => {
    const [valor, setValor] = useState('');
    const { user, setUser } = useContext(AuthContext);  // Recupera o contexto de usuário

    const Retirar = async () => {
        if (!user || !user.id) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
            return;
        }

        const valorFloat = parseFloat(valor);
        if (!valor || valorFloat <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido para retirada.");
            return;
        }

        if (valorFloat > user.saldo) {
            Alert.alert("Erro", "Saldo insuficiente para a retirada.");
            return;
        }

        try {
            await retirarSaldo(user.id, valorFloat, user.token);  
            const novoSaldo = user.saldo - valorFloat;  
            
            await AtualizarUsuario(user.id, { saldo: novoSaldo }, user.token);  
            setUser({ ...user, saldo: novoSaldo });  

            Alert.alert("Sucesso", "Retirada realizada com sucesso!");
            setValor('');  
        } catch (error) {
            Alert.alert("Erro", error.message || "Erro ao realizar a retirada.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Valor da Retirada</Text>
            <TextInput
                style={styles.input}
                value={valor}
                onChangeText={setValor}
                placeholder="Digite o valor"
                placeholderTextColor="#6200ee"
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={Retirar}>
                <Text style={styles.buttonText}>Confirmar Retirada</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6200ee',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#6200ee',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        color: '#4a148c',
    },
    button: {
        backgroundColor: '#6200ee',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RetiradaView;
