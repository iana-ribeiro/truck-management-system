// Este arquivo é o "mapa de rotas" do site: ele decide qual página deve
// aparecer para cada endereço (URL) que o usuário acessa.
// Quem faz esse trabalho é o React Router, por isso a maioria dos nomes
// importados abaixo (BrowserRouter, Routes, Route...) vêm dele.

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Carregamentos from './pages/Carregamentos';
import Checkin from './pages/Checkin/Checkin';
import Identificacao from './pages/Checkin/Identificacao';
import Conferencia from './pages/Checkin/Conferencia';
import Confirmacao from './pages/Checkin/Confirmacao';
import './App.css';

// LayoutPrincipal é a "moldura" usada pelas páginas internas do sistema
// (as que ficam atrás do login/uso interno, como a de Carregamentos):
// a barra lateral (Sidebar) fica sempre fixa, e só o conteúdo da direita
// muda conforme a rota. O <Outlet /> é o "buraco" onde o React Router
// encaixa a página correspondente à URL atual.
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
        {/* Grupo de rotas que usa a moldura com Sidebar (área interna). */}
        <Route element={<LayoutPrincipal />}>
          {/* Se alguém acessar a raiz do site ("/"), redireciona
              automaticamente para "/carregamentos". */}
          <Route path="/" element={<Navigate to="/carregamentos" replace />} />
          <Route path="/carregamentos" element={<Carregamentos />} />
        </Route>

        {/* O fluxo de check-in do motorista é uma experiência separada,
            em tela cheia, sem a Sidebar — por isso fica fora do grupo
            acima e tem sua própria moldura (o componente Checkin). */}
        <Route path="/checkin" element={<Checkin />}>
          {/* "/checkin" sozinho não mostra nada: manda direto para a
              primeira etapa do check-in, que é a identificação. */}
          <Route index element={<Navigate to="identificacao" replace />} />
          <Route path="identificacao" element={<Identificacao />} />
          <Route path="conferencia" element={<Conferencia />} />
          <Route path="confirmacao" element={<Confirmacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
