import './Header.css';

// Cabeçalho fixo da página de Carregamentos: só texto, sem dados
// dinâmicos por enquanto. Se no futuro o título precisar mudar conforme
// a página, dá para transformar em props (ex: <Header titulo="..." />).
function Header() {
  return (
    <header className="header">
      <div>
        <h1>Gestão de Carregamentos</h1>
        <p>Monitoramento dos carregamentos da planta em tempo real.</p>
      </div>
    </header>
  );
}

export default Header;
