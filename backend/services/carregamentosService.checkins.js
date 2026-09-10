// carregamentosService.checkins.js — versão que busca os carregamentos a
// partir dos check-ins já registrados (veja checkinsService.js).
//
// Antes existia um carregamentosService.mock.js com uma lista fixa e
// fictícia (sempre os mesmos 5 pedidos, nunca mudava). Agora que o
// check-in do motorista realmente grava algo no banco, faz mais sentido
// a tabela de Gestão de Carregamentos refletir isso de verdade — por
// isso esse arquivo tomou o lugar do mock. (Chama-se "checkins", e não
// "sqlite" ou "mssql", porque o que importa aqui é DE ONDE vem o dado —
// dos nossos próprios check-ins — não qual banco guarda isso por baixo.)

import { listarCheckins } from './checkinsService.js';

// Assim como no carregamentosService.mssql.js, o controller não percebe
// diferença nenhuma — só chama buscarCarregamentos() e recebe a lista
// pronta, no mesmo formato de sempre (pedido, cliente, placa, doca...).
export async function buscarCarregamentos() {
  const checkins = await listarCheckins();

  return checkins.map((checkin) => ({
    pedido: checkin.numero_carregamento,
    cliente: checkin.cliente,
    placa: checkin.veiculo_placa,
    doca: null, // ainda não foi chamado pra nenhuma doca
    programado: null, // esse fluxo ainda não tem horário agendado
    chegada: checkin.criado_em, // quando o check-in foi concluído = quando o motorista chegou
    inicioCarregamento: null,
    fimCarregamento: null,
    frete: null,
    status: 'Aguardando na fila', // todo check-in novo começa esperando ser chamado pra uma doca
  }));
}
