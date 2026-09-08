// checkinsService.js — quem realmente conversa com o banco de check-ins.
// Controller e rota não sabem nada de SQL; só chamam as funções daqui.

import { db } from '../database/connection.sqlite.js';

// db.prepare(...) monta a instrução SQL uma vez só; .run(...)/.all(...)
// executam ela de fato, passando os valores no lugar dos "@nome".
// Isso evita o erro clássico de SQL injection (nunca colamos o valor
// direto dentro do texto da consulta).
const inserirCheckin = db.prepare(`
  INSERT INTO checkins (
    numero_carregamento, cliente, transportadora,
    motorista_nome, motorista_cpf, motorista_cnh, motorista_telefone,
    veiculo_placa, veiculo_tipo_operacao, veiculo_tipo,
    aceite_requisitos, aceite_seguranca, ticket
  ) VALUES (
    @numeroCarregamento, @cliente, @transportadora,
    @motoristaNome, @motoristaCpf, @motoristaCnh, @motoristaTelefone,
    @veiculoPlaca, @veiculoTipoOperacao, @veiculoTipo,
    @aceiteRequisitos, @aceiteSeguranca, @ticket
  )
`);

// Recebe o check-in já concluído (no formato que vem do frontend — veja
// Confirmacao.jsx) e grava uma linha nova na tabela. Retorna o ticket
// gerado, que é o que o motorista vê na tela de sucesso.
export function criarCheckin(dados) {
  // Gera o ticket ANTES de inserir, usando o próximo id da tabela. Isso é
  // só um placeholder simples (mesmo formato "CRG-XXXX" que o frontend já
  // usava de mentirinha) — quando a lógica de prioridade da fila for
  // definida, é aqui que ela deve entrar no lugar dessa conta.
  const proximoId = db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM checkins').get().id;
  const ticket = `CRG-${String(proximoId).padStart(4, '0')}`;

  inserirCheckin.run({
    numeroCarregamento: dados.numeroCarregamento,
    cliente: dados.cliente ?? null,
    transportadora: dados.transportadora ?? null,
    motoristaNome: dados.motorista.nomeCompleto,
    motoristaCpf: dados.motorista.cpf,
    motoristaCnh: dados.motorista.cnhNumero || null,
    motoristaTelefone: dados.motorista.telefoneContato,
    veiculoPlaca: dados.veiculo.placa,
    veiculoTipoOperacao: dados.veiculo.tipoOperacao,
    veiculoTipo: dados.veiculo.tipoVeiculo,
    // SQLite não tem boolean — convertendo "sim"/"nao" pra 1/0 aqui, na
    // borda de entrada do banco, quem manda os dados (o controller) nem
    // precisa saber desse detalhe.
    aceiteRequisitos: dados.aceiteRequisitos ? 1 : 0,
    aceiteSeguranca: dados.aceiteSeguranca ? 1 : 0,
    ticket,
  });

  return ticket;
}

// Lista os check-ins já registrados, mais recentes primeiro — útil pra
// uma futura tela de acompanhamento/fila no painel interno.
export function listarCheckins() {
  return db
    .prepare('SELECT * FROM checkins ORDER BY id DESC')
    .all();
}
