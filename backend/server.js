// 1
// A execução começa por aqui.
// Resumo do arquivo: ele liga o servidor, configura o que é necessário pra ele funcionar, e diz que pedidos pra /carregamentos devem ir pro arquivo de rotas correspondente.

import cors from 'cors';
// CORS = Cross-Origin Resource Sharing.
// Sem isso, o navegador bloquearia o React (rodando numa porta, ex: 5173)
// de fazer pedidos pro backend (rodando em outra porta, ex: 4000).
// O cors() libera essa comunicação entre "origens" diferentes — aqui só
// liberamos as origens listadas em CORS_ORIGIN (veja mais abaixo), não
// qualquer site da internet.

import dotenv from 'dotenv';
// Lê o arquivo .env e disponibiliza as variáveis (API_KEY, CORS_ORIGIN...)
// em process.env, ANTES de qualquer coisa abaixo precisar delas.

import express from 'express';
// Biblioteca que fornece as ferramentas prontas pra criar
// um servidor web, sem precisar programar isso do zero.

import carregamentosRoutes from './routes/carregamentos.js';
// Importa as rotas relacionadas a carregamentos.
// Esse import EXECUTA o arquivo routes/carregamentos.js nesse momento,
// e guarda o que ele exportou (o router) dentro dessa variável.

import checkinsRoutes from './routes/checkins.js';
// Rotas do check-in do motorista (guardadas num banco SQL Server dedicado —
// veja backend/database/connection.checkins.mssql.js).

import { apiKeyAuth } from './middleware/apiKeyAuth.js';
// Trava simples: exige a chave secreta (API_KEY) em todo pedido pras
// rotas de negócio, pra não deixar /carregamentos e /checkins abertos
// pra qualquer um que alcance o servidor.

dotenv.config();

// "Para-quedas" contra erros que fogem do try/catch normal. O pacote do
// SQL Server (mssql/tedious), quando não consegue conectar (endereço
// errado, rede fora do ar), às vezes dispara o erro de um jeito que o
// Node trata como "não tratado" e derruba o processo INTEIRO — mesmo
// tendo try/catch em volta do await. Sem isso, cada tentativa de usar
// /checkins ou /carregamentos com o banco fora do ar derrubaria o
// servidor todo (e, no Kubernetes, entraria num loop de reinícios).
// Aqui só registramos o erro no console e deixamos o servidor de pé.
process.on('unhandledRejection', (erro) => {
  console.error('❌ Erro não tratado (promise rejeitada):', erro);
});

process.on('uncaughtException', (erro) => {
  console.error('❌ Erro não tratado (exceção):', erro);
});

const app = express(); // Cria a aplicação do servidor.

const PORT = 4000;
// Define em qual porta o servidor vai funcionar.
// É o número que o navegador usa pra encontrar esse servidor
// especificamente.

// Configurações
const origensPermitidas = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim());

app.use(cors({ origin: origensPermitidas }));
// Só libera a comunicação entre "origens" diferentes pros endereços do
// próprio frontend (CORS_ORIGIN no .env) — não pra qualquer site.

app.use(express.json());
// Permite que o servidor entenda dados enviados no formato JSON.

app.use('/carregamentos', apiKeyAuth, carregamentosRoutes);
// Diz que qualquer pedido que chegar no endereço /carregamentos
// deve, primeiro, passar pela trava da API_KEY, e só então ser
// tratado pelas rotas importadas acima.

app.use('/checkins', apiKeyAuth, checkinsRoutes);
// Mesma ideia, agora para os pedidos que chegarem em /checkins.

app.listen(PORT, () => {
  // Faz o servidor começar a escutar pedidos na porta 4000.

  console.log(`Servidor rodando em http://localhost:${PORT}`);
  // Mostra no terminal que o servidor está rodando.
});
