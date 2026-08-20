import { useEffect, useState } from "react";
import BarraPesquisa from "../components/BarraPesquisa/BarraPesquisa";
import Header from "../components/Header/Header";
import Layout from "../components/Layout/Layout";
import StatusCard from "../components/StatusCards/StatusCards";
import TabelaCarregamentos from "../components/TabelaCarregamentos/TabelaCarregamentos";
import { buscarCarregamentos } from "../services/carregamentos";
import "./Carregamentos.css";

// Esta é a página principal do sistema: mostra os cartões de totais, a
// barra de busca e a tabela com os carregamentos do dia. Ela é a "dona"
// dos dados — busca tudo no backend e distribui para os componentes
// filhos (StatusCard, BarraPesquisa, TabelaCarregamentos) através de props.
function Carregamentos() {
  const [carregamentos, setCarregamentos] = useState([]); // lista completa vinda do backend
  const [pesquisa, setPesquisa] = useState(""); // texto digitado na barra de busca
  const [carregando, setCarregando] = useState(true); // true enquanto espera a resposta do backend
  const [erro, setErro] = useState(""); // mensagem de erro, se o pedido ao backend falhar

  // Busca os carregamentos no backend e guarda no estado da página.
  // Fica numa função separada (em vez de direto no useEffect) porque
  // o botão "Atualizar" da BarraPesquisa também precisa poder chamá-la.
  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarCarregamentos();

      setCarregamentos(dados);
    } catch (error) {
      console.error(error); // ajuda a investigar o problema no console do navegador
      setErro("Erro ao buscar os carregamentos. Tente novamente mais tarde.");
    } finally {
      // "finally" roda tanto se deu certo quanto se deu erro — por isso
      // é o lugar certo para desligar o "carregando".
      setCarregando(false);
    }
  }

  // useEffect com array vazio "[]" no final significa: "rode isso só uma
  // vez, assim que a página for exibida pela primeira vez."
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
  }, []);

  // Totais mostrados nos cartões do topo. São recalculados a cada
  // renderização a partir da lista "carregamentos" — não precisam de
  // useState próprio porque são só uma "leitura" dos dados que já existem.
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

  // Filtra a lista pelo texto digitado na busca, comparando pedido e
  // cliente sem diferenciar maiúsculas de minúsculas.
  const textoPesquisa = pesquisa.toLowerCase();
  const carregamentosFiltrados = carregamentos.filter(
    (c) =>
      c.pedido.toLowerCase().includes(textoPesquisa) ||
      c.cliente.toLowerCase().includes(textoPesquisa),
  );

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

        {/* Se deu erro, mostra a mensagem no lugar da tabela — não faz
            sentido tentar exibir uma tabela sem dados confiáveis. */}
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
