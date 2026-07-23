import { useEffect, useState } from 'react';
import './Carregamentos.css';
import Layout from '../components/Layout/Layout'; // Traz o componente do layout da página.
import Header from '../components/Header/Header'; // Traz o componente do cabeçalho da página.
import StatusCard from '../components/StatusCards/StatusCards'; // Traz o componente dos cards de status.
import BarraPesquisa from '../components/BarraPesquisa/BarraPesquisa'; // Traz o componente da barra de pesquisa.
import TabelaCarregamentos from '../components/TabelaCarregamentos/TabelaCarregamentos'; // Traz o componente da tabela.
import { buscarCarregamentos } from '../services/carregamentos'; // Traz a função que busca os carregamentos na API.

// useState = "React, vou usar memória."

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]); // carregamentos = Guarda os dados da tabela. setCarregamentos = É a função que altera essa variável. Analogia com o controle remoto.
  const [pesquisa, setPesquisa] = useState(""); // pesquisa = Quarda o que o usuário digitou. setPesquisa = É a função que altera essa variável.
  const [carregando, setCarregando] = useState(true); // carregando = Guarda se a página está carregando. setCarregando = É a função que altera essa variável.
  const [erro, setErro] = useState(""); // erro = Guarda se houve algum erro. setErro = É a função que altera essa variável.

// Execute o código depois que a página foi renderizada. Busque os carregamentos na API.

async function carregarDados() { // Essa função organiza o processo. "Vou buscar os dados (1) e depois colocá-los no estado (2)."
  try { 
    setCarregando(true);  // A página está carregando.

    setErro(""); // Limpa a mensagem de erro.
  
    const dados = await buscarCarregamentos(); // (1) Conversa com a API.

    setCarregamentos(dados); //(2) Guarda os dados no estado da página.
  } catch (error) { // Se houver algum erro, exibe a mensagem de erro.
    setErro("Erro ao buscar os carregamentos. Tente novamente mais tarde.");
  } finally {
    setCarregando(false); // A página terminou de carregar.
}}

useEffect(() => {

  carregarDados(); // Quando os dados estiverem prontos, executa a função que busca os carregamentos na API.

}, []);

// Calcula os totais para exibir nos cards de status.

  const totalOrdens = carregamentos.length; // Quantidade de carregamentos.
  const totalClientes = new Set(carregamentos.map((c) => c.cliente)).size; // Quantidade de clientes.
  const totalPlacas = new Set(carregamentos.map((c) => c.placa)).size; // Quantidade de placas.
  const totalCarregamentos = carregamentos.length; // Quantidade de carregamentos.

  const textoPesquisa = pesquisa.toLowerCase(); // Converte o texto digitado para minúsculo.

// Filtra os carregamentos de acordo com o texto digitado na barra de pesquisa. Verifica se o texto digitado está contido na ordem, cliente ou placa.

  const carregamentosFiltrados = carregamentos.filter((c) => 
    c.ordem.toLowerCase().includes(textoPesquisa) || 
    c.cliente.toLowerCase().includes(textoPesquisa) || 
    c.placa.toLowerCase().includes(textoPesquisa)
  );

  // Devolve a interface da página.

  return (
    <Layout>
      <Header />

    <div className="status-cards">

      <StatusCard
        titulo="Total de Ordens"
        valor={totalOrdens}
        icone="📦"
      />

      <StatusCard
        titulo="Clientes"
        valor={totalClientes}
        icone="👥"
      />

      <StatusCard
        titulo="Placas"
        valor={totalPlacas}
        icone="🚚"
      />

      <StatusCard
        titulo="Carregamentos"
        valor={totalCarregamentos}
        icone="📋"
      />

    </div>

      <BarraPesquisa
        pesquisa={pesquisa}
        setPesquisa={setPesquisa} 
      />

      <div className="acoes">
        <button onClick={carregarDados}>
          Atualizar
        </button>
      </div>

      {carregando ? ( // Está carregando? Se sim, exibe a mensagem "Carregando...".
        <p className="carregando">Carregando...</p>
      ) : erro ? (
        <p>{erro}</p> // Houve algum erro? Se sim, exibe a mensagem de erro.
      ) : (
        <TabelaCarregamentos carregamentos={carregamentosFiltrados} />
      )}
    </Layout>
  );
}

export default Carregamentos;
