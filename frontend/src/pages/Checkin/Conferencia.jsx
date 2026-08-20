import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Check } from 'lucide-react';
import StepIndicator from './components/StepIndicator/StepIndicator';
import { carregarConferencia, salvarConferencia } from './checkinStorage';
import './Conferencia.css';

// Define as quatro abas do formulário de conferência. "Motorista" e
// "Veículo" já estão implementadas de verdade; "Vistoria" e
// "Confirmações" ainda mostram a mensagem "Em construção" (veja mais
// abaixo no JSX) — serão implementadas nas próximas etapas.
const abas = [
  { id: 'motorista', rotulo: 'Motorista' },
  { id: 'veiculo', rotulo: 'Veículo' },
  { id: 'vistoria', rotulo: 'Vistoria' },
  { id: 'confirmacoes', rotulo: 'Confirmações' },
];

// Opções fixas de escolha na aba Veículo, mostradas como "chips"
// clicáveis (veja o componente Chip logo abaixo).
const tiposOperacao = ['Carga', 'Descarga', 'Outro'];
const tiposVeiculo = [
  'Graneleiro',
  'Guarda baixa',
  'In loader',
  'Sider',
  'Container',
];

// Considera a aba "Motorista" completa quando os três campos
// obrigatórios estiverem preenchidos. Usado para decidir se aparece o
// ícone de check na aba e se o botão "Continuar" pode ser clicado.
function motoristaCompleto(motorista) {
  return Boolean(
    motorista.nomeCompleto && motorista.cpf && motorista.telefoneContato,
  );
}

// Mesma ideia da função acima, mas para os campos da aba "Veículo".
function veiculoCompleto(veiculo) {
  return Boolean(veiculo.placa && veiculo.tipoOperacao && veiculo.tipoVeiculo);
}

// Botão em formato de pílula usado para escolher UMA opção dentro de uma
// lista pequena (ex: tipo de operação, tipo de veículo). Existe como
// componente à parte porque é usado em dois lugares diferentes da aba
// Veículo — assim evitamos repetir o mesmo JSX duas vezes.
function Chip({ rotulo, ativo, onClick }) {
  return (
    <button
      type="button"
      className={`conferencia__chip ${ativo ? 'conferencia__chip--ativo' : ''}`}
      onClick={onClick}
    >
      {rotulo}
    </button>
  );
}

// Segunda etapa do check-in: confirma e completa os dados do motorista
// (e, no futuro, do veículo e da vistoria) antes de liberar o carregamento.
function Conferencia() {
  // dadosCheckin veio da etapa anterior (Identificacao.jsx), repassado
  // pelo componente pai Checkin.jsx através do Outlet.
  const { dadosCheckin } = useOutletContext();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState('motorista');

  // Estado com os dados de cada aba do formulário. Assim como em
  // Checkin.jsx, o inicializador tenta primeiro recuperar um
  // preenchimento salvo no sessionStorage (ex: o usuário recarregou a
  // página no meio da Conferência) antes de cair no formulário vazio —
  // com o CPF do motorista já preenchido com o documento informado na
  // etapa 1, pra não pedir a mesma informação duas vezes.
  const [conferencia, setConferencia] = useState(
    () =>
      carregarConferencia() ?? {
        motorista: {
          nomeCompleto: '',
          cpf: dadosCheckin.documento,
          cnhNumero: '',
          telefoneContato: '',
        },
        veiculo: {
          placa: '',
          tipoOperacao: '',
          tipoVeiculo: '',
        },
        vistoria: {},
        confirmacoes: {},
      },
  );

  // Mesmo raciocínio do useEffect em Checkin.jsx: sincroniza o estado do
  // React com o sessionStorage toda vez que algum campo da Conferência muda.
  useEffect(() => {
    salvarConferencia(conferencia);
  }, [conferencia]);

  // Atualiza um único campo dentro de "motorista", mantendo os outros
  // campos como estavam (por isso o "...atual.motorista" antes de trocar
  // só a chave que mudou).
  function atualizarMotorista(campo, valor) {
    setConferencia((atual) => ({
      ...atual,
      motorista: { ...atual.motorista, [campo]: valor },
    }));
  }

  // Mesma lógica de atualizarMotorista, só que para os campos de "veiculo".
  function atualizarVeiculo(campo, valor) {
    setConferencia((atual) => ({
      ...atual,
      veiculo: { ...atual.veiculo, [campo]: valor },
    }));
  }

  // Indica, para cada aba, se ela já está completa — decide se o ícone
  // de check aparece ao lado do nome da aba. Vistoria e confirmações
  // ainda não têm formulário real, então ficam marcadas como "true" só
  // para não travar a navegação entre abas.
  const statusPorAba = {
    motorista: motoristaCompleto(conferencia.motorista),
    veiculo: veiculoCompleto(conferencia.veiculo),
    vistoria: true, // provisório
    confirmacoes: true, // provisório
  };

  return (
    <>
      <div className="conferencia__cabecalho">
        <h1>Conferência</h1>
        <p>
          {dadosCheckin.documento} · Ordem {dadosCheckin.numeroCarregamento}
        </p>
      </div>

      <StepIndicator etapaAtual={dadosCheckin.etapaAtual} />

      <div className="conferencia">
        <div className="conferencia__abas">
          {abas.map((aba) => (
            <button
              key={aba.id}
              type="button"
              className={`conferencia__aba ${abaAtiva === aba.id ? 'conferencia__aba--ativa' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {statusPorAba[aba.id] && (
                <Check size={12} className="conferencia__check" />
              )}
              {aba.rotulo}
            </button>
          ))}
        </div>

        <div className="conferencia__conteudo">
          {abaAtiva === 'motorista' && (
            <div className="conferencia__campos">
              <div className="campo">
                <label htmlFor="nomeCompleto">
                  Nome completo <span className="campo__obrigatorio">*</span>
                </label>
                <input
                  id="nomeCompleto"
                  type="text"
                  value={conferencia.motorista.nomeCompleto}
                  onChange={(e) =>
                    atualizarMotorista('nomeCompleto', e.target.value)
                  }
                  placeholder="Nome completo do motorista"
                />
              </div>

              <div className="conferencia__linha">
                <div className="campo">
                  <label htmlFor="cpf">
                    CPF <span className="campo__obrigatorio">*</span>
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={conferencia.motorista.cpf}
                    onChange={(e) => atualizarMotorista('cpf', e.target.value)}
                    placeholder="CPF do motorista"
                  />
                </div>

                <div className="campo">
                  <label htmlFor="cnhNumero">CNH (opcional)</label>
                  <input
                    id="cnhNumero"
                    type="text"
                    value={conferencia.motorista.cnhNumero}
                    onChange={(e) =>
                      atualizarMotorista('cnhNumero', e.target.value)
                    }
                    placeholder="Número da CNH"
                  />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="telefoneContato">
                  Telefone de contato (WhatsApp){' '}
                  <span className="campo__obrigatorio">*</span>
                </label>
                <input
                  id="telefoneContato"
                  type="text"
                  value={conferencia.motorista.telefoneContato}
                  onChange={(e) =>
                    atualizarMotorista('telefoneContato', e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          )}

          {abaAtiva === 'veiculo' && (
            <div className="conferencia__campos">
              {/* Resumo somente-leitura: dados que já vieram da etapa de
                  Identificação, só para o usuário confirmar que está no
                  carregamento certo — não são editáveis aqui. */}
              <div className="conferencia__resumo">
                <div className="conferencia__resumo-linha">
                  <span className="conferencia__resumo-rotulo">
                    Ordem de Carregamento
                  </span>
                  <span className="conferencia__resumo-valor">
                    {dadosCheckin.numeroCarregamento}
                  </span>
                </div>
                <div className="conferencia__resumo-linha">
                  <span className="conferencia__resumo-rotulo">Cliente</span>
                  <span className="conferencia__resumo-valor">
                    {dadosCheckin.cliente}
                  </span>
                </div>
                <div className="conferencia__resumo-linha">
                  <span className="conferencia__resumo-rotulo">
                    Transportadora
                  </span>
                  <span className="conferencia__resumo-valor">
                    {dadosCheckin.transportadora}
                  </span>
                </div>
              </div>

              <div className="conferencia__linha">
                <div className="campo">
                  <label htmlFor="placa">
                    Placa do veículo{' '}
                    <span className="campo__obrigatorio">*</span>
                  </label>
                  <input
                    id="placa"
                    type="text"
                    value={conferencia.veiculo.placa}
                    onChange={(e) =>
                      atualizarVeiculo('placa', e.target.value.toUpperCase())
                    }
                    placeholder="ABC-1D34"
                  />
                </div>

                <div className="campo">
                  <label>
                    Tipo de operação{' '}
                    <span className="campo__obrigatorio">*</span>
                  </label>
                  <div className="conferencia__chips">
                    {tiposOperacao.map((tipo) => (
                      <Chip
                        key={tipo}
                        rotulo={tipo}
                        ativo={conferencia.veiculo.tipoOperacao === tipo}
                        onClick={() => atualizarVeiculo('tipoOperacao', tipo)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="campo">
                <label>
                  Tipo de veículo <span className="campo__obrigatorio">*</span>
                </label>
                <div className="conferencia__chips">
                  {tiposVeiculo.map((tipo) => (
                    <Chip
                      key={tipo}
                      rotulo={tipo}
                      ativo={conferencia.veiculo.tipoVeiculo === tipo}
                      onClick={() => atualizarVeiculo('tipoVeiculo', tipo)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Abas ainda não implementadas mostram um aviso simples no
              lugar do formulário. */}
          {abaAtiva !== 'motorista' && abaAtiva !== 'veiculo' && (
            <p className="conferencia__em-construcao">Em construção.</p>
          )}
        </div>

        <div className="conferencia__acoes">
          <button
            type="button"
            className="botao botao--secundario"
            onClick={() => navigate('/checkin/identificacao')}
          >
            Voltar
          </button>

          <button
            type="button"
            className="botao botao--primario conferencia__botao-continuar"
            disabled={!statusPorAba.motorista || !statusPorAba.veiculo}
          >
            Continuar
          </button>
        </div>
      </div>
    </>
  );
}

export default Conferencia;
