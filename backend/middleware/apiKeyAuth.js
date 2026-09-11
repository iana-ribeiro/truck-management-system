// apiKeyAuth.js — trava simples de acesso às rotas da API. Exige que quem
// chamar o backend mande a mesma chave secreta configurada em API_KEY
// (.env), no cabeçalho "x-api-key". Sem isso, qualquer pessoa que
// alcançasse o backend (ex: mesma rede Wi-Fi) conseguia ler CPF/telefone
// dos motoristas em GET /checkins ou forjar check-ins em POST /checkins.
//
// Importante: essa chave fica embutida no JavaScript do frontend (veja
// VITE_API_KEY), então ela não é secreta pra quem abre o DevTools do
// navegador — o objetivo aqui é barrar acesso oportunista de fora (bots,
// scanners, outros sites), não substituir um login de verdade.
export function apiKeyAuth(req, res, next) {
  const chaveEsperada = process.env.API_KEY;
  const chaveRecebida = req.header('x-api-key');

  if (!chaveEsperada) {
    // Sem API_KEY configurada no .env, a proteção não tem como
    // funcionar de verdade — melhor recusar tudo do que deixar a rota
    // aberta sem ninguém perceber.
    console.error('❌ API_KEY não configurada no .env — recusando pedido.');
    return res.status(500).json({ erro: 'Servidor mal configurado.' });
  }

  if (chaveRecebida !== chaveEsperada) {
    return res.status(401).json({ erro: 'Não autorizado.' });
  }

  next();
}
