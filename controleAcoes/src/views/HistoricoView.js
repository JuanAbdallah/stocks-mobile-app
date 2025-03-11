import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../components/context/authContext';
import { buscarHistoricoDoUsuario } from '../service/HistoricoService';

const HistoricoView = () => {
    const [historicoAcoes, setHistoricoAcoes] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const carregarHistorico = async () => {
            try {
                const dadosHistorico = await buscarHistoricoDoUsuario(user.id);
                setHistoricoAcoes(dadosHistorico);
            } catch (erro) {
                Alert.alert('Erro', erro.message || 'Erro ao carregar o histórico.');
                console.error('Erro ao carregar o histórico:', erro);
            }
        };

        if (user?.id) {
            carregarHistorico();
        }
    }, [user]);

    const renderizarHistorico = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.nomeAcao}>{item.nome}</Text>
            <Text style={styles.detalhesAcao}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.detalhesAcao}>Preço: R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.detalhesAcao}>Símbolo: {item.simbolo}</Text>
            <Text style={styles.detalhesAcao}>Status: {item.status}</Text>
            <Text style={styles.detalhesAcao}>Data: {new Date(item.createdAt).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Histórico de Ações</Text>
            <FlatList
                data={historicoAcoes}
                renderItem={renderizarHistorico}
                keyExtractor={(item) => `${item.id}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#6200ee',
    },
    card: {
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    nomeAcao: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    detalhesAcao: {
        fontSize: 16,
        color: '#4a148c',
        marginVertical: 5,
    },
});

export default HistoricoView;
