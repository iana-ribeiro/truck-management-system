// 3
// Vai no banco de dados, busca os dados, e entrega pro controller.

import db from '../database/connection.sqlite.js'; 

export async function buscarCarregamentos() {
  return new Promise((resolve, reject) => {
    // new = Cria um objeto novo. Promise = Irá entregar uma resposta no futuro. resolve = Deu tudo certo. reject = Deu erro.
    db.all(
      `
      SELECT
        Carregamentos.ordem,
        Clientes.nome AS cliente,
        Veiculos.placa

      FROM Carregamentos

      INNER JOIN Clientes
        ON Carregamentos.cliente_id = Clientes.id

      INNER JOIN Veiculos
        ON Carregamentos.veiculo_id = Veiculos.id
      `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      },
    );
  });
}
