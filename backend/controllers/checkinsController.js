// checkinsController.js — recebe os pedidos HTTP sobre check-ins, chama o
// service, e devolve a resposta certa pro cliente (mesmo padrão de
// carregamentosController.js).

import { criarCheckin, listarCheckins } from '../services/checkinsService.js';

// Roda quando o motorista clica em "Confirmar e Gerar Ticket" na tela de
// Confirmação. Espera o corpo do pedido (req.body) no mesmo formato que
// o frontend já monta hoje: numeroCarregamento, cliente, transportadora,
// motorista {...}, veiculo {...}, aceiteRequisitos, aceiteSeguranca.
//
// "async"/"await" aqui são obrigatórios: criarCheckin agora conversa com
// o SQL Server (depende de rede), então devolve uma Promise, não o
// ticket direto. Sem o await, "ticket" seria a própria Promise (ainda
// não resolvida) em vez do valor — e o erro, se a conexão falhar, nunca
// cairia neste try/catch (aconteceria depois, sem ninguém tratando).
export async function registrarCheckin(req, res) {
  try {
    const ticket = await criarCheckin(req.body);

    res.status(201).json({ ticket });
    // 201 = "Created". Devolve o ticket gerado pra o frontend mostrar na
    // tela de sucesso, no lugar do número fake que ele mesmo inventava.
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar o check-in.' });
  }
}

// Lista os check-ins já feitos — ainda sem tela nenhuma consumindo isso,
// mas já disponível pra quando existir um painel de acompanhamento.
// Mesmo motivo do async/await acima: listarCheckins depende de rede agora.
export async function listarCheckinsRegistrados(req, res) {
  try {
    const checkins = await listarCheckins();
    res.json(checkins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar os check-ins.' });
  }
}
