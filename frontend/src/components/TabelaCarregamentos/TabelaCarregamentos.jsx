import "./TabelaCarregamentos.css";

function TabelaCarregamentos({ carregamentos }) {
  return (
    <section className="tabela-container">
      <h2>Carregamentos</h2>

      <table className="tabela-carregamentos">
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Cliente</th>
            <th>Placa</th>
          </tr>
        </thead>
        
        <tbody>
          {carregamentos.length > 0 ? (
            carregamentos.map((carregamento) => (
              <tr key={carregamento.ordem}>
                <td>{carregamento.planta}</td>
                <td>{carregamento.pedido}</td>
                <td>{carregamento.cliente}</td>
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
