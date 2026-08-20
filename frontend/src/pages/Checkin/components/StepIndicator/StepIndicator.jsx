import { Check } from 'lucide-react';
import './StepIndicator.css';

// Nomes das etapas do check-in, na ordem em que aparecem na barra de
// progresso. O índice de cada etapa nesta lista (+1) é o número usado
// para compará-la com "etapaAtual".
const etapas = ['Identificação', 'Conferência', 'Confirmação'];

// Barra de progresso mostrada no topo das telas de check-in (ex: bolinha
// 1 preenchida, bolinha 2 ativa, bolinha 3 ainda cinza). "etapaAtual" vem
// do estado dadosCheckin, guardado lá no componente Checkin.jsx.
function StepIndicator({ etapaAtual }) {
  return (
    <div className="step-indicator">
      {etapas.map((etapa, indice) => {
        const numero = indice + 1; // etapas começam em 1, não em 0
        const completa = numero < etapaAtual; // já foi passada
        const ativa = numero === etapaAtual; // é a etapa em que o usuário está agora

        return (
          <div key={etapa} className="step-indicator__item">
            <div
              className={`step-indicator__bolha ${
                completa ? 'step-indicator__bolha--completa' : ''
              } ${ativa ? 'step-indicator__bolha--ativa' : ''}`}
            >
              {/* Etapa concluída mostra um "check"; as outras mostram o número. */}
              {completa ? <Check size={14} /> : numero}
            </div>

            <span className="step-indicator__rotulo">{etapa}</span>

            {/* A linha conectando uma bolinha à próxima não deve
                aparecer depois da última etapa. */}
            {indice < etapas.length - 1 && (
              <div className="step-indicator__linha" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
