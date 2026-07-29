// 2
// Receber a requisição > Conversar com o Service > Responde ao cliente. Apenas faz a ponte.

import { buscarCarregamentos } from '../services/carregamentosService.js';

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
