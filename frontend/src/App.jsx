import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importando os componentes necessários do React Router para navegação entre páginas.
import Sidebar from "./components/Sidebar/Sidebar";
import Carregamentos from "./pages/Carregamentos";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <div className="app-shell">
        <Sidebar />
        <div className="app-conteudo">
          <Routes>
            {" "}
            // Definindo as rotas do aplicativo usando o componente Routes.
            <Route
              path="/"
              element={<Navigate to="/carregamentos" replace />}
            />
            <Route path="/carregamentos" element={<Carregamentos />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    // Envolvendo o aplicativo com o BrowserRouter para habilitar a navegação entre páginas.
  );
}

export default App;
