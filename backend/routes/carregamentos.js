// 1
// Aponta o caminho.

import express from 'express';
import { listarCarregamentos } from '../controllers/carregamentosController.js';

const router = express.Router(); // "Quero criar um conjunto de rotas relacionadas aos carregamentos."

router.get('/', listarCarregamentos); // Quando alguém acessar a rota principal deste arquivo (/), execute listarCarregamentos.

export default router;
