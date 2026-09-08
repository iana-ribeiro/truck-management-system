// connection.sqlite.js — banco local dos check-ins.
//
// Diferente do connection.mssql.js (que se conecta a um SQL Server que
// já existe, mantido pela empresa), aqui o SQLite é um arquivo simples
// dentro do próprio projeto — não precisa de servidor nenhum rodando,
// só de um arquivo (checkins.db, criado automaticamente na primeira vez).
// Por isso faz sentido pros check-ins: são dados que o PRÓPRIO sistema
// gera e guarda, não um cadastro que já existia em outro sistema.

import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// import.meta.url dá o caminho deste arquivo; a partir dele calculamos
// onde o arquivo checkins.db deve ficar (sempre dentro de
// backend/database/, não importa de onde o comando "node" foi executado).
const pastaAtual = path.dirname(fileURLToPath(import.meta.url));
const caminhoDoArquivo = path.join(pastaAtual, 'checkins.db');

// new Database(...) já abre o arquivo (ou cria, se ainda não existir) —
// diferente do mssql, que precisa de um "await getConnection()" porque
// depende da rede. Aqui é local e instantâneo, não tem await nenhum.
export const db = new Database(caminhoDoArquivo);

// Garante que a tabela exista antes de qualquer consulta usar este
// módulo — "IF NOT EXISTS" faz isso rodar sem erro toda vez que o
// servidor sobe, mesmo que a tabela já tenha sido criada antes.
db.exec(`
  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Dados da etapa de Identificação (hoje vêm do mock, no futuro virão
    -- de uma consulta ao SQL Server).
    numero_carregamento TEXT NOT NULL,
    cliente TEXT,
    transportadora TEXT,

    -- Dados da aba "Motorista".
    motorista_nome TEXT NOT NULL,
    motorista_cpf TEXT NOT NULL,
    motorista_cnh TEXT,
    motorista_telefone TEXT NOT NULL,

    -- Dados da aba "Operação e Veículo".
    veiculo_placa TEXT NOT NULL,
    veiculo_tipo_operacao TEXT NOT NULL,
    veiculo_tipo TEXT NOT NULL,

    -- Concordância das abas "Requisitos" e "Segurança". SQLite não tem
    -- tipo booleano de verdade — por convenção, 0 = não, 1 = sim.
    aceite_requisitos INTEGER NOT NULL,
    aceite_seguranca INTEGER NOT NULL,

    -- Número mostrado pro motorista na tela de sucesso. Por enquanto é
    -- só "CRG-" + o id (veja checkinsService.js) — quando a lógica de
    -- prioridade da fila for definida, é aqui que ela deve entrar.
    ticket TEXT NOT NULL,

    criado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);
