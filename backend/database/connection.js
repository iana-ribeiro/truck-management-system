import sqlite3 from "sqlite3"; // "Vou usar a biblioteca SQLite."

sqlite3.verbose(); // Faz o SQLite mostrar mensagens mais detalhadas caso aconteça algum erro.

const db = new sqlite3.Database("./database/truckmanagement.db", (err) => { //"Abra uma conexão com este banco."
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Banco SQLite conectado com sucesso.");
    }
});

export default db;