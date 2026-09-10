// carregamentosService.mssql.js — versão que busca os carregamentos
// direto do sistema da empresa (dbo.vfluxo), sem passar pelos check-ins.
// O controller e a rota não mudam — só este arquivo (e o
// connection.mssql.js) sabem que o banco é o SQL Server da empresa.
//
// Esta função não é chamada direto pelo controller — é usada por
// carregamentosService.cruzado.js pra buscar a lista "oficial" dos
// carregamentos programados pra hoje, que depois é cruzada com os
// check-ins já feitos (veja aquele arquivo).
//
// Retorna as linhas com os nomes de coluna originais do vfluxo (Pedido,
// Placa_Cavalo...) — quem converte pro formato que o frontend espera
// (pedido, placa...) é o carregamentosService.cruzado.js.

import { getConnection } from '../database/connection.mssql.js';

export async function buscarCarregamentos() {
  const pool = await getConnection();

  const resultado = await pool.request().query(`
    SELECT
      Pedido,
      Cliente,
      Placa_Cavalo,
      Doca,
      Programado,
      Frete,
      Inicio_Carregamento,
      Fim_Carregamento

    FROM dbo.vfluxo

    WHERE planta = 'G. TATUI'
      AND Frete = 'DAP'
      AND CAST(Programado AS DATE) = CAST(GETDATE() AS DATE)
  `);

  // Os dados vêm dentro de resultado.recordset (formato do pacote mssql).
  return resultado.recordset;
}
