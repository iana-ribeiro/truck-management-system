import "./TabelaCarregamentos.css";

function TabelaCarregamentos({ carregamentos }) {
  return (
    <section className="tabela-container">
      <h2>Carregamentos</h2>

      <table className="tabela-carregamentos">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Doca</th>
          </tr>
        </thead>
        
        <tbody>
          {carregamentos.length > 0 ? (
            carregamentos.map((carregamento) => (
              <tr key={carregamento.pedido}>
                <td>{carregamento.pedido}</td>
                <td>{carregamento.cliente}</td>
                <td>{carregamento.doca}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="sem-dados">
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
