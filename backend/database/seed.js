import db from './connection.sqlite.js'; // O connection.js abriu a ligação. Agora o seed.js pega emprestado.

db.serialize(() => {
  // serialize = Garante a ordem. Evita que vários comandos executem ao mesmo tempo.

  db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Espelho Ltda");
        `);

  db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Vidros Vidros");
        `);

  db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Vidros Mania");
        `);

  db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("ABC-1234", "Volvo FH");
        `);

  db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("DEF-5678", "Scania R450");
        `);

  db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("GHI-9012", "Mercedes Actros");
        `);

  db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id)
    VALUES ("TS-1001", 1, 1);
    `);

  db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id)
    VALUES ("TS-1002", 2, 2);
    `);

  db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id)
    VALUES ("TS-1003", 3, 3);
    `);

  // run = Banco... crie...

  console.log('Clientes cadastrados com sucesso!');
});

db.close();
