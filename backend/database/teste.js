import db from "./connection.js"; // O connection.js abriu a ligação. Agora o teste.js pega emprestado.

db.all("SELECT * FROM Clientes", (err, rows) => {
    if (err) {
        console.log(err);
        return;
    }

    console.table(rows);

    db.close();
});