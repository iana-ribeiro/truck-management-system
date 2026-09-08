// Ponte entre o frontend e o backend para os check-ins concluídos. Mesmo
// espírito de services/carregamentos.js: não desenha nada, só conversa
// com a API.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Envia o check-in concluído pro backend gravar no banco (veja
// backend/services/checkinsService.js) e devolve o número do ticket
// gerado, que a tela de Confirmação mostra pro motorista.
export async function registrarCheckin(dadosCheckin) {
  const resposta = await fetch(`${API_URL}/checkins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosCheckin),
  });

  if (!resposta.ok) {
    throw new Error('Falha ao registrar o check-in.');
  }

  const dados = await resposta.json();
  return dados.ticket;
}
