import db from "./connection.js"; // O connection.js abriu a ligação. Agora o seed.js pega emprestado.

db.all(`
    SELECT
    Carregamentos.ordem,
    Clientes.nome AS cliente,
    Veiculos.placa,
    Carregamentos.status,
    Carregamentos.peso

    FROM Carregamentos

    INNER JOIN Clientes
    ON Carregamentos.cliente_id = Clientes.id

    INNER JOIN Veiculos
    ON Carregamentos.veiculo_id = Veiculos.id;
    `,
    (err, rows) => {
if (err) {
    console.log(err);
    return;
}

console.table(rows);

db.close();

    }
)