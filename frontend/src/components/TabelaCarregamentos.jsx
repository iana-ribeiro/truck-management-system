function TabelaCarregamentos({ carregamentos }) {
  return (
    <div>
      <h2>Carregamentos</h2>

      {carregamentos.map((carregamento) => (
        <p key={carregamento.ordem}>
          {carregamento.ordem} - {carregamento.cliente} - {carregamento.placa}
        </p>
      ))}
    </div>
  );
}

export default TabelaCarregamentos;
