import "./StepIndicator.css";

const etapas = ["Identificação", "Conferência", "Confirmação"];

function StepIndicator({ etapaAtual }) {
  return (
    <div className="step-indicator">
      {etapas.map((etapa, indice) => {
        const numero = indice + 1;
        const completa = numero < etapaAtual;
        const ativa = numero === etapaAtual;

        return (
          <div key={etapa} className="step-indicator__item">
            <div
              className={`step-indicator__bolha ${
                completa ? "step-indicator__bolha--completa" : ""
              } ${ativa ? "step-indicator__bolha--ativa" : ""}`}
            >
              {completa ? "✓" : numero}
            </div>

            <span className="step-indicator__rotulo">{etapa}</span>

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
