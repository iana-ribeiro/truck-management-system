import './TabelaCarregamentos.css';

function TabelaCarregamentos({ carregamentos }) {
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="sem-dados">
                Nenhum carregamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TabelaCarregamentos;
