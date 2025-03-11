const URL_BASE = 'https://brapi.dev/api/quote/list';
const TOKEN = 'nyPgy3HWPLFNXq291BuJgY';  

const getAcoes = async () => {
  try {
    const resposta = await fetch(URL_BASE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const dados = await resposta.json();

    return dados.stocks.map(acao => ({
      simbolo: acao.stock,
      nome: acao.name,
      preco: acao.close,
      variacao: acao.change_percent,
    }));
  } catch (erro) {
    throw new Error('Erro ao buscar dados de todas as ações');
  }
};

const getPrecoAcao = async (simbolo) => {
  try {
      const response = await fetch(`https://brapi.dev/api/quote/${simbolo}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${TOKEN}`, 
              'Content-Type': 'application/json'
          }
      });
      console.log("Status da resposta:", response.status);
      const textoResposta = await response.text();
      console.log("Corpo da resposta:", textoResposta);

      
      const data = JSON.parse(textoResposta);

      
      if (data.error) {
          throw new Error(data.message || 'Erro ao obter dados da ação.');
      }

      const acao = data.results[0];
      return {
          preco: acao.regularMarketPrice,
          variacao: acao.regularMarketChangePercent
      };
  } catch (erro) {
      console.error("Erro ao buscar preço da ação específica:", erro);
      throw erro;
  }
};


export { getAcoes, getPrecoAcao };

