// Este arquivo é a "ponte" entre o frontend (o que aparece na tela) e o
// backend (o servidor que guarda os dados). Ele não desenha nada — só
// sabe conversar com a API. Quem usa essa função é a página
// Carregamentos.jsx, que pede os dados e decide como exibi-los.

// VITE_API_URL vem do arquivo .env (veja .env.example na raiz do
// frontend). Assim, o endereço do backend pode mudar entre o seu
// computador e a produção sem precisar alterar o código.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function buscarCarregamentos() {
  // fetch faz o pedido HTTP para o backend, no endereço
  // "<API_URL>/carregamentos". Isso é assíncrono (demora um pouco),
  // por isso usamos "await": esperamos a resposta chegar antes de seguir.
  const resposta = await fetch(`${API_URL}/carregamentos`);

  // fetch só rejeita numa falha de REDE (ex: servidor fora do ar) — uma
  // resposta de erro do backend (como 500) ainda chega aqui normalmente,
  // só que com "resposta.ok" em false. Sem essa checagem, um erro do
  // backend (ex: { erro: "..." }) seria tratado como se fossem os dados
  // de verdade, e quebraria mais na frente (Carregamentos.jsx espera uma
  // LISTA de carregamentos, não um objeto de erro).
  if (!resposta.ok) {
    throw new Error('Falha ao buscar os carregamentos.');
  }

  // A resposta chega em um formato "cru"; .json() a transforma em um
  // objeto/array JavaScript que dá para usar normalmente no código.
  const dados = await resposta.json();

  return dados;
}
