import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Lock, Truck, AlertCircle } from 'lucide-react';
import './Identificacao.css';

// Mock de ordens de carregamento e documentos bloqueados
const ordensMock = {
  12345: {
    documentoVinculado: '111.222.333-44',
    janelaInicio: '00:00',
    janelaFim: '23:59',
  },
  54321: {
    documentoVinculado: '999.888.777-66',
    janelaInicio: '08:00',
    janelaFim: '10:00',
  },
};

// Documentos bloqueados (exemplo)
const documentosBloqueados = ['999.888.777-66'];

// Função para verificar se a hora atual está dentro da janela de carregamento
function horaAtualDentroDaJanela(inicio, fim) {
  const agora = new Date();
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
  return horaAtual >= inicio && horaAtual <= fim;
}

// Função para remover caracteres não numéricos
function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

// Função para formatar o documento (CPF) no formato 000.000.000-00
function formatarDocumento(digitos) {
  return digitos
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Componente de Identificação do motorista
function Identificacao() {
  const { setDadosCheckin } = useOutletContext();
  const navigate = useNavigate();

  const [numeroCarregamento, setNumeroCarregamento] = useState('');
  const [documento, setDocumento] = useState('');
  const [erro, setErro] = useState('');
  const [validando, setValidando] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setValidando(true);

    setTimeout(() => {
      const ordem = ordensMock[numeroCarregamento];

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

      setDadosCheckin((atual) => ({
        ...atual,
        numeroCarregamento,
        documento,
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
