import { useState } from 'react';
import { X } from 'lucide-react';
import './ChamarDocaModal.css';

// Lista fixa das docas que existem no pátio. Se um dia a empresa criar
// mais docas (ou renomear alguma), é só ajustar aqui.
const docasDisponiveis = ['Doca 1', 'Doca 2', 'Doca 3', 'Doca 4'];

// Janela (modal) que abre quando o usuário clica em "Chamar" numa linha
// da tabela, para escolher em qual doca aquele caminhão vai carregar.
// "carregamento" é a linha selecionada; enquanto ninguém clicou em
// "Chamar", ele vem como null e o modal fica escondido.
function ChamarDocaModal({
  carregamento,
  carregamentos,
  onFechar,
  onConfirmar,
}) {
  const [doca, setDoca] = useState('');

  // Guarda qual foi o último "carregamento" recebido, só para detectar
  // quando ele muda. Comparar e ajustar o estado aqui, durante a própria
  // renderização, é a forma que o React recomenda para "resetar" um
  // estado quando uma prop muda — no lugar de um useEffect, que faria o
  // componente renderizar uma vez a mais a cada troca de carregamento.
  const [carregamentoAnterior, setCarregamentoAnterior] = useState(carregamento);
  if (carregamento !== carregamentoAnterior) {
    setCarregamentoAnterior(carregamento);
    setDoca(carregamento?.doca || '');
  }

  // Sem carregamento selecionado, não existe nada para mostrar — o
  // componente "se apaga" retornando null.
  if (!carregamento) return null;

  // Descobre quais docas já estão sendo usadas por OUTROS carregamentos,
  // para impedir que o usuário escolha uma doca ocupada por engano.
  const docasOcupadas = carregamentos
    .filter((c) => c.pedido !== carregamento.pedido && c.doca)
    .map((c) => c.doca);

  return (
    // Clicar no fundo escurecido fecha o modal; clicar dentro da caixa
    // branca não (por isso o stopPropagation lá embaixo, que impede o
    // clique de "vazar" para o fundo).
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <div>
            <h2>Chamar para doca</h2>
            <p>
              {carregamento.cliente} · {carregamento.placa}
            </p>
          </div>

          <button className="modal-fechar" onClick={onFechar}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-corpo">
          <label htmlFor="doca">Doca</label>
          <select
            id="doca"
            value={doca}
            onChange={(e) => setDoca(e.target.value)}
          >
            <option value="">Selecione a doca</option>
            {docasDisponiveis.map((d) => {
              const ocupada = docasOcupadas.includes(d);
              return (
                // "disabled" impede o clique, mas a opção continua
                // visível — assim o usuário entende por que ela sumiu
                // da lista de escolhas possíveis.
                <option key={d} value={d} disabled={ocupada}>
                  {d}
                  {ocupada ? ' — ocupada' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div className="modal-rodape">
          <button className="botao botao--secundario" onClick={onFechar}>
            Cancelar
          </button>
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
