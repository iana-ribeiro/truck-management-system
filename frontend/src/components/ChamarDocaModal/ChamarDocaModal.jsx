import { useState, useEffect } from 'react';
import './ChamarDocaModal.css';

const docasDisponiveis = ['Doca 1', 'Doca 2', 'Doca 3', 'Doca 4'];

function ChamarDocaModal({ carregamento, carregamentos, onFechar, onConfirmar }) {
  const [doca, setDoca] = useState('');

  useEffect(() => {
    setDoca(carregamento?.doca || '');
  }, [carregamento]);

  if (!carregamento) return null;

  const docasOcupadas = carregamentos
    .filter((c) => c.pedido !== carregamento.pedido && c.doca)
    .map((c) => c.doca);

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <div>
            <h2>Chamar para doca</h2>
            <p>{carregamento.cliente} · {carregamento.placa}</p>
          </div>

          <button className="modal-fechar" onClick={onFechar}>×</button>
        </div>

        <div className="modal-corpo">
          <label htmlFor="doca">Doca</label>
          <select id="doca" value={doca} onChange={(e) => setDoca(e.target.value)}>
            <option value="">Selecione a doca</option>
            {docasDisponiveis.map((d) => {
              const ocupada = docasOcupadas.includes(d);
              return (
                <option key={d} value={d} disabled={ocupada}>
                  {d}{ocupada ? ' — ocupada' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div className="modal-rodape">
  <button className="botao botao--secundario" onClick={onFechar}>Cancelar</button>
  <button
    className="botao botao--primario"
    disabled={!doca}
    onClick={() => onConfirmar(doca)}
  >
    Confirmar
  </button>
</div>
      </div>
    </div>
  );
}

export default ChamarDocaModal;