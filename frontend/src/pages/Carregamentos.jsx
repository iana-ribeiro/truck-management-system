import { useEffect, useState } from "react";
import BarraPesquisa from "../components/BarraPesquisa/BarraPesquisa"; // Traz o componente da barra de pesquisa.
import Header from "../components/Header/Header"; // Traz o componente do cabeçalho da página.
import Layout from "../components/Layout/Layout"; // Traz o componente do layout da página.
import StatusCard from "../components/StatusCards/StatusCards"; // Traz o componente dos cards de status.
import TabelaCarregamentos from "../components/TabelaCarregamentos/TabelaCarregamentos"; // Traz o componente da tabela.
import { buscarCarregamentos } from "../services/carregamentos"; // Traz a função que busca os carregamentos na API.
import "./Carregamentos.css";

// useState = "React, vou usar memória."

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]); // carregamentos = Guarda os dados da tabela. setCarregamentos = É a função que altera essa variável. Analogia com o controle remoto.
  const [pesquisa, setPesquisa] = useState(""); // pesquisa = Guarda o que o usuário digitou. setPesquisa = É a função que altera essa variável.
  const [carregando, setCarregando] = useState(true); // carregando = Guarda se a página está carregando. setCarregando = É a função que altera essa variável.
  const [erro, setErro] = useState(""); // erro = Guarda se houve algum erro. setErro = É a função que altera essa variável.

  // Execute o código depois que a página foi renderizada. Busque os carregamentos na API.

  async function carregarDados() {
    // Essa função organiza o processo. "Vou buscar os dados (1) e depois colocá-los no estado (2)."
    try {
      setCarregando(true); // A página está carregando.

      setErro(""); // Limpa a mensagem de erro.

      const dados = await buscarCarregamentos(); // (1) Conversa com a API.

      setCarregamentos(dados); //(2) Guarda os dados no estado da página.
    } catch (error) {
      console.error(error); // Mostra o erro real no console, pra facilitar debug no futuro.
      setErro("Erro ao buscar os carregamentos. Tente novamente mais tarde.");
    } finally {
      setCarregando(false); // A página terminou de carregar.
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
  }, []);

  // Calcula os totais para exibir nos cards de status.

  const totalDoDia = carregamentos.length;
  const aguardandoNaFila = carregamentos.filter(
    (c) => c.status === "Aguardando na fila",
  ).length;
  const emCarregamento = carregamentos.filter(
    (c) => c.status === "Em carregamento",
  ).length;
  const concluido = carregamentos.filter(
    (c) => c.status === "Concluído",
  ).length;

  const textoPesquisa = pesquisa.toLowerCase(); // Converte o texto digitado para minúsculo.

  // Filtra os carregamentos de acordo com o texto digitado na barra de pesquisa. Verifica se o texto digitado está contido no pedido ou no cliente.

  const carregamentosFiltrados = carregamentos.filter(
    (c) =>
      c.pedido.toLowerCase().includes(textoPesquisa) ||
      c.cliente.toLowerCase().includes(textoPesquisa),
  );

  // Devolve a interface da página.

  return (
    <>
      <Header />

      <Layout>
        <div className="status-cards">
          <StatusCard
            titulo="Total do Dia"
            valor={totalDoDia}
            cor="cinza"
            carregando={carregando}
          />
          <StatusCard
            titulo="Aguardando na Fila"
            valor={aguardandoNaFila}
            cor="azul"
            carregando={carregando}
          />
          <StatusCard
            titulo="Em Carregamento"
            valor={emCarregamento}
            cor="laranja"
            carregando={carregando}
          />
          <StatusCard
            titulo="Concluído"
            valor={concluido}
            cor="verde"
            carregando={carregando}
          />
        </div>

        <BarraPesquisa
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}
          onAtualizar={carregarDados}
        />

        {erro ? (
          <p>{erro}</p>
        ) : (
          <TabelaCarregamentos
            carregamentos={carregamentosFiltrados}
            carregando={carregando}
          />
        )}
      </Layout>
    </>
  );
}

export default Carregamentos;
