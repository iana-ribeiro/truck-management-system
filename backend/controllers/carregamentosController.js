// 2
// Pede os dados pro service e devolve a resposta pronta pro cliente (ou um erro, se algo falhar).

// Pra usar o SQLite (banco de testes/fictício):
import { buscarCarregamentos } from '../services/carregamentosService.sqlite.js';

// Pra usar o SQL Server (banco real, quando passar o acesso):
// import { buscarCarregamentos } from '../services/carregamentosService.mssql.js';

export async function listarCarregamentos(req, res) {
  try {
    const carregamentos = await buscarCarregamentos(); 

    res.json(carregamentos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: 'Erro ao buscar carregamentos.',
    });
  }
}
