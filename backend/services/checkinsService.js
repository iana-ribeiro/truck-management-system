// checkinsService.js — quem realmente conversa com o banco de check-ins
// (SQL Server, dedicado — veja database/connection.checkins.mssql.js).
// Controller e rota não sabem nada de SQL; só chamam as funções daqui.

import sql from 'mssql';
import { getConnection } from '../database/connection.checkins.mssql.js';

// Recebe o check-in já concluído (no formato que vem do frontend — veja
// Confirmacao.jsx) e grava uma linha nova na tabela. Retorna o ticket
// gerado, que é o que o motorista vê na tela de sucesso.
export async function criarCheckin(dados) {
  const pool = await getConnection();

  // Descobre o próximo id ANTES de inserir, pra poder montar o ticket
  // "CRG-000X". É só um placeholder simples — quando a lógica de
  // prioridade da fila for definida, é aqui que ela deve entrar no lugar
  // dessa conta.
  const resultadoId = await pool
    .request()
    .query('SELECT ISNULL(MAX(id), 0) + 1 AS proximoId FROM checkins');
  const proximoId = resultadoId.recordset[0].proximoId;
  const ticket = `CRG-${String(proximoId).padStart(4, '0')}`;

  // ".input(nome, tipo, valor)" manda cada valor separado do texto da
  // consulta — evita o erro clássico de SQL injection (nunca colamos o
  // valor direto dentro do SQL).
  await pool
    .request()
    .input('numeroCarregamento', sql.NVarChar, dados.numeroCarregamento)
    .input('cliente', sql.NVarChar, dados.cliente ?? null)
    .input('transportadora', sql.NVarChar, dados.transportadora ?? null)
    .input('motoristaNome', sql.NVarChar, dados.motorista.nomeCompleto)
    .input('motoristaCpf', sql.NVarChar, dados.motorista.cpf)
    .input('motoristaCnh', sql.NVarChar, dados.motorista.cnhNumero || null)
    .input('motoristaTelefone', sql.NVarChar, dados.motorista.telefoneContato)
    .input('veiculoPlaca', sql.NVarChar, dados.veiculo.placa)
    .input('veiculoTipoOperacao', sql.NVarChar, dados.veiculo.tipoOperacao)
    .input('veiculoTipo', sql.NVarChar, dados.veiculo.tipoVeiculo)
    .input('aceiteRequisitos', sql.Bit, dados.aceiteRequisitos ? 1 : 0)
    .input('aceiteSeguranca', sql.Bit, dados.aceiteSeguranca ? 1 : 0)
    .input('ticket', sql.NVarChar, ticket)
    .query(`
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

  return ticket;
}

// Lista os check-ins já registrados, mais recentes primeiro — usada
// tanto pro controller quanto por carregamentosService.checkins.js (a
// tabela de Gestão de Carregamentos se popula a partir daqui).
export async function listarCheckins() {
  const pool = await getConnection();
  const resultado = await pool
    .request()
    .query('SELECT * FROM checkins ORDER BY id DESC');

  return resultado.recordset;
}
