import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Identificacao.css";

//
const ordensMock = {
  12345: {
    documentoVinculado: "",
    janelaInicio: "",
    janelaFim: "",
  },
  54321: {
    documentoVinculado: "",
    janelaInicio: "",
    janelaFim: "",
  },
};

//
function horaAtualDentroDaJanela(inicio, fim) {
  const agora = new Date();
  const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
  return horaAtual >= inicio && horaAtual <= fim;
}

function Identificacao() {
  const { setDadosCheckin } = useOutletContext();
  const navigate = useNavigate();

  const [numeroCarregamento, setNumeroCarregamento] = useState("");
  const [documento, setDocumento] = useState("");
  const [erro, setErro] = useState("");
  const [validando, setValidando] = useState(false);
}

function handletSubmit(e) {
  e.preventDefault();
  setErro("");
  setValidando(true);
}
