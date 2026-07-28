// "Servidor, ligue. Aceite requisições. Quando alguém pedir carregamentos, envie para as rotas."
// O server.js é a recepção. Você entra e pergunta: Quero informações sobre carregamentos. A recepção responde: Vá até o setor de carregamentos. Ela não responde sua pergunta. Ela apenas encaminha.

import cors from 'cors'; // Importando o CORS para permitir que o frontend acesse o backend.
import express from 'express'; // Você "pegou emprestada" a biblioteca.
import carregamentosRoutes from './routes/carregamentos.js';

const app = express(); // Cria a aplicação.

const PORT = 4000; // O servidor ficará disponível na porta 4000.

// Configurações
app.use(cors());
app.use(express.json());

app.use('/carregamentos', carregamentosRoutes);

// Inicialização
// "Servidor, fique ouvindo na porta 3000."

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
