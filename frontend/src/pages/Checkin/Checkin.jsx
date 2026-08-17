import { useState } from "react";
import { Outlet } from "react-router-dom"; //
import Layout from "../../components/Layout/Layout"; // Decide sozinho, com base na URL, se quem entra ali é Identificacao, Conferencia ou Confirmacao.
import StepIndicator from "./components/StepIndicator/StepIndicator.jsx";
import "./Checkin.css";

// Estado para armazenar os dados do check-in. Guarda tanto os dados digitados quanto em qual etapa o processo está agora.
function Checkin() {
  const [dadosCheckin, setDadosCheckin] = useState({
    numeroCarregamento: "",
    documento: "",
    etapaAtual: 1,
  });

  return (
    <>
      <Layout>
        <div className="checkin-container">
          <StepIndicator etapaAtual={dadosCheckin.etapaAtual} />
          <Outlet context={{ dadosCheckin, setDadosCheckin }} />
        </div>
      </Layout>
    </>
  );
}

export default Checkin;
