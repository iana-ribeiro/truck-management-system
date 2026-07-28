// Receber a requisição. Conversar com o Service. Responder ao cliente.

import { buscarCarregamentos } from '../services/carregamentosService.js';

export function listarCarregamentos(req, res) {
  const carregamentos = buscarCarregamentos();

  res.json(carregamentos);
}
