// Este é o primeiro arquivo que roda quando o site abre no navegador.
// Ele "planta" o componente <App /> dentro da página HTML e importa os
// estilos que valem para o site inteiro (cores, fontes, botões, etc.).

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Estilos globais: são carregados uma única vez aqui para que TODOS os
// componentes do site (não importa a pasta onde estejam) já nasçam com
// essas regras disponíveis.
import "./styles/variables.css"; // cores, fontes e tamanhos reutilizados em todo o projeto
import "./styles/global.css"; // reset básico (tira margens padrão do navegador, etc.)
import "./styles/botoes.css"; // aparência padrão dos botões do sistema
import "./styles/esqueleto.css"; // animação de "carregando..." usada em várias telas

import App from "./App.jsx";

// document.getElementById("root") pega a <div id="root"> que existe no
// index.html. É dentro dela que todo o site React vai ser desenhado.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* StrictMode não aparece na tela: é um "modo de alerta" do React que
        ajuda a encontrar erros comuns durante o desenvolvimento. */}
    <App />
  </StrictMode>,
);
