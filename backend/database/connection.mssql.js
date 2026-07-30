// connection.js — versão SQL Server
// Antes: abríamos um arquivo (SQLite). Agora: abrimos uma conexão com um servidor.

import sql from 'mssql';
import 'dotenv/config'; // Lê o arquivo .env e disponibiliza em process.env

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

let pool;

export async function getConnection() {
  try {
    if (pool) return pool;

    pool = await sql.connect(config);
    console.log('✅ Banco SQL Server conectado com sucesso.');
    return pool;
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    throw err;
  }
}
