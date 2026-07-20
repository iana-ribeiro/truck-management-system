export async function buscarCarregamentos() {
  const resposta = await fetch('http://localhost:4000/carregamentos');

  const dados = await resposta.json();

  return dados;
}
