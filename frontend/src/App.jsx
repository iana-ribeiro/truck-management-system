import Sidebar from './components/Sidebar/Sidebar';
import Carregamentos from './pages/Carregamentos';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-conteudo">
        <Carregamentos />
      </div>
    </div>
  );
}

export default App;
