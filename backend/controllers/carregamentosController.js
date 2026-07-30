// 2
// Receber a requisição > Conversar com o Service > Responde ao cliente. Apenas faz a ponte.

// Pra usar o SQLite (banco de testes/fictício):
import { buscarCarregamentos } from '../services/carregamentosService.sqlite.js';

// Pra usar o SQL Server (banco real, quando a pessoa passar o acesso):
// import { buscarCarregamentos } from '../services/carregamentosService.mssql.js';

export async function listarCarregamentos(req, res) {
  try {
    // "Tente executar."
    const carregamentos = await buscarCarregamentos(); // await = "Espere."

    res.json(carregamentos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: 'Erro ao buscar carregamentos.',
    });
  }
}
