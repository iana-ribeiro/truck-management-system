import { useState } from "react";
import { Outlet } from "react-router-dom";
import StepIndicator from "./components/StepIndicator/StepIndicator";
import "./Checkin.css";

function Checkin() {
  const [dadosCheckin, setDadosCheckin] = useState({
    numeroCarregamento: "",
    documento: "",
    etapaAtual: 1,
  });

  return (
    <div className="checkin-tela">
      <div className="checkin-container">
        <StepIndicator etapaAtual={dadosCheckin.etapaAtual} />

        <Outlet context={{ dadosCheckin, setDadosCheckin }} />
      </div>
    </div>
  );
}

export default Checkin;
