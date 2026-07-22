import './BarraPesquisa.css';

function BarraPesquisa( { pesquisa, setPesquisa } ) {
return (
    <section className="barra-pesquisa">
        <input
        type="text"
        placeholder="Buscar por ordem, cliente ou placa..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        />

        <button>Atualizar</button>
    </section>
)}

export default BarraPesquisa;