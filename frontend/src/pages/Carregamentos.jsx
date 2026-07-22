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
  const [pesquisa, setPesquisa] = useState(""); // pesquisa = É uma variável, guarda o que o usuário digitou. setPesquisa = É a função que altera essa variável.

  useEffect(() => {
    // Execute o código depois que a página foi renderizada. "Buscar os carregamentos na API."
    async function carregarDados() {
      // Essa função organiza o processo. "Vou buscar os dados (1) e depois colocá-los no estado (2)."
      const dados = await buscarCarregamentos(); // (1) "Conversar com a API."

      setCarregamentos(dados); //(2)
    }

   useEffect(() => carregarDados(), []);
  }, []);

  const totalOrdens = carregamentos.length; // Quantidade de carregamentos.
  const totalClientes = new Set(carregamentos.map((c) => c.cliente)).size; // Quantidade de clientes distintos.
  const totalPlacas = new Set(carregamentos.map((c) => c.placa)).size; // Quantidade de placas distintas.
  const totalCarregamentos = carregamentos.length; // Quantidade de carregamentos.

  const carregamentosFiltrados = carregamentos.filter((c) =>
    c.ordem.toLowerCase().includes(pesquisa.toLowerCase()) ||
    c.cliente.toLowerCase().includes(pesquisa.toLowerCase()) ||
    c.placa.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    // Devolve a interface da página.
    <Layout>
      <Header />

      <StatusCard
        totalOrdens={totalOrdens}
        totalClientes={totalClientes}
        totalPlacas={totalPlacas}
        totalCarregamentos={totalCarregamentos}
      />

      <BarraPesquisa
        pesquisa={pesquisa}
        setPesquisa={setPesquisa} 
      />

      <div className="acoes">
        <button onClick={carregarDados}>
          Atualizar
        </button>
      </div>

      <TabelaCarregamentos carregamentos={carregamentosFiltrados} />
    </Layout>
  );
}

export default Carregamentos;
