import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { carregarCheckin, salvarCheckin } from './checkinStorage';
import './Checkin.css';

// Formato inicial de dadosCheckin quando não há nenhum check-in salvo
// para recuperar (ex: primeira vez que o motorista abre a página).
const dadosIniciais = {
  numeroCarregamento: '',
  documento: '',
  cliente: '',
  transportadora: '',
  etapaAtual: 1,
};

// Página "mãe" de todo o fluxo de check-in (veja as rotas filhas em
// App.jsx: /checkin/identificacao e /checkin/conferencia). Ela não
// desenha formulário nenhum — só guarda os dados coletados ao longo das
// etapas e os repassa para a etapa atual através do <Outlet context={...}>.
function Checkin() {
  // A Conferência (e, mais pra frente, a Confirmação final) têm abas e
  // vários campos lado a lado, então precisam de mais espaço horizontal
  // do que a Identificação (que é só um formulário simples e fica melhor
  // compacto e centralizado). Por isso o container muda de tamanho
  // dependendo da rota atual — /checkin/confirmacao ainda não existe,
  // mas já deixamos a regra pronta pra quando essa etapa for construída.
  const location = useLocation();
  const containerLargo =
    location.pathname.startsWith('/checkin/conferencia') ||
    location.pathname.startsWith('/checkin/confirmacao');

  // dadosCheckin viaja entre as etapas do fluxo e vai sendo preenchido
  // conforme o motorista avança (ex: Identificacao.jsx grava
  // numeroCarregamento, documento e cliente; etapaAtual controla em qual
  // passo do StepIndicator o usuário está).
  //
  // O "() => ..." aqui é um inicializador preguiçoso: em vez de sempre
  // começar do zero, ele tenta recuperar um check-in que já estava em
  // andamento (salvo no sessionStorage por causa de um recarregamento de
  // página). Precisa ser uma função porque o useState só deve ler o
  // sessionStorage UMA vez, na primeira renderização — não a cada
  // atualização de estado.
  const [dadosCheckin, setDadosCheckin] = useState(
    () => carregarCheckin() ?? dadosIniciais,
  );

  // Sempre que dadosCheckin mudar, salva o valor mais recente no
  // sessionStorage. Isso é um bom uso de useEffect (diferente do caso do
  // ChamarDocaModal): aqui estamos sincronizando o React com algo de
  // FORA dele — o armazenamento do navegador — não ajustando um estado
  // que já existe dentro do próprio componente.
  useEffect(() => {
    salvarCheckin(dadosCheckin);
  }, [dadosCheckin]);

  return (
    <div className="checkin-tela">
      <div
        className={`checkin-container ${containerLargo ? 'checkin-container--largo' : ''}`}
      >
        {/* O "context" do Outlet é como esta página passa dadosCheckin e
            setDadosCheckin para a etapa filha que estiver ativa. Cada
            etapa lê esses valores com o hook useOutletContext(). */}
        <Outlet context={{ dadosCheckin, setDadosCheckin }} />
      </div>
    </div>
  );
}

export default Checkin;
