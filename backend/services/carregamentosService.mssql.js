// carregamentosService.mssql.js — versão que busca os carregamentos
// direto do sistema da empresa (dbo.vfluxo), sem passar pelos check-ins.
// O controller e a rota não mudam — só este arquivo (e o
// connection.mssql.js) sabem que o banco é o SQL Server da empresa.
//
// Hoje NÃO é essa a versão ativa (veja o import comentado em
// carregamentosController.js) — a tabela de Gestão de Carregamentos usa
// carregamentosService.checkins.js, que mostra os check-ins já feitos.
// Esta consulta ainda está incompleta: só traz pedido/cliente/doca, sem
// filtro de data nem os outros campos que a tabela espera (placa,
// programado, status...) — falta ajustar quando os nomes de coluna reais
// da dbo.vfluxo (documento do motorista, data do carregamento) chegarem.

import { getConnection } from '../database/connection.mssql.js';

export async function buscarCarregamentos() {
  const pool = await getConnection();

  const resultado = await pool.request().query(`
    SELECT
    pedido,
    cliente,
    doca

    FROM dbo.vfluxo

    WHERE planta='G. TATUI'
    AND Frete = 'DAP'
  `);

  // Os dados vêm dentro de resultado.recordset (formato do pacote mssql).
  return resultado.recordset;
}
