import {useState} from "react";
import './App.css'

function App() {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");

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
</div>

  )
}

export default App
