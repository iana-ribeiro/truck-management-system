import { useEffect, useState } from 'react'; //"React, vou usar memória e vou executar um código quando a página abrir."
import Header from '../components/Header/Header';
import StatusCard from '../components/StatusCards/StatusCards';
import BarraPesquisa from '../components/BarraPesquisa/BarraPesquisa';
import TabelaCarregamentos from '../components/TabelaCarregamentos/TabelaCarregamentos'; // Traz o componente da tabela.
import { buscarCarregamentos } from '../services/carregamentos'; // Traz a função.

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const dados = await buscarCarregamentos();

      setCarregamentos(dados);
    }

    carregarDados();
  }, []);

  return (
    <div>
      <Header />

      <StatusCard />

      <BarraPesquisa />

      <TabelaCarregamentos carregamentos={carregamentos} />
    </div>
  );
}

export default Carregamentos;
