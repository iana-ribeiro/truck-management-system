// carregamentosService.cruzado.js — versão que cruza os carregamentos
// programados pra hoje (banco da empresa, dbo.vfluxo — veja
// carregamentosService.mssql.js) com os check-ins já feitos pelos
// motoristas (nosso banco de check-ins — veja checkinsService.js).
//
// A lista de carregamentos do dia vem do vfluxo: é ele que decide quais
// pedidos existem hoje, mesmo que o motorista ainda não tenha chegado.
// O cruzamento com os check-ins serve só pra saber, pedido por pedido,
// se o motorista já chegou e fez check-in (e quando).
//
// O que cruza as duas listas é o Pedido (vfluxo) com o
// numero_carregamento (checkins).

import { buscarCarregamentos as buscarCarregamentosVfluxo } from './carregamentosService.mssql.js';
import { listarCheckins } from './checkinsService.js';

export async function buscarCarregamentos() {
  const [carregamentosVfluxo, checkins] = await Promise.all([
    buscarCarregamentosVfluxo(),
    listarCheckins(),
  ]);

  return carregamentosVfluxo.map((carregamento) => {
    // Comparamos como texto (String + trim) porque não temos garantia de
    // que o Pedido no vfluxo e o numero_carregamento no check-in venham
    // exatamente no mesmo tipo (ex: número vs texto com espaço).
    const pedido = String(carregamento.Pedido ?? '').trim();
    const checkin = checkins.find(
      (c) => String(c.numero_carregamento ?? '').trim() === pedido
    );

    return {
      pedido: carregamento.Pedido,
      cliente: carregamento.Cliente,
      placa: carregamento.Placa_Cavalo,
      doca: carregamento.Doca,
      programado: carregamento.Programado,
      chegada: checkin ? checkin.criado_em : null,
      inicioCarregamento: carregamento.Inicio_Carregamento,
      fimCarregamento: carregamento.Fim_Carregamento,
      frete: carregamento.Frete,
      status: checkin ? 'Check-in feito' : 'Aguardando check-in',
    };
  });
}
