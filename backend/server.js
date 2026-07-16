import express from 'express'; // Você "pegou emprestada" a biblioteca.

import db from './database.js'; // Estamos importando um arquivo do nosso próprio projeto.

import cors from 'cors'; // Importando o CORS para permitir que o frontend acesse o backend.

const app = express(); // Na linha anterior você apenas pegou a ferramenta. Agora você cria uma aplicação.

app.use(cors()); // Configurando o CORS para permitir que o frontend acesse o backend.

const PORT = 4000; // O servidor ficará disponível na porta 3000. "Computador, quero conversar com quem está na porta 3000."

// Configurações
app.use(express.json());

// Rotas
// GET é o tipo de requisição usado quando queremos buscar informações.
// Quando alguém acessar: http://localhost:3000/ o Express executará o código que está entre {}.
// req é o pedido do cliente. res é a resposta que enviaremos.

app.get('/albums', (req, res) => {
  db.all('SELECT * FROM albums', (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao buscar álbuns.' });
    } else {
      res.json(rows);
    }
  });
});

// 1º if(err) = Banco deu problema.
// 2º if(!row) = Banco funcionou, mas não encontrou álbum.

app.get('/albums/:id', (req, res) => {
  const albumId = req.params.id;

  db.get('SELECT * FROM albums WHERE id = ?', [albumId], (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao buscar álbum.' });
    } else if (!row) {
      res.status(404).json({ error: 'Álbum não encontrado.' });
    } else {
      res.json(row);
    }
  });
});

// "Crie uma rota que ficará esperando uma requisição POST para /albums."
// 1. Receber os dados
// 2. Validar os dados
// 3. Conversar com o banco
// 4. Responder ao cliente

app.post('/albums', (req, res) => {
  const nome = req.body.nome;
  const ano = req.body.ano;

  db.run('INSERT INTO albums (nome, ano) VALUES (?, ?)', [nome, ano], (err) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao cadastrar álbum.',
      });
    }

    return res.status(201).json({
      message: 'Álbum cadastrado com sucesso.',
    });
  });
});

// UPDATE = Atualize uma linha existente na tabela albums.
// SET = "Quais colunas vamos atualizar?"
// WHERE = "Qual linha vamos atualizar?" (WHERE id = ? significa: "Atualize apenas o álbum cujo ID é este.")

app.put('/albums/:id', (req, res) => {
  const albumId = req.params.id;
  const nome = req.body.nome;
  const ano = req.body.ano;

  db.run(
    'UPDATE albums SET nome = ?, ano = ? WHERE id = ?',
    [nome, ano, albumId],
    (err) => {
      if (err) {
        return res.status(500).json({
          error: 'Erro ao atualizar álbum.',
        });
      }
      return res.status(200).json({
        message: 'Álbum atualizado com sucesso.',
      });
    },
  );
});

app.delete('/albums/:id', (req, res) => {
  const albumId = req.params.id;

  db.run('DELETE FROM albums WHERE id = ?', [albumId], (err) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao deletar álbum.',
      });
    }
    return res.status(200).json({
      message: 'Álbum deletado com sucesso.',
    });
  });
});

app.get('/carregamentos', (req, res) => {
  const carregamentos = [
    {
      ordem: 'TS-482731',
      cliente: 'Horizonte Sul',
      placa: 'ABC-1D23',
      status: 'Em andamento',
      transportadora: 'Transportadora A',
    },
    {
      ordem: 'TS-615904',
      cliente: 'Atlas Engenharia',
      placa: 'QWE-7F89',
      status: 'Concluído',
      transportadora: 'Transportadora B',
    },
    {
      ordem: 'TS-903218',
      cliente: 'Vale Forte',
      placa: 'MNO-4H56',
      status: 'Em andamento',
      transportadora: 'Transportadora C',
    },
  ];

  res.json(carregamentos);
});

// Inicialização
// "Servidor, fique ouvindo na porta 3000."

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
