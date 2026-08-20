import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

// Lista dos links do menu lateral. Hoje só a rota "/carregamentos"
// realmente existe no App.jsx — as outras (Dashboard, Painel, etc.)
// são espaços reservados para páginas que ainda serão construídas.
const itensMenu = [
  { rotulo: "Dashboard", rota: "/dashboard" },
  { rotulo: "Painel", rota: "/painel" },
  { rotulo: "Gestão de Carregamentos", rota: "/carregamentos" },
  { rotulo: "Consulta de Motoristas", rota: "/motoristas" },
  { rotulo: "Suporte", rota: "/suporte" },
];

function Sidebar() {
  // useLocation devolve informações sobre a URL que está aberta agora
  // (ex: "/carregamentos"). Usamos isso para saber qual item do menu
  // deve aparecer destacado como "ativo".
  const location = useLocation();

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
          // Link troca de página sem recarregar o site inteiro (diferente
          // de um <a> comum) — é assim que a navegação entre rotas do
          // React Router funciona.
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
