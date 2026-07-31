// carregamentosService.mssql.js — versão SQL Server
// O controller e a rota NÃO mudam. Só este arquivo (e o connection.mssql.js) sabem que o banco é SQL Server.

import { getConnection } from '../database/connection.mssql.js';

export async function buscarCarregamentos() {
  const pool = await getConnection();

  const resultado = await pool.request().query(`
    SELECT
    planta,
    pedido,
    cliente,
    doca

    FROM dbo.vfluxo

    WHERE planta='G. TATUI'
      
  `);

  // No sqlite3 os dados vinham direto no callback (err, rows).
  // No mssql, os dados vêm dentro de resultado.recordset.
  return resultado.recordset;
}

// ATENÇÃO: essa query assume que as tabelas Carregamentos, Clientes e Veiculos
// no SQL Server têm os MESMOS nomes de tabela e coluna do seu banco de estudo.
// Peça pra pessoa te mandar os nomes reais e ajuste aqui se for diferente.
