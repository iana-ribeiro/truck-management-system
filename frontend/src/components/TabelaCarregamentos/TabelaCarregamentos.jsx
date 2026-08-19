import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import ChamarDocaModal from '../ChamarDocaModal/ChamarDocaModal';
import './TabelaCarregamentos.css';

const colunas = [
  { chave: 'pedido', rotulo: 'Pedido' },
  { chave: 'cliente', rotulo: 'Cliente' },
  { chave: 'placa', rotulo: 'Placa' },
  { chave: 'doca', rotulo: 'Doca' },
  { chave: 'programado', rotulo: 'Programado' },
  { chave: 'chegada', rotulo: 'Chegada' },
  { chave: 'inicioCarregamento', rotulo: 'Iní. Carreg.' },
  { chave: 'fimCarregamento', rotulo: 'Fim Carreg.' },
  { chave: 'frete', rotulo: 'Frete' },
];

function TabelaCarregamentos({ carregamentos, carregando }) {
  const [carregamentoSelecionado, setCarregamentoSelecionado] = useState(null);
  const [ordenacao, setOrdenacao] = useState({ coluna: null, direcao: 'asc' });

  function handleConfirmar(doca) {
    console.log(`${carregamentoSelecionado.placa} chamado para a ${doca}`);
    setCarregamentoSelecionado(null);
  }

  function handleOrdenar(chave) {
    setOrdenacao((atual) => {
      if (atual.coluna !== chave) {
        return { coluna: chave, direcao: 'asc' };
      } else {
        return {
          coluna: chave,
          direcao: atual.direcao === 'asc' ? 'desc' : 'asc',
        };
      }
    });
  }

  const carregamentosOrdenados = [...carregamentos].sort((a, b) => {
    if (!ordenacao.coluna) return 0;

    const valorA = a[ordenacao.coluna] ?? '';
    const valorB = b[ordenacao.coluna] ?? '';
    const resultado = String(valorA).localeCompare(String(valorB), undefined, {
      numeric: true,
    });

    return ordenacao.direcao === 'asc' ? resultado : -resultado;
  });

  return (
    <section className="tabela-container">
      <h2>Carregamentos</h2>

      <table className="tabela-carregamentos">
        <thead>
          <tr>
            {colunas.map((col) => (
              <th key={col.chave} onClick={() => handleOrdenar(col.chave)}>
                {col.rotulo}
                {ordenacao.coluna === col.chave && (
                  <span className="icone-ordenacao">
                    {ordenacao.direcao === 'asc' ? (
                      <ArrowUp size={12} />
                    ) : (
                      <ArrowDown size={12} />
                    )}
                  </span>
                )}
              </th>
            ))}
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {carregando ? (
            Array.from({ length: 5 }).map((_, indice) => (
              <tr key={`esqueleto-${indice}`}>
                {colunas.map((col) => (
                  <td key={col.chave}>
                    <div className="esqueleto celula-esqueleto" />
                  </td>
                ))}
                <td>
                  <div className="esqueleto celula-esqueleto celula-esqueleto--acao" />
                </td>
              </tr>
            ))
          ) : carregamentosOrdenados.length > 0 ? (
            carregamentosOrdenados.map((carregamento) => (
              <tr key={carregamento.pedido}>
                {colunas.map((col) => (
                  <td key={col.chave}>{carregamento[col.chave]}</td>
                ))}
                <td>
                  <button
                    className="botao botao--primario botao--compacto"
                    onClick={() => setCarregamentoSelecionado(carregamento)}
                  >
                    Chamar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="sem-dados">
                Nenhum carregamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ChamarDocaModal
        carregamento={carregamentoSelecionado}
        carregamentos={carregamentos}
        onFechar={() => setCarregamentoSelecionado(null)}
        onConfirmar={handleConfirmar}
      />
    </section>
  );
}

export default TabelaCarregamentos;
