function TabelaCarregamentos({ carregamentos }) {
  return (
    <div>
      <h2>Carregamentos</h2>

      <table>
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Cliente</th>
            <th>Placa</th>
          </tr>
        </thead>
        
        <tbody>
          {carregamentos.map((carregamento) => (
            <tr key={carregamento.ordem}>
              <td>{carregamento.ordem}</td>
              <td>{carregamento.cliente}</td>
              <td>{carregamento.placa}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {carregamentos.map((carregamento) => (
        <p key={carregamento.ordem}>
          {carregamento.ordem} - {carregamento.cliente} - {carregamento.placa}
        </p>
      ))}
    </div>
  );
}

export default TabelaCarregamentos;
