import sqlite3 from 'sqlite3'; // Você "pegou emprestada" a biblioteca.

sqlite3.verbose();

const db = new sqlite3.Database('database.db'); // new significa "Crie um novo objeto.".

console.log("Banco utilizado:", process.cwd() + "/database.db"); // process.cwd() = "Qual é o diretório atual do projeto?"

// O serialize() diz: "Faça uma coisa de cada vez."
// db.run(...) = "Banco, execute este comando."
// CREATE TABLE = "Crie uma tabela."
// IF NOT EXISTS = "A tabela já existe?" Se não, ele cria. Se sim, ele não faz nada.
// INTEGER = Número inteiro.
// PRIMARY KEY = É como o CPF do álbum. Nenhum álbum pode ter o mesmo id.
// AUTOINCREMENT = Você não precisa informar o id. O banco faz isso automaticamente.
// INSERT INTO albums = "Insira uma nova linha na tabela albums."
// (nome, ano) = Aqui estamos dizendo quais colunas vamos preencher.
// VALUES ('Taylor Swift', 2006) = Agora informamos os valores.

db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    ano INTEGER
  )
`);
});

export default db; // "Outros arquivos do projeto também podem usar este banco."
