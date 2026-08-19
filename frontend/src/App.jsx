import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'; // Importando os componentes necessários do React Router para navegação entre páginas.
import Sidebar from './components/Sidebar/Sidebar';
import Carregamentos from './pages/Carregamentos';
import Checkin from './pages/Checkin/Checkin';
import Identificacao from './pages/Checkin/Identificacao';
import Conferencia from './pages/Checkin/Conferencia';
import './App.css';

function LayoutPrincipal() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-conteudo">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<Navigate to="/carregamentos" replace />} />
          <Route path="/carregamentos" element={<Carregamentos />} />
        </Route>

        <Route path="/checkin" element={<Checkin />}>
          <Route index element={<Navigate to="identificacao" replace />} />
          <Route path="identificacao" element={<Identificacao />} />
          <Route path="conferencia" element={<Conferencia />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // Envolvendo o aplicativo com o BrowserRouter para habilitar a navegação entre páginas.
  );
}

export default App;
