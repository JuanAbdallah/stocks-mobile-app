import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, TextInput } from 'react-native';
import { getAcoes, getPrecoAcao } from '../service/AcoesService';
import { AuthContext } from '../components/context/authContext';
import { comprarAcao, atualizarAcao, buscarAcoesDoUsuario } from '../service/CarteiraService';
import { AtualizarUsuario } from '../service/UserService';
import { registrarHistorico } from '../service/HistoricoService';

const HomeView = () => {
    const [acoes, setAcoes] = useState([]);
    const [quantidade, setQuantidade] = useState({});
    const [filtro, setFiltro] = useState('');
    const { user, setUser } = useContext(AuthContext);
    const [acoesCarteira, setAcoesCarteira] = useState([]);

    useEffect(() => {
        const carregarAcoes = async () => {
            try {
                const dadosAcoes = await getAcoes();
                setAcoes(dadosAcoes);
            } catch (erro) {
                Alert.alert('Erro', erro.message || 'Erro ao carregar as ações.');
            }
        };

        const carregarCarteira = async () => {
            try {
                const dadosCarteira = await buscarAcoesDoUsuario(user.id);
                setAcoesCarteira(dadosCarteira);
            } catch (erro) {
                Alert.alert('Erro', erro.message || 'Erro ao carregar a carteira.');
            }
        };

        carregarAcoes();
        if (user?.id) carregarCarteira();
    }, [user]);

    const compraAcao = async (acao) => {
        const qtd = parseFloat(quantidade[acao.nome]);

        if (!qtd || isNaN(qtd) || qtd <= 0) {
            Alert.alert('Erro', 'Por favor, insira uma quantidade válida (número maior que zero).');
            return;
        }

        try {
            const precoAtual = await getPrecoAcao(acao.simbolo); 
            const valor = precoAtual.preco;
            const totalCompra = qtd * valor;

            if (user.saldo < totalCompra) {
                Alert.alert('Erro', 'Saldo insuficiente para realizar a compra.');
                return;
            }

            const acaoExistente = acoesCarteira.find((a) => a.simbolo === acao.simbolo);

            if (acaoExistente) {
                
                const novaQuantidade = acaoExistente.quantidade + qtd;
                await atualizarAcao(acaoExistente.id, { quantidade: novaQuantidade, valor });
                setAcoesCarteira((prevState) =>
                    prevState.map((item) =>
                        item.simbolo === acao.simbolo
                            ? { ...item, quantidade: novaQuantidade, valor }
                            : item
                    )
                );
            } else {
                
                await comprarAcao(acao.nome, valor, qtd, user.id, acao.simbolo);
                setAcoesCarteira((prevState) => [
                    ...prevState,
                    { ...acao, quantidade: qtd, valor },
                ]);
            }

            await registrarHistorico(acao.nome, valor, qtd, acao.simbolo, user.id, 'COMPRA');

            
            const novoSaldo = user.saldo - totalCompra;
            await AtualizarUsuario(user.id, { saldo: novoSaldo }, user.token);
            setUser({ ...user, saldo: novoSaldo });

            Alert.alert('Sucesso', `Você comprou ${qtd} ações de ${acao.nome}.`);
        } catch (erro) {
            Alert.alert('Erro', erro.message || 'Erro ao tentar comprar a ação.');
        }
    };

    const MostraAcoes = ({ item }) => (
        <View style={estilos.containerItem}>
            <Text style={estilos.nomeAcao}>{item.nome}</Text>
            <Text style={estilos.precoAcao}>Preço: R$ {item.preco?.toFixed(2)}</Text>
            <TextInput
                style={estilos.inputQuantidade}
                placeholder="Quantidade"
                keyboardType="numeric"
                value={quantidade[item.nome]?.toString() || ''}
                onChangeText={(t) => setQuantidade({ ...quantidade, [item.nome]: t })}
            />
            <View style={estilos.containerBotoes}>
                <View style={estilos.buttonComprar}>
                    <Text style={estilos.buttonText} onPress={() => compraAcao(item)}>
                        Comprar
                    </Text>
                </View>
            </View>
        </View>
    );

    const acoesFiltradas = acoes.filter((acao) => {
        const filtroNormalizado = filtro.trim().toLowerCase();
        if (!filtroNormalizado) return true;
        return (
            acao.nome.toLowerCase().startsWith(filtroNormalizado) ||
            acao.simbolo.toLowerCase().startsWith(filtroNormalizado)
        );
    });

    return (
        <View style={estilos.container}>
            {user && (
                <View style={estilos.usuarioInfo}>
                    <Text style={estilos.usuarioNome}>Bem-vindo, {user.nomeUsuario}</Text>
                    <Text style={estilos.usuarioSaldo}>Saldo: R$ {user.saldo?.toFixed(2)}</Text>
                </View>
            )}
            <TextInput
                style={estilos.inputPesquisa}
                placeholder="Buscar ação pelo nome..."
                value={filtro}
                onChangeText={setFiltro}
            />
            <FlatList
                data={acoesFiltradas}
                renderItem={MostraAcoes}
                keyExtractor={(item, index) => `${item.simbolo}-${index}`}
            />
        </View>
    );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff', 
  },
  usuarioInfo: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#e8eaf6', 
    padding: 10,
    borderRadius: 10,
  },
  usuarioNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee', 
  },
  usuarioSaldo: {
    fontSize: 18,
    color: '#4a148c', 
  },
  inputPesquisa: {
    borderWidth: 1,
    borderColor: '#7e57c2', 
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#ffffff', 
    color: '#4a148c', 
  },
  containerItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6200ee', 
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nomeAcao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee', 
  },
  precoAcao: {
    fontSize: 16,
    marginVertical: 5,
    color: '#4a148c', 
  },
  variacaoAcao: {
    fontSize: 14,
    color: '#388e3c', 
  },
  inputQuantidade: {
    borderWidth: 1,
    borderColor: '#7e57c2', 
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#ffffff', 
    color: '#4a148c', 
  },
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonComprar: {
    backgroundColor: '#6200ee', 
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  buttonVender: {
    backgroundColor: '#7e57c2', 
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#ffffff', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default HomeView;
