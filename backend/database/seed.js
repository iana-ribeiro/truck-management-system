import db from "./connection.js"; // O connection.js abriu a ligação. Agora o seed.js pega emprestado.

db.serialize(() => { // serialize = Garante a ordem. Evita que vários comandos executem ao mesmo tempo.

    db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Toyota");
        `);

     db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Mercedes");
        `);

    db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Scania");
        `);

    db.run(`
        INSERT INTO Clientes (nome)
        VALUES ("Volvo");
        `);

    db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("ABC-1234", "Volvo FH");
        `)

    db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("DEF-5678", "Scania R450");
        `)

    db.run(`INSERT INTO Veiculos (placa, modelo)
        VALUES ("GHI", "Mercedes Actros");
        `)

    db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id, peso, status)
        VALUES ("TS=1001", 1, 1, 12500, "Em andamento");
        `)
    
    db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id, peso, status)
        VALUES ("TS=1002", 2, 2, 9800, "Concuído");
        `)

    db.run(`INSERT INTO Carregamentos (ordem, cliente_id, veiculo_id, peso, status)
        VALUES ("TS=1003", 1, 3, 14300, "Aguardando");
        `)

    // run = Banco... crie...

    console.log("Clientes cadastrados com sucesso!");
}); 



db.close();