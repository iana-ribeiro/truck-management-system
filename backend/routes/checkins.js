import express from 'express';
import {
  registrarCheckin,
  listarCheckinsRegistrados,
} from '../controllers/checkinsController.js';

const router = express.Router();

// POST /checkins — grava um check-in concluído (chamado pela tela de
// Confirmação, ao clicar em "Confirmar e Gerar Ticket").
router.post('/', registrarCheckin);

// GET /checkins — lista os check-ins já registrados.
router.get('/', listarCheckinsRegistrados);

export default router;
