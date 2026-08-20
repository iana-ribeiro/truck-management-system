// Dados fictícios usados só para o formulário de Identificação funcionar
// sem depender do backend ainda. Quando existir uma rota de API real
// para validar carregamento e motorista, este arquivo pode ser apagado
// e Identificacao.jsx passa a chamar essa API no lugar dele.

// Simula as ordens de carregamento cadastradas: cada chave é o número da
// ordem, e o valor traz o cliente, a transportadora, o documento do
// motorista autorizado e o horário (janela) em que ele pode fazer o check-in.
export const ordensMock = {
  12345: {
    cliente: 'Vidraçaria Santos',
    transportadora: 'TransRio Logística',
    documentoVinculado: '111.222.333-44',
    janelaInicio: '00:00',
    janelaFim: '23:59',
  },
  54321: {
    cliente: 'Cristal Vidros Ltda',
    transportadora: 'Rodomax Transportes',
    documentoVinculado: '999.888.777-66',
    janelaInicio: '08:00',
    janelaFim: '10:00',
  },
};

// Documentos (CPFs) de motoristas que não podem passar pelo check-in.
export const documentosBloqueados = ['999.888.777-66'];
