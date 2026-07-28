// Serviço responsável por buscar os carregamentos.
// Hoje retorna dados de exemplo.
// Futuramente fará a consulta ao banco do WGS.

export function buscarCarregamentos() {
  return [
    {
      ordem: 'TS-482731',
      cliente: 'Horizonte Sul',
      placa: 'ABC-1D23',
      status: 'Em andamento',
      transportadora: 'Transportadora A',
    },
    {
      ordem: 'TS-615904',
      cliente: 'Atlas Engenharia',
      placa: 'QWE-7F89',
      status: 'Concluído',
      transportadora: 'Transportadora B',
    },
    {
      ordem: 'TS-903218',
      cliente: 'Vale Forte',
      placa: 'MNO-4H56',
      status: 'Em andamento',
      transportadora: 'Transportadora C',
    },
  ];
}
