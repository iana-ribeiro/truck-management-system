// 3
// Resumo do arquivo: ele recebe o pedido, tenta buscar os dados chamando o service, e devolve pro cliente — ou os dados certinhos, ou uma mensagem de erro, se algo falhar no caminho.

// Pra usar o SQLite (banco de testes/fictício):
import { buscarCarregamentos } from '../services/carregamentosService.mssql.js';
// Importa a função que sabe buscar os dados no banco.

// Pra usar o SQL Server (banco real, quando passar o acesso):
// import { buscarCarregamentos } from '../services/carregamentosService.mssql.js';

export async function listarCarregamentos(req, res) {
  // Essa é a função que o router chama quando alguém pede '/carregamentos'.
  // Ela recebe dois objetos, automaticamente, sempre que roda:
  // - req (request) = tudo sobre o pedido que chegou (quem pediu, o que pediu)
  // - res (response) = a ferramenta que você usa pra devolver uma resposta

  // A palavra "async" na frente da função significa: "essa função
  // pode ter partes que demoram (como esperar o banco responder),
  // e ela sabe lidar com essa espera sem travar o resto do programa."
  try {
    // "try" significa: "tente rodar esse bloco de código."
    // Se algo dentro dele der errado, o programa não quebra —
    // ele pula direto pro bloco "catch" logo abaixo.

    const carregamentos = await buscarCarregamentos();
    // "await" significa: "espere essa função terminar antes de continuar."
    // buscarCarregamentos() demora um pouco (precisa consultar o banco),
    // então o await garante que a gente só siga em frente
    // depois que os dados realmente chegarem.

    res.json(carregamentos);
    // Devolve os dados encontrados como resposta, no formato JSON,
    // pra quem fez o pedido (no caso, o React).
  } catch (error) {
    // Esse bloco só roda SE algo no "try" der errado
    // (por exemplo, o banco estar fora do ar).
    console.error(error);
    // Mostra o erro no terminal, pra você conseguir investigar.

    res.status(500).json({
      erro: 'Erro ao buscar carregamentos.',
      // Devolve uma resposta de erro pro cliente.
      // 500 é o código HTTP que significa "algo deu errado no servidor".
    });
  }
}
