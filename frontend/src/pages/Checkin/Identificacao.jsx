import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Lock, Truck, AlertCircle } from 'lucide-react';
import { ordensMock, documentosBloqueados } from './Identificacao.mock';
import { limparConferencia } from './checkinStorage';
import './Identificacao.css';

// Verifica se o horário atual está dentro da janela permitida para
// aquele carregamento (ex: entre "08:00" e "10:00"). Comparar strings
// nesse formato "HH:MM" funciona porque, alfabeticamente, elas ficam na
// mesma ordem que os horários reais.
function horaAtualDentroDaJanela(inicio, fim) {
  const agora = new Date();
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
  return horaAtual >= inicio && horaAtual <= fim;
}

// Remove tudo que não for número do texto digitado (ex: "111.222" vira "111222").
// Serve para não deixar o usuário digitar letras nos campos numéricos.
function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

// Transforma uma sequência de números em CPF formatado: "111222333" vira
// "111.222.333". Cada .replace() adiciona um ponto (ou traço) numa
// posição específica do texto.
function formatarDocumento(digitos) {
  return digitos
    .slice(0, 11) // CPF tem no máximo 11 números
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Primeira etapa do check-in: o motorista informa o número do
// carregamento e o próprio documento. Se tudo bater, os dados são
// guardados no estado compartilhado do fluxo (dadosCheckin, que vive no
// componente pai Checkin.jsx) e a navegação segue para a Conferência.
function Identificacao() {
  // useOutletContext pega o "setDadosCheckin" que o Checkin.jsx
  // disponibilizou lá em cima, na rota pai — é assim que essa página
  // consegue guardar dados que a próxima etapa (Conferência) vai usar.
  const { setDadosCheckin } = useOutletContext();
  const navigate = useNavigate();

  const [numeroCarregamento, setNumeroCarregamento] = useState('');
  const [documento, setDocumento] = useState('');
  const [erro, setErro] = useState('');
  const [validando, setValidando] = useState(false); // true enquanto a "verificação" está rodando

  function handleSubmit(e) {
    e.preventDefault(); // impede o navegador de recarregar a página ao enviar o formulário
    setErro('');
    setValidando(true);

    // O setTimeout aqui simula o tempo de espera de uma consulta real ao
    // backend (que ainda não existe para esta etapa). Quando a validação
    // de verdade for implementada, este bloco deve virar uma chamada a
    // uma função de services/, como em Carregamentos.jsx.
    setTimeout(() => {
      const ordem = ordensMock[numeroCarregamento];

      // As verificações abaixo rodam em sequência, cada uma parando o
      // processo (return) assim que encontra um motivo para bloquear.
      if (!ordem) {
        setErro('Ordem não encontrada. Confira o número digitado.');
        setValidando(false);
        return;
      }

      if (ordem.documentoVinculado !== documento) {
        setErro('Documento não confere com essa ordem.');
        setValidando(false);
        return;
      }

      if (!horaAtualDentroDaJanela(ordem.janelaInicio, ordem.janelaFim)) {
        setErro(
          `Fora da janela de carregamento (${ordem.janelaInicio} às ${ordem.janelaFim}).`,
        );
        setValidando(false);
        return;
      }

      if (documentosBloqueados.includes(documento)) {
        setErro('Motorista bloqueado. Procure a portaria.');
        setValidando(false);
        return;
      }

      // Passou em todas as verificações: descarta qualquer preenchimento
      // de Conferência que tenha ficado salvo de um check-in anterior
      // (senão dados de outro motorista/veículo poderiam aparecer aqui
      // por engano), guarda os dados coletados e avança para a etapa 2.
      limparConferencia();

      setDadosCheckin((atual) => ({
        ...atual,
        numeroCarregamento,
        documento,
        cliente: ordem.cliente,
        transportadora: ordem.transportadora,
        etapaAtual: 2,
      }));

      setValidando(false);
      navigate('/checkin/conferencia');
    }, 600);
  }

  return (
    <>
      <div className="identificacao__boas-vindas">
        <div className="identificacao__logo">
          <Truck size={20} color="white" />
        </div>
        <h1>Bem-vindo à Guardian</h1>
        <p>
          Insira o número do carregamento e seu documento para iniciar o
          checkin.
        </p>
      </div>

      <form className="identificacao" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="numeroCarregamento">Nº do carregamento</label>
          <input
            id="numeroCarregamento"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={numeroCarregamento}
            onChange={(e) =>
              setNumeroCarregamento(apenasDigitos(e.target.value).slice(0, 6))
            }
            placeholder="Ex: 12345"
          />
        </div>

        <div className="campo">
          <label htmlFor="documento">Documento do motorista</label>
          <input
            id="documento"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={documento}
            onChange={(e) =>
              setDocumento(formatarDocumento(apenasDigitos(e.target.value)))
            }
            placeholder="Ex: 111.222.333-44"
          />
        </div>

        {erro && (
          <p className="identificacao__erro">
            <AlertCircle size={16} className="identificacao__erro-icone" />
            {erro}
          </p>
        )}

        <button
          className="botao botao--primario identificacao__botao"
          type="submit"
          disabled={validando}
        >
          {validando ? 'Verificando...' : 'Continuar'}
        </button>

        <p className="identificacao__lgpd">
          <Lock size={16} />
          Os dados informados serão tratados de forma segura e em conformidade
          com a LGPD (Lei nº 13.709/2018).
        </p>
      </form>
    </>
  );
}

export default Identificacao;
