import { useEffect, useState } from 'react';
import './App.css';

import TabelaCarregamentos from './components/TabelaCarregamentos';

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function Carregamentos() {
  
  const [carregamentos, setCarregamentos] = useState([]);

  useEffect(() => {
    async function buscarCarregamentos() {
      const resposta = await fetch('http://localhost:4000/carregamentos');

      const dados = await resposta.json();

      setCarregamentos(dados);
    }

    buscarCarregamentos();
  }, []);

  return (
    <div>
        <h1>Gestão de Carregamentos</h1>

      <TabelaCarregamentos carregamentos={carregamentos} />
    </div>
  );
}

export default Carregamentos;
