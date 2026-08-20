import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Check } from 'lucide-react';
import StepIndicator from './components/StepIndicator/StepIndicator';
import { carregarConferencia, salvarConferencia } from './checkinStorage';
import './Conferencia.css';

// Define as quatro abas do formulário de conferência. O "id" é usado
// internamente (estado, chaves); o "rotulo" é só o texto mostrado.
const abas = [
  { id: 'motorista', rotulo: 'Motorista' },
  { id: 'veiculo', rotulo: 'Veículo' },
  { id: 'requisitos', rotulo: 'Requisitos' },
  { id: 'confirmacoes', rotulo: 'Normas de Segurança' },
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

// Itens fixos de conferência da aba "Requisitos" — regras de segurança
// que o motorista/carga precisam cumprir antes do carregamento. São só
// texto (mostrados juntos, como uma lista de regras); o motorista não
// responde item por item, só concorda ou não com a lista inteira (veja
// conferencia.requisitos.aceite mais abaixo). "detalhe" é opcional:
// usado só nos itens em que o critério tem uma medida ou explicação
// mais longa, mostrado em fonte menor ao lado do título (ex: "Forro").
const requisitosItens = [
  { chave: 'tampasBicas', titulo: 'Tampas das bicas com proteções fechadas dentro da carroceria' },
  { chave: 'lonaRasgada', titulo: 'Lona sem rasgos ou furos' },
  { chave: 'lonaDobrada', titulo: 'Lona sem dobras dentro da carroceria' },
  { chave: 'elasticos', titulo: 'Elásticos soltos entre as carretas e a parte frontal' },
  { chave: 'correntes', titulo: 'Correntes da carroceria soltas' },
  { chave: 'assoalho', titulo: 'Assoalho limpo, sem resíduos e sem danos' },
  { chave: 'portas', titulo: 'Portas com os pinos devidamente travados' },
  { chave: 'arcos', titulo: 'Arcos retirados guardados embaixo da carreta (fora da carroceria)' },
  {
    chave: 'forro',
    titulo: 'Forro',
    detalhe: 'Mínimo 2x4m por bloco a carregar, máximo 4x4m',
  },
  {
    chave: 'pneus',
    titulo: 'Condições dos pneus',
    detalhe: 'Cheios, sem deformações ("barriga") ou malha exposta',
  },
  {
    chave: 'sinalizacao',
    titulo: 'Sinalização',
    detalhe: 'Sistema de sinalização e alarme de ré funcionando corretamente',
  },
];

// Mesma ideia de requisitosItens, mas para a aba "Normas de Segurança":
// regras de conduta dentro da unidade (e não do veículo/carga).
const normasSegurancaItens = [
  { chave: 'subirCarroceria', titulo: 'Proibido subir na carroceria dos caminhões' },
  { chave: 'epis', titulo: "Uso obrigatório dos EPI's: capacete, óculos de segurança e botina" },
  {
    chave: 'permanenciaMotorista',
    titulo:
      'O motorista deve permanecer na cabine durante o carregamento ou nas cadeiras de espera em frente à sala da nota fiscal',
  },
  { chave: 'faixaPedestre', titulo: 'Caso precise ir a pé até a portaria, utilize a faixa de pedestre' },
  { chave: 'areaVidro', titulo: 'Proibido acessar a área de armazenagem do vidro e tocar no vidro' },
  { chave: 'carroceriaLimpa', titulo: 'A carroceria deve estar limpa e organizada, sem materiais soltos' },
  { chave: 'eletronicos', titulo: 'Proibido o uso de aparelhos eletrônicos durante a movimentação do veículo' },
  { chave: 'guardian', titulo: 'Não é permitido acessar a Guardian com acompanhante' },
  { chave: 'fumar', titulo: 'É proibido fumar nas dependências da empresa' },
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

// Mesma ideia, mas para as abas "Requisitos" e "Normas de Segurança":
// ambas só têm uma resposta (concorda ou não com a lista inteira de
// regras), então a mesma função serve pras duas. Só é considerada
// completa quando o motorista CONCORDA — "Não concordo" não libera a
// navegação, já que sem concordar ele não pode carregar.
function listaDeRegrasCompleta(estado) {
  return estado.aceite === 'sim';
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

// Par de botões pra escolher entre "sim" e "nao". Os rótulos são
// customizáveis (rotuloSim/rotuloNao) porque o mesmo par de opções é
// usado com textos diferentes dependendo do contexto — na aba
// Requisitos, por exemplo, são "Concordo"/"Não concordo" em vez de
// "Sim"/"Não".
function RespostaToggle({ valor, onChange, rotuloSim = 'Sim', rotuloNao = 'Não' }) {
  return (
    <div className="conferencia__resposta">
      <button
        type="button"
        className={`conferencia__resposta-botao conferencia__resposta-botao--sim ${
          valor === 'sim' ? 'conferencia__resposta-botao--ativo' : ''
        }`}
        onClick={() => onChange('sim')}
      >
        {rotuloSim}
      </button>
      <button
        type="button"
        className={`conferencia__resposta-botao conferencia__resposta-botao--nao ${
          valor === 'nao' ? 'conferencia__resposta-botao--ativo' : ''
        }`}
        onClick={() => onChange('nao')}
      >
        {rotuloNao}
      </button>
    </div>
  );
}

// Lista de regras em texto (cada uma com "titulo" e, opcionalmente,
// "detalhe") seguida de uma única pergunta de concordância. Usado tanto
// na aba Requisitos quanto na aba Normas de Segurança — a estrutura
// visual é idêntica nas duas, só mudam os itens e o texto da pergunta.
function ListaDeRegras({ itens, pergunta, valor, onChange }) {
  return (
    <div className="conferencia__regras">
      <ul className="conferencia__regras-lista">
        {itens.map(({ chave, titulo, detalhe }) => (
          <li key={chave}>
            {titulo}
            {/* "detalhe" só existe nos itens em que o critério tem uma
                medida ou explicação mais longa (ex: "Forro"). */}
            {detalhe && (
              <span className="conferencia__regras-detalhe"> — {detalhe}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="conferencia__regras-resposta">
        <span>{pergunta}</span>
        <RespostaToggle
          valor={valor}
          onChange={onChange}
          rotuloSim="Concordo"
          rotuloNao="Não concordo"
        />
      </div>
    </div>
  );
}

// Segunda etapa do check-in: confirma e completa os dados do motorista,
// do veículo e os requisitos de segurança antes de liberar o carregamento.
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
  const [conferencia, setConferencia] = useState(() => {
    const padrao = {
      motorista: {
        nomeCompleto: '',
        // Vem pronto da etapa de Identificação e fica travado (input
        // disabled no JSX) — não faz sentido o motorista mudar o CPF
        // aqui depois de já ter se identificado com ele.
        cpf: dadosCheckin.documento,
        cnhNumero: '',
        telefoneContato: '',
      },
      veiculo: {
        placa: '',
        tipoOperacao: '',
        tipoVeiculo: '',
      },
      // "aceite" guarda a resposta única ("sim"/"nao") de concordância
      // com toda a lista de itens da aba — sem resposta ainda, fica
      // como string vazia. Mesmo formato pras duas listas de regras
      // (Requisitos e Normas de Segurança).
      requisitos: { aceite: '' },
      confirmacoes: { aceite: '' },
    };

    const salvo = carregarConferencia();
    if (!salvo) return padrao;

    // Mescla o que foi salvo por cima do padrão, aba por aba, em vez de
    // usar "salvo" direto: se o formulário ganhar um campo novo (como
    // aconteceu quando "vistoria" virou "requisitos"), quem já tinha um
    // check-in salvo no sessionStorage numa versão antiga não fica com
    // uma aba faltando e a tela quebrando — só entra com essa aba em
    // branco, igual a quem está começando agora.
    return {
      motorista: { ...padrao.motorista, ...salvo.motorista },
      veiculo: { ...padrao.veiculo, ...salvo.veiculo },
      requisitos: { ...padrao.requisitos, ...salvo.requisitos },
      confirmacoes: { ...padrao.confirmacoes, ...salvo.confirmacoes },
    };
  });

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

  // Grava a resposta ("sim"/"nao") de concordância com os requisitos.
  function responderRequisitos(resposta) {
    setConferencia((atual) => ({
      ...atual,
      requisitos: { ...atual.requisitos, aceite: resposta },
    }));
  }

  // Mesma lógica de responderRequisitos, agora pra aba Normas de Segurança.
  function responderConfirmacoes(resposta) {
    setConferencia((atual) => ({
      ...atual,
      confirmacoes: { ...atual.confirmacoes, aceite: resposta },
    }));
  }

  // Indica, para cada aba, se ela já está completa — decide se o ícone
  // de check aparece ao lado do nome da aba e se o botão "Continuar"
  // pode ser clicado.
  const statusPorAba = {
    motorista: motoristaCompleto(conferencia.motorista),
    veiculo: veiculoCompleto(conferencia.veiculo),
    requisitos: listaDeRegrasCompleta(conferencia.requisitos),
    confirmacoes: listaDeRegrasCompleta(conferencia.confirmacoes),
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
          {/* As quatro abas ficam sempre montadas, sobrepostas na mesma
              célula do grid (veja .conferencia__painel no CSS) — só a
              ativa fica visível. Assim a caixa branca se ajusta sozinha
              à altura da aba mais alta (hoje, Requisitos) e não muda de
              tamanho quando o usuário troca de aba. */}
          <div
            className={`conferencia__painel ${
              abaAtiva === 'motorista' ? 'conferencia__painel--ativo' : ''
            }`}
          >
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
                  <label htmlFor="cpf">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    value={conferencia.motorista.cpf}
                    disabled
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
          </div>

          <div
            className={`conferencia__painel ${
              abaAtiva === 'veiculo' ? 'conferencia__painel--ativo' : ''
            }`}
          >
            <div className="conferencia__campos">
              {/* Campos travados (disabled), igual o CPF na aba Motorista:
                  vêm prontos da etapa de Identificação — hoje isso é
                  dadosCheckin, mas assim que existir um banco de dados
                  real, essas mesmas informações virão de lá. O motorista
                  só confirma visualmente, não edita. */}
              <div className="campo">
                <label htmlFor="numeroCarregamento">
                  Ordem de Carregamento
                </label>
                <input
                  id="numeroCarregamento"
                  type="text"
                  value={dadosCheckin.numeroCarregamento}
                  disabled
                />
              </div>

              <div className="conferencia__linha">
                <div className="campo">
                  <label htmlFor="cliente">Cliente</label>
                  <input
                    id="cliente"
                    type="text"
                    value={dadosCheckin.cliente}
                    disabled
                  />
                </div>

                <div className="campo">
                  <label htmlFor="transportadora">Transportadora</label>
                  <input
                    id="transportadora"
                    type="text"
                    value={dadosCheckin.transportadora}
                    disabled
                  />
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
          </div>

          <div
            className={`conferencia__painel ${
              abaAtiva === 'requisitos' ? 'conferencia__painel--ativo' : ''
            }`}
          >
            <ListaDeRegras
              itens={requisitosItens}
              pergunta="Está ciente e concorda com todos os requisitos acima?"
              valor={conferencia.requisitos.aceite}
              onChange={responderRequisitos}
            />
          </div>

          <div
            className={`conferencia__painel ${
              abaAtiva === 'confirmacoes' ? 'conferencia__painel--ativo' : ''
            }`}
          >
            <ListaDeRegras
              itens={normasSegurancaItens}
              pergunta="Está ciente e concorda com todas as normas de segurança acima?"
              valor={conferencia.confirmacoes.aceite}
              onChange={responderConfirmacoes}
            />
          </div>
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
            disabled={
              !statusPorAba.motorista ||
              !statusPorAba.veiculo ||
              !statusPorAba.requisitos ||
              !statusPorAba.confirmacoes
            }
          >
            Continuar
          </button>
        </div>
      </div>
    </>
  );
}

export default Conferencia;
