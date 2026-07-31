// 1
// A execução começa por aqui.
// Resumo do arquivo: ele liga o servidor, configura o que é necessário pra ele funcionar, e diz que pedidos pra /carregamentos devem ir pro arquivo de rotas correspondente.

import cors from 'cors';
// CORS = Cross-Origin Resource Sharing.
// Sem isso, o navegador bloquearia o React (rodando numa porta, ex: 5173)
// de fazer pedidos pro backend (rodando em outra porta, ex: 4000).
// O cors() libera essa comunicação entre "origens" diferentes.

import express from 'express';
// Biblioteca que fornece as ferramentas prontas pra criar
// um servidor web, sem precisar programar isso do zero.

import carregamentosRoutes from './routes/carregamentos.js';
// Importa as rotas relacionadas a carregamentos.
// Esse import EXECUTA o arquivo routes/carregamentos.js nesse momento,
// e guarda o que ele exportou (o router) dentro dessa variável.

const app = express(); // Cria a aplicação do servidor.

const PORT = 4000;
// Define em qual porta o servidor vai funcionar.
// É o número que o navegador usa pra encontrar esse servidor
// especificamente.

// Configurações
app.use(cors());
// Ativa a permissão de comunicação com o React em toda a aplicação.

app.use(express.json());
// Permite que o servidor entenda dados enviados no formato JSON.

app.use('/carregamentos', carregamentosRoutes);
// Diz que qualquer pedido que chegar no endereço /carregamentos
// deve ser tratado pelas rotas importadas acima.

app.listen(PORT, () => {
  // Faz o servidor começar a escutar pedidos na porta 4000.

  console.log(`Servidor rodando em http://localhost:${PORT}`);
  // Mostra no terminal que o servidor está rodando.
});
