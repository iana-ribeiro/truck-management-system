import { useEffect, useState } from 'react'; //"React, vou usar memória e vou executar um código quando a página abrir."
import BarraPesquisa from '../components/BarraPesquisa/BarraPesquisa';
import Header from '../components/Header/Header';
import Layout from '../components/Layout/Layout';
import StatusCard from '../components/StatusCards/StatusCards';
import TabelaCarregamentos from '../components/TabelaCarregamentos/TabelaCarregamentos'; // Traz o componente da tabela.
import { buscarCarregamentos } from '../services/carregamentos'; // Traz a função.

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const dados = await buscarCarregamentos();

      setCarregamentos(dados);

      console.log(dados);
    }

    carregarDados();
  }, []);

  return (
    <Layout>
      <Header />

      <StatusCard />

      <BarraPesquisa />

      <TabelaCarregamentos carregamentos={carregamentos} />
    </Layout>
  );
}

export default Carregamentos;
