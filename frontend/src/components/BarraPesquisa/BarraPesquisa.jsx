import './BarraPesquisa.css';

function BarraPesquisa({ pesquisa, setPesquisa, onAtualizar }) {
  return (
    <section className="barra-pesquisa">
      <input
        type="text"
        placeholder="Pesquise por pedido ou cliente"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <button className="botao botao--primario" onClick={onAtualizar}>Atualizar</button>
    </section>
  );
}

export default BarraPesquisa;