// carregamentosService.mock.js — versão fake, sem banco de dados
// Serve pra você continuar desenvolvendo o frontend sem precisar
// do mssql instalado ou de conexão com o SQL Server.
// Tem o MESMO nome de função e o MESMO formato de retorno
// que a versão real (carregamentosService.mssql.js), então o
// controller não percebe diferença nenhuma.

export async function buscarCarregamentos() {
  // Simula o tempo de espera de uma consulta real ao banco,
  // pra você já ir acostumando a lidar com loading states no React.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      pedido: '10023',
      cliente: 'Vidraçaria Santos',
      placa: 'ABC-1234',
      doca: 'Doca 01',
      programado: '2026-08-03 08:00',
      chegada: '2026-08-03 07:52',
      inicioCarregamento: '2026-08-03 08:15',
      fimCarregamento: '2026-08-03 09:40',
      frete: 'DAP',
      status: 'Concluído',
    },
    {
      pedido: '10024',
      cliente: 'Cristal Vidros Ltda',
      placa: 'DEF-5678',
      doca: 'Doca 02',
      programado: '2026-08-03 09:30',
      chegada: '2026-08-03 09:45',
      inicioCarregamento: '2026-08-03 10:00',
      fimCarregamento: null,
      frete: 'DAP',
      status: 'Em carregamento',
    },
    {
      pedido: '10025',
      cliente: 'GlassPrime Distribuidora',
      placa: 'GHI-9012',
      doca: 'Doca 01',
      programado: '2026-08-03 11:00',
      chegada: '2026-08-03 10:50',
      inicioCarregamento: null,
      fimCarregamento: null,
      frete: 'DAP',
      status: 'Aguardando na fila',
    },
    {
      pedido: '10026',
      cliente: 'Vidro Forte Comércio',
      placa: 'JKL-3456',
      doca: null,
      programado: '2026-08-03 13:00',
      chegada: '2026-08-03 13:05',
      inicioCarregamento: null,
      fimCarregamento: null,
      frete: 'DAP',
      status: 'Aguardando na fila',
    },
    {
      pedido: '10027',
      cliente: 'Transparente Vidraçaria',
      placa: 'MNO-7890',
      doca: null,
      programado: '2026-08-03 14:30',
      chegada: '2026-08-03 14:20',
      inicioCarregamento: null,
      fimCarregamento: null,
      frete: 'DAP',
      status: 'Aguardando na fila',
    },
  ];
}
