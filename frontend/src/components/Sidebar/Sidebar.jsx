import './Sidebar.css';

const itensMenu = [
  { rotulo: 'Dashboard' },
  { rotulo: 'Painel' },
  { rotulo: 'Gestão de Carregamentos', ativo: true },
  { rotulo: 'Consulta de Motoristas' },
  { rotulo: 'Suporte' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__marca">
        <div className="sidebar__logo">A</div>

        <div>
          <p className="sidebar__marca-titulo">Armazém</p>
          <p className="sidebar__marca-subtitulo">Gestão de Carregamentos</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {itensMenu.map((item) => (
          <span
            key={item.rotulo}
            className={`sidebar__item ${item.ativo ? 'sidebar__item--ativo' : ''}`}
          >
            {item.rotulo}
          </span>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
