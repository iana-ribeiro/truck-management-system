import db from "./connection.js"; // O connection.js abriu a ligação. Agora o setup.js pega emprestado.

db.serialize(() => { // serialize = Garante a ordem. Evita que vários comandos executem ao mesmo tempo.

  db.run(
    `
    CREATE TABLE IF NOT EXISTS Clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );
    `,
    (err) => {
      if (err) {
        console.log("Erro Clientes:", err.message);
      } else {
        console.log("✅ Clientes criada");
      }
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS Veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placa TEXT NOT NULL,
      modelo TEXT
    );
    `,
    (err) => {
      if (err) {
        console.log("Erro Veiculos:", err.message);
      } else {
        console.log("✅ Veiculos criada");
      }
    }
  );

   db.run(
    `
    CREATE TABLE IF NOT EXISTS Carregamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ordem TEXT NOT NULL,
        cliente_id INTEGER NOT NULL,
        veiculo_id INTEGER NOT NULL,
        peso REAL, 
        status TEXT,

        FOREIGN KEY (cliente_id) REFERENCES Clientes(id),
        FOREIGN KEY (veiculo_id) REFERENCES Veiculos(id)
    );
    `,
    (err) => {
      if (err) {
        console.log("Erro Carregamentos:", err.message);
      } else {
        console.log("✅ Carregamentos criada");
      }
    });

  // run = Banco... crie...
});

db.close(() => {
  console.log("Banco fechado.");
});