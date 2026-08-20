import './BarraPesquisa.css';

// Campo de busca usado na página de Carregamentos. Este componente não
// guarda o texto digitado nem sabe filtrar nada sozinho — quem controla
// isso é a página Carregamentos.jsx, que passa "pesquisa" (o texto atual)
// e "setPesquisa" (a função para atualizar esse texto) como props.
// Esse padrão é chamado de "componente controlado".
function BarraPesquisa({ pesquisa, setPesquisa, onAtualizar }) {
  return (
    <section className="barra-pesquisa">
      <input
        type="text"
        placeholder="Pesquise por pedido ou cliente"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {/* onAtualizar também vem da página pai: ao clicar, refaz o pedido
          dos carregamentos ao backend, trazendo dados mais recentes. */}
      <button className="botao botao--primario" onClick={onAtualizar}>Atualizar</button>
    </section>
  );
}

export default BarraPesquisa;
