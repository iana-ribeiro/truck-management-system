import { Link, useLocation } from "react-router-dom";
// Link é o componente de navegação.
// useLocation é um hook que devolve informações sobre a URL atual.
import "./Sidebar.css";

const itensMenu = [
  // Cada item agora tem uma rota.
  { rotulo: "Dashboard", rota: "/dashboard" },
  { rotulo: "Painel", rota: "/painel" },
  { rotulo: "Gestão de Carregamentos", rota: "/carregamentos", ativo: true },
  { rotulo: "Consulta de Motoristas", rota: "/motoristas" },
  { rotulo: "Suporte", rota: "/suporte" },
];

function Sidebar() {
  const location = useLocation(); // Obtendo a localização atual

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
          <Link
            key={item.rotulo}
            to={item.rota}
            className={`sidebar__item ${location.pathname === item.rota ? "sidebar__item--ativo" : ""}`}
          >
            {item.rotulo}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
