// Se alguém acessar essa URL, chame aquele Controller.

import express from 'express'; // Precisamos do Express para criar uma rota.
import { listarCarregamentos } from '../controllers/carregamentosController.js';

const router = express.Router(); // "Quero criar um conjunto de rotas relacionadas aos carregamentos."

router.get('/', listarCarregamentos); // Quando alguém acessar a rota principal deste arquivo (/), execute listarCarregamentos. Ainda não é /carregamentos. É apenas /.

export default router;
