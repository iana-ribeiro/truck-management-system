import './BarraPesquisa.css';

function BarraPesquisa() {
return (
    <section className="barra-pesquisa">
        <input
        type="text"
        placeholder="Buscar por ordem, cliente ou placa..."
        />

        <button>Atualizar</button>
    </section>
)}

export default BarraPesquisa;