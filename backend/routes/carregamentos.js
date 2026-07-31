// 2
// Resumo do arquivo: ele não executa nada sozinho — só monta uma regra ("se pedirem /, chama listarCarregamentos") e entrega essa regra pronta pra quem for usar.

import express from 'express';
// Importa o Express de novo aqui, porque esse arquivo também
// precisa das ferramentas dele — nesse caso, especificamente
// a função que cria um "router".

import { listarCarregamentos } from '../controllers/carregamentosController.js';
// Importa a função que sabe o que fazer quando o pedido chega.

const router = express.Router();
// Cria um novo objeto de rotas, vazio por enquanto.
// É esse objeto que vai guardar as regras que a gente configurar
// a seguir.

router.get('/', listarCarregamentos);
// Adiciona uma regra dentro do router: "se o pedido for do tipo
// GET e o caminho for '/', execute a função listarCarregamentos."
// Esse '/' é o que sobra depois do '/carregamentos', que já foi
// tratado no server.js.

export default router;
// Exporta o router pronto, com essa regra dentro dele,
// pra quem importar esse arquivo (no caso, o server.js).
