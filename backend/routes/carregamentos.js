// 1
// Diz qual função deve rodar quando alguém pede os carregamentos.

import express from 'express';
import { listarCarregamentos } from '../controllers/carregamentosController.js';

const router = express.Router(); // "Quero criar um conjunto de rotas relacionadas aos carregamentos."

router.get('/', listarCarregamentos); 

export default router;
