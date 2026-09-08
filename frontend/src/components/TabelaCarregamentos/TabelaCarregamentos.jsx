import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './TabelaCarregamentos.css';

// Define quais colunas existem na tabela e em que ordem aparecem.
// "chave" precisa bater com o nome do campo que vem da API (veja
// carregamentosService.mock.js no backend); "rotulo" é o texto exibido
// no cabeçalho. Ter isso numa lista só, em vez de escrever cada <th> e
// <td> na mão, evita repetir código e facilita adicionar/remover colunas.
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
  // Guarda por qual coluna a tabela está ordenada agora, e em qual
  // direção (crescente/decrescente). Ex: { coluna: 'cliente', direcao: 'asc' }.
  const [ordenacao, setOrdenacao] = useState({ coluna: null, direcao: 'asc' });

  // Roda quando o usuário clica no cabeçalho de uma coluna.
  function handleOrdenar(chave) {
    setOrdenacao((atual) => {
      // Clicou numa coluna diferente da que já estava ordenada:
      // começa ordenando essa nova coluna em ordem crescente.
      if (atual.coluna !== chave) {
        return { coluna: chave, direcao: 'asc' };
      } else {
        // Clicou de novo na mesma coluna: inverte a direção
        // (crescente vira decrescente e vice-versa).
        return {
          coluna: chave,
          direcao: atual.direcao === 'asc' ? 'desc' : 'asc',
        };
      }
    });
  }

  // Cria uma cópia ordenada da lista de carregamentos, sem alterar a
  // lista original recebida por props (por isso o "[...carregamentos]").
  const carregamentosOrdenados = [...carregamentos].sort((a, b) => {
    if (!ordenacao.coluna) return 0; // nenhuma coluna escolhida: mantém a ordem original

    const valorA = a[ordenacao.coluna] ?? '';
    const valorB = b[ordenacao.coluna] ?? '';
    // localeCompare compara texto "como gente lê" (ex: coloca "10" antes
    // de "9" quando numeric: true, e ignora maiúsculas/minúsculas).
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
                {/* A setinha só aparece na coluna que está sendo usada
                    para ordenar no momento. */}
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
          </tr>
        </thead>

        <tbody>
          {carregando ? (
            // Enquanto os dados não chegaram, desenha 5 linhas "fantasma"
            // com blocos cinzas piscando, no lugar dos dados reais.
            Array.from({ length: 5 }).map((_, indice) => (
              <tr key={`esqueleto-${indice}`}>
                {colunas.map((col) => (
                  <td key={col.chave}>
                    <div className="esqueleto celula-esqueleto" />
                  </td>
                ))}
              </tr>
            ))
          ) : carregamentosOrdenados.length > 0 ? (
            carregamentosOrdenados.map((carregamento) => (
              <tr key={carregamento.pedido}>
                {colunas.map((col) => (
                  <td key={col.chave}>{carregamento[col.chave]}</td>
                ))}
              </tr>
            ))
          ) : (
            // Nem carregando, nem com resultados: a busca não encontrou nada.
            <tr>
              <td colSpan={colunas.length} className="sem-dados">
                Nenhum carregamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TabelaCarregamentos;
