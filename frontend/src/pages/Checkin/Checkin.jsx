import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './Checkin.css';

function Checkin() {
  const [dadosCheckin, setDadosCheckin] = useState({
    numeroCarregamento: '',
    documento: '',
    etapaAtual: 1,
  });

  return (
    <div className="checkin-tela">
      <div className="checkin-container">
        <Outlet context={{ dadosCheckin, setDadosCheckin }} />
      </div>
    </div>
  );
}

export default Checkin;
