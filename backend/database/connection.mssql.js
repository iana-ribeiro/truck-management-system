// connection.js — versão SQL Server
// Antes: abríamos um arquivo (SQLite). Agora: abrimos uma conexão com um servidor.

import sql from 'mssql';
import dotenv from "dotenv"; // Lê o arquivo .env e disponibiliza em process.env

dotenv.config();

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
  if (pool) return pool;

  // Criamos o pool "na mão" (em vez do atalho sql.connect(config)) só
  // pra poder registrar o .on('error') ANTES de tentar conectar. Sem
  // isso, se a conexão falhar (endereço errado, rede/VPN fora do ar), o
  // mssql dispara um evento 'error' que, sem ninguém "escutando", derruba
  // o processo Node INTEIRO — não é só um erro que cai no catch abaixo,
  // é o servidor inteiro caindo. Com o .on('error') aqui, esse aviso só
  // vai pro console, e quem trata o problema de verdade é o try/catch de
  // quem chamou getConnection() (o service, e dele o controller).
  const novoPool = new sql.ConnectionPool(config);
  novoPool.on('error', (err) => {
    console.error('❌ Erro na conexão com o banco SQL Server:', err.message);
  });

  try {
    pool = await novoPool.connect();
    console.log('✅ Banco SQL Server conectado com sucesso.');
    return pool;
  } catch (err) {
    pool = null; // permite tentar conectar de novo na próxima chamada
    console.error('❌ Erro ao conectar ao banco:', err.message);
    throw err;
  }
}
