import { useState } from 'react';
import ChamarDocaModal from '../ChamarDocaModal/ChamarDocaModal';
import './TabelaCarregamentos.css';

function TabelaCarregamentos({ carregamentos }) {
  const [carregamentoSelecionado, setCarregamentoSelecionado] = useState(null);

  function handleConfirmar(doca) {
    console.log(`${carregamentoSelecionado.placa} chamado para a ${doca}`);
    setCarregamentoSelecionado(null);
  }

  return (
    <section className="tabela-container">
      <h2>Carregamentos</h2>

      <table className="tabela-carregamentos">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Placa</th>
            <th>Doca</th>
            <th>Programado</th>
            <th>Chegada</th>
            <th>Iní. Carreg.</th>
            <th>Fim Carreg.</th>
            <th>Frete</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {carregamentos.length > 0 ? (
            carregamentos.map((carregamento) => (
              <tr key={carregamento.pedido}>
                <td>{carregamento.pedido}</td>
                <td>{carregamento.cliente}</td>
                <td>{carregamento.placa}</td>
                <td>{carregamento.doca}</td>
                <td>{carregamento.programado}</td>
                <td>{carregamento.chegada}</td>
                <td>{carregamento.inicioCarregamento}</td>
                <td>{carregamento.fimCarregamento}</td>
                <td>{carregamento.frete}</td>
                <td>
                  <button
  className="botao botao--primario botao--compacto"
  onClick={() => setCarregamentoSelecionado(carregamento)}
>
  Chamar
</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="sem-dados">
                Nenhum carregamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ChamarDocaModal
        carregamento={carregamentoSelecionado}
        carregamentos={carregamentos}
        onFechar={() => setCarregamentoSelecionado(null)}
        onConfirmar={handleConfirmar}
      />
    </section>
  );
}

export default TabelaCarregamentos;