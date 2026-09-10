// connection.checkins.mssql.js — conexão com o banco SQL Server dedicado
// aos check-ins. É um banco PRÓPRIO, separado do dbo.vfluxo (esse aqui a
// gente cria e escreve; o dbo.vfluxo, usado em connection.mssql.js, é só
// leitura — não é nosso, é o sistema da empresa).
//
// Usa variáveis de ambiente com prefixo CHECKINS_ (em vez das mesmas
// DB_* do connection.mssql.js) porque pode ser um servidor e/ou login
// diferente — mesmo que hoje comecem apontando pro mesmo lugar, essa
// separação evita ter que mexer em código se um dia mudarem.

import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.CHECKINS_DB_USER,
  password: process.env.CHECKINS_DB_PASSWORD,
  server: process.env.CHECKINS_DB_SERVER,
  database: process.env.CHECKINS_DB_DATABASE,
  port: Number(process.env.CHECKINS_DB_PORT) || 1433,
  options: {
    encrypt: process.env.CHECKINS_DB_ENCRYPT === 'true',
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
  // o processo Node INTEIRO — não é só um erro que cai no catch de quem
  // chamou essa função, é o servidor inteiro caindo. Com o .on('error')
  // aqui, esse aviso só vai pro console, e quem trata o problema de
  // verdade é o try/catch do controller (registrarCheckin/listarCheckinsRegistrados).
  const novoPool = new sql.ConnectionPool(config);
  novoPool.on('error', (err) => {
    console.error('❌ Erro na conexão com o banco de check-ins:', err.message);
  });

  try {
    pool = await novoPool.connect();
  } catch (err) {
    pool = null; // permite tentar conectar de novo na próxima chamada
    throw err;
  }

  console.log('✅ Banco de check-ins (SQL Server) conectado com sucesso.');

  // Garante que a tabela exista, criando-a sozinha na primeira conexão
  // (assim ninguém precisa rodar um script à parte pra isso). Isso NÃO
  // cria o banco de dados em si — só a tabela dentro dele. O banco
  // precisa já existir (veja checkins-schema.sql pra criar).
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'checkins')
    BEGIN
      CREATE TABLE checkins (
        id INT IDENTITY(1,1) PRIMARY KEY,

        numero_carregamento NVARCHAR(50) NOT NULL,
        cliente NVARCHAR(200) NULL,
        transportadora NVARCHAR(200) NULL,

        motorista_nome NVARCHAR(200) NOT NULL,
        motorista_cpf NVARCHAR(20) NOT NULL,
        motorista_cnh NVARCHAR(20) NULL,
        motorista_telefone NVARCHAR(20) NOT NULL,

        veiculo_placa NVARCHAR(10) NOT NULL,
        veiculo_tipo_operacao NVARCHAR(20) NOT NULL,
        veiculo_tipo NVARCHAR(30) NOT NULL,

        -- SQL Server tem um tipo booleano de verdade (BIT), diferente do
        -- SQLite — mesmo assim continuamos usando 0/1, pra manter o
        -- mesmo formato que o resto do código já espera.
        aceite_requisitos BIT NOT NULL,
        aceite_seguranca BIT NOT NULL,

        ticket NVARCHAR(20) NOT NULL,
        criado_em DATETIME NOT NULL DEFAULT GETDATE()
      );
    END
  `);

  return pool;
}
