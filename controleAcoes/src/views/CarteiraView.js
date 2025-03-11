import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { AuthContext } from '../components/context/authContext';
import { atualizarAcao, buscarAcoesDoUsuario, excluirAcao } from '../service/CarteiraService';
import { AtualizarUsuario } from '../service/UserService';
import { getPrecoAcao } from '../service/AcoesService';
import { registrarHistorico } from '../service/HistoricoService';

const CarteiraView = () => {
    const [acoesCarteira, setAcoesCarteira] = useState([]);
    const [quantidadeVenda, setQuantidadeVenda] = useState({});
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const carregarCarteira = async () => {
            try {
                const dadosCarteira = await buscarAcoesDoUsuario(user.id);
                console.log(dadosCarteira)
                
                const acoesAtualizadas = await Promise.all(
                    dadosCarteira.map(async (acao) => {
                        const precoAtualizado = await getPrecoAcao(acao.simbolo);
                        return {
                            ...acao,
                            precoAtual: precoAtualizado.preco, 
                        };
                    })
                );

                setAcoesCarteira(acoesAtualizadas);
            } catch (erro) {
                Alert.alert('Erro', erro.message || 'Erro ao carregar a carteira.');
                console.error('Erro ao carregar a carteira:', erro);
            }
        };

        if (user?.id) {
            carregarCarteira();
        }
    }, [user]);

    const vender = async (acao) => {
        const quantidadeParaVender = parseInt(quantidadeVenda[acao.nome], 10);
    
        if (isNaN(quantidadeParaVender) || quantidadeParaVender <= 0) {
            Alert.alert('Erro', 'Insira uma quantidade válida.');
            return;
        }
    
        if (quantidadeParaVender > acao.quantidade) {
            Alert.alert('Erro', 'Quantidade insuficiente para venda.');
            return;
        }
    
        try {
            const novaQuantidade = acao.quantidade - quantidadeParaVender;
    
            if (novaQuantidade === 0) {
                
                await excluirAcao(acao.id);
                setAcoesCarteira((prevState) => prevState.filter((item) => item.id !== acao.id));
            } else {
                
                await atualizarAcao(acao.id, { quantidade: novaQuantidade });
                await registrarHistorico(acao.nome, acao.precoAtual, quantidadeParaVender, acao.simbolo, user.id, "VENDA");
                
                setAcoesCarteira((prevState) =>
                    prevState.map((item) =>
                        item.id === acao.id ? { ...item, quantidade: novaQuantidade } : item
                    )
                );
    
                const valorVenda = quantidadeParaVender * acao.precoAtual;
                const novoSaldo = user.saldo + valorVenda;
    
                await AtualizarUsuario(user.id, { saldo: novoSaldo }, user.token);
                setUser({ ...user, saldo: novoSaldo });
            }
    
            Alert.alert('Sucesso', `Você vendeu ${quantidadeParaVender} ações de ${acao.nome}.`);
        } catch (erro) {
            Alert.alert('Erro', 'Erro ao tentar vender a ação.');
            console.error('Erro na venda:', erro);
        }
    };
    

    const mostrarAcoes = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.nomeAcao}>{item.nome}</Text>
            <Text style={styles.detalhesAcao}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.detalhesAcao}>Preço Atual: R$ {item.precoAtual?.toFixed(2)}</Text>
            <TextInput
                style={styles.inputQuantidade}
                value={quantidadeVenda[item.nome]?.toString() || ''}
                onChangeText={(text) => setQuantidadeVenda({ ...quantidadeVenda, [item.nome]: text })}
                placeholder="Quantidade"
                keyboardType="numeric"
            />
            <Button title="Vender" onPress={() => vender(item)} />
        </View>
    );

    return (
        <View style={styles.container}>
          {user && (
    <View style={styles.usuarioInfo}>
        <Text style={styles.saldoUsuario}>Saldo: R$ {user.saldo ? user.saldo.toFixed(2) : '0.00'}</Text>
    </View>
    )}

          <Text style={styles.titulo}>Minha Carteira</Text>
          <FlatList
            data={acoesCarteira}
            renderItem={mostrarAcoes}
            keyExtractor={(item) => item.simbolo}
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
    usuarioInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    saldoUsuario: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4caf50',
        backgroundColor: '#e8f5e9',
        padding: 10,
        borderRadius: 8,
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
    inputQuantidade: {
        height: 40,
        borderColor: '#6200ee',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        color: '#4a148c',
    },
});

export default CarteiraView;
