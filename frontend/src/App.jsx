import {useState, useEffect} from "react";
import './App.css'

// useEffect = "Execute este código quando alguma coisa acontecer." Executa quando o React decide que é a hora (por exemplo, ao abrir a página).

function App() {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [albums, setAlbums] = useState([]);

async function cadastrarAlbum() {
    
    const resposta = await fetch("http://localhost:4000/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({nome, ano})
    });
      
    console.log(resposta);
  }

  async function buscarAlbums() {
    const resposta = await fetch("http://localhost:4000/albums");

    const dados = await resposta.json();

    setAlbums(dados);
  }

  useEffect(() => {
    buscarAlbums();
  }, []);

  return (
<div>
  <h1>Teste</h1>
  <h2>Cadastrar Álbum</h2>

  <input 
  type="text" 
  placeholder="Nome do Álbum" 
  onChange={(e) => setNome(e.target.value)} // Pegue o que foi digitado no input e guarde na memória chamada nome.
  />

  <br />
  <br />

  <input 
  type="text" 
  placeholder="Ano"
  onChange={(e) => setAno(e.target.value)}
  />

  <p>Nome: {nome}</p>
  <p>Ano: {ano}</p>

  <br />
  <br />

  <button onClick={cadastrarAlbum}>Cadastrar</button>

  <br />
  <br />

  <h2>Álbuns Cadastrados</h2>

  {albums.map((album) => (
  <p key={album.id}>{album.nome} - {album.ano}</p>
  ))}

</div>

  )
}

export default App
