import { useEffect, useState } from 'react';
import BarraPesquisa from '../components/BarraPesquisa/BarraPesquisa';
import Header from '../components/Header/Header';
import Layout from '../components/Layout/Layout';
import StatusCard from '../components/StatusCards/StatusCards';
import TabelaCarregamentos from '../components/TabelaCarregamentos/TabelaCarregamentos'; // Traz o componente da tabela.
import { buscarCarregamentos } from '../services/carregamentos'; // Traz a função.

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

// useState = "React, vou usar memória."

function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]); // carregamentos = É uma variável, guarda os dados da tabela. setCarregamentos = É a função que altera essa variável. Analogia com o controle remoto.

  useEffect(() => {
    // Execute o código depois que a página foi renderizada. "Buscar os carregamentos na API."
    async function carregarDados() {
      // Essa função organiza o processo. "Vou buscar os dados (1) e depois colocá-los no estado (2)."
      const dados = await buscarCarregamentos(); // (1) "Conversar com a API."

      setCarregamentos(dados); //(2)

      console.log(dados);
    }

    carregarDados();
  }, []);

  return (
    // Devolve a interface da página.
    <Layout>
      <Header />

      <StatusCard />

      <BarraPesquisa />

      <TabelaCarregamentos carregamentos={carregamentos} />
    </Layout>
  );
}

export default Carregamentos;
