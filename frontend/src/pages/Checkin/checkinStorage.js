// Funções para o fluxo de check-in não perder os dados já preenchidos se
// a página recarregar no meio do caminho (ex: o motorista atualiza o
// navegador sem querer, ou o tablet trava e reinicia a página sozinho).
//
// Guardamos tudo no sessionStorage do navegador. Diferente do
// localStorage, ele se apaga sozinho quando a aba/janela é fechada — o
// que é o comportamento certo aqui: não queremos que o check-in de um
// motorista continue disponível pro próximo que usar o mesmo aparelho.
//
// Existem dois "pedaços" de dados guardados separadamente, cada um sob
// sua própria chave: os dados da Identificação (Checkin.jsx) e os dados
// preenchidos na Conferência (Conferencia.jsx). Por isso as funções de
// ler/salvar/apagar abaixo são genéricas (recebem a chave como
// parâmetro) — evita repetir a mesma lógica de leitura/escrita duas vezes.
const CHAVE_DADOS_CHECKIN = 'checkin-dados';
const CHAVE_CONFERENCIA = 'checkin-conferencia';

// Lê um valor salvo no sessionStorage pela chave informada. Retorna null
// quando não há nada salvo (ex: primeira visita) ou quando o conteúdo
// salvo está corrompido/ilegível — assim quem chamar essas funções
// sempre pode tratar "sem dados salvos" com um simples "if".
function carregar(chave) {
  try {
    const bruto = sessionStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function salvar(chave, valor) {
  sessionStorage.setItem(chave, JSON.stringify(valor));
}

function limpar(chave) {
  sessionStorage.removeItem(chave);
}

// Dados da etapa de Identificação (número da ordem, documento, cliente,
// etapa atual do fluxo) — usados em Checkin.jsx.
export const carregarCheckin = () => carregar(CHAVE_DADOS_CHECKIN);
export const salvarCheckin = (dadosCheckin) =>
  salvar(CHAVE_DADOS_CHECKIN, dadosCheckin);
export const limparCheckin = () => limpar(CHAVE_DADOS_CHECKIN);

// Dados preenchidos na etapa de Conferência (motorista, veículo,
// vistoria, confirmações) — usados em Conferencia.jsx.
export const carregarConferencia = () => carregar(CHAVE_CONFERENCIA);
export const salvarConferencia = (conferencia) =>
  salvar(CHAVE_CONFERENCIA, conferencia);
export const limparConferencia = () => limpar(CHAVE_CONFERENCIA);
