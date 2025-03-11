import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Dimensions, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { buscarAcoesDoUsuario } from '../service/CarteiraService';
import { getPrecoAcao } from '../service/AcoesService';
import { AuthContext } from '../components/context/authContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [acoes, setAcoes] = useState([]);
  const [graficoDados, setGraficoDados] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarAcoes();
  }, []);

  const carregarAcoes = async () => {
    try {
      setLoading(true);
      const acoesUsuario = await buscarAcoesDoUsuario(user.id);

      
      const acoesAtualizadas = await Promise.all(
        acoesUsuario.map(async (acao) => {
          try {
            const precoAtualizado = await getPrecoAcao(acao.simbolo);
            return {
              ...acao,
              precoAtual: precoAtualizado.preco,
              variacao: precoAtualizado.variacao,
            };
          } catch {
            return { ...acao, precoAtual: acao.valor, variacao: null }; 
          }
        })
      );

      setAcoes(acoesAtualizadas);

      
      const labels = acoesAtualizadas.map((acao) => acao.nome);
      const valores = acoesAtualizadas.map((acao) => acao.precoAtual * acao.quantidade);

      setGraficoDados({
        labels,
        datasets: [{ data: valores }],
      });
    } catch (error) {
      Alert.alert('Erro ao carregar ações', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Ações</Text>
      {acoes.length > 0 ? (
        <>
          <Text style={styles.subtitle}>Resumo das ações compradas</Text>
          <BarChart
            data={graficoDados}
            width={Dimensions.get('window').width - 20} 
            height={220} 
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#6200ee',
              backgroundGradientTo: '#8e24aa',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.chart}
            verticalLabelRotation={30}
          />
          <Button title="Atualizar Preços" onPress={carregarAcoes} disabled={loading} />
          <View style={styles.listContainer}>
            {acoes.map((acao) => (
              <View key={acao.id} style={styles.acaoItem}>
                <Text style={styles.acaoNome}>{acao.nome}</Text>
                <Text style={styles.acaoDetalhes}>
                  Quantidade: {acao.quantidade} | Preço Atual: R$ {acao.precoAtual.toFixed(2)} |{' '}
                  Valor Total: R$ {(acao.precoAtual * acao.quantidade).toFixed(2)}
                </Text>
                {acao.variacao !== null && (
                  <Text style={styles.variacao}>
                    Variação: {acao.variacao.toFixed(2)}%
                  </Text>
                )}
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.noData}>Nenhuma ação comprada foi encontrada.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  listContainer: {
    marginTop: 20,
  },
  acaoItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  acaoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  acaoDetalhes: {
    fontSize: 14,
    color: '#555',
  },
  variacao: {
    fontSize: 14,
    color: '#00b300',
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default Dashboard;
