// 3
// Serviço responsável por buscar os carregamentos.

import db from '../database/connection.sqlite.js'; // O connection.js abriu a ligação. Agora o carregamentosService.js pega emprestado.

export async function buscarCarregamentos() {
  return new Promise((resolve, reject) => {
    // new = Cria um objeto novo. Promise = Irá entregar uma resposta no futuro. resolve = Du tudo certo. reject = Deu erro.
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
