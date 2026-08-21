import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CheckCircle2, PartyPopper, RotateCcw } from "lucide-react";
import StepIndicator from "./components/StepIndicator/StepIndicator";
import {
  carregarConferencia,
  limparCheckin,
  limparConferencia,
} from "./checkinStorage";
import "./Confirmacao.css";

// Quantos segundos a tela de sucesso espera, mostrando a contagem
// regressiva, antes de voltar sozinha pro início do check-in.
const SEGUNDOS_ATE_REINICIAR = 15;

// Gera um número de ticket só pra preencher a tela enquanto não existe
// backend de verdade emitindo esse número. Quando a geração real (e a
// lógica de prioridade da fila, ainda em definição) estiver pronta, essa
// função sai e o número passa a vir da API.
function gerarNumeroTicketFake() {
  const numero = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
  return `CRG-${numero}`;
}

// Terceira e última etapa do check-in: mostra um resumo de tudo o que
// foi preenchido na Conferência, pra o motorista revisar antes de
// confirmar. Não tem formulário nenhum aqui — só leitura.
function Confirmacao() {
  // dadosCheckin (Ordem, Cliente, Transportadora, etapaAtual) vem do
  // Outlet context, igual nas outras etapas. Já os dados preenchidos na
  // Conferência (motorista, veículo, requisitos, segurança) não vêm por
  // aqui — eles só existem no sessionStorage, então recuperamos direto
  // de lá, do mesmo jeito que Conferencia.jsx faz ao abrir.
  const { dadosCheckin } = useOutletContext();
  const navigate = useNavigate();
  const conferencia = carregarConferencia();

  // null = tela de revisão (o resumo pra conferir); string = tela de
  // sucesso, guardando o número do ticket já gerado.
  const [ticket, setTicket] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(
    SEGUNDOS_ATE_REINICIAR,
  );

  // Sem os dados da Conferência salvos (ex: alguém entrou direto nessa
  // URL, sem passar pelas etapas anteriores), não tem o que confirmar
  // aqui — manda de volta pro começo do check-in.
  useEffect(() => {
    if (!conferencia) navigate("/checkin/identificacao", { replace: true });
  }, [conferencia, navigate]);

  // Contagem regressiva da tela de sucesso: só roda depois que o ticket
  // foi gerado. A cada segundo agenda a próxima diminuição; quando
  // chega a zero, reinicia o check-in sozinho (o cleanup do useEffect
  // cancela o timeout pendente se o componente sair da tela antes disso
  // — ex: o motorista clica em "Fazer novo check-in agora").
  useEffect(() => {
    if (!ticket) return;

    if (segundosRestantes <= 0) {
      reiniciarCheckin();
      return;
    }

    const id = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket, segundosRestantes]);

  if (!conferencia) return null;

  // Linhas da tabela "Motorista e Viagem": mistura dados que vieram da
  // Identificação (dadosCheckin) com os preenchidos na Conferência
  // (conferencia) — pro motorista, é tudo uma coisa só, um resumo do
  // que ele vai confirmar.
  const dadosMotoristaViagem = [
    { rotulo: "Nome", valor: conferencia.motorista.nomeCompleto },
    { rotulo: "CPF", valor: conferencia.motorista.cpf },
    { rotulo: "CNH", valor: conferencia.motorista.cnhNumero || "—" },
    { rotulo: "Telefone", valor: conferencia.motorista.telefoneContato },
    { rotulo: "Ordem", valor: dadosCheckin.numeroCarregamento },
    { rotulo: "Cliente", valor: dadosCheckin.cliente },
    { rotulo: "Operação", valor: conferencia.veiculo.tipoOperacao },
    { rotulo: "Placa", valor: conferencia.veiculo.placa },
    { rotulo: "Transportadora", valor: dadosCheckin.transportadora },
    { rotulo: "Tipo de Carga", valor: conferencia.veiculo.tipoVeiculo },
  ];

  // Ainda não existe backend gerando o ticket de verdade (nem a lógica
  // de prioridade da fila, que vai decidir esse número futuramente) —
  // por enquanto só troca pra tela de sucesso com um número fake e
  // dispara a contagem regressiva (veja o useEffect acima).
  function confirmarEGerarTicket() {
    setTicket(gerarNumeroTicketFake());
  }

  // Encerra o check-in local: apaga os dados temporários (documento
  // vinculado ao motorista/veículo, respostas de requisitos e
  // segurança) e volta pro início, liberado pro próximo motorista.
  // Chamada tanto pela contagem regressiva quanto pelo atalho "Fazer
  // novo check-in agora".
  function reiniciarCheckin() {
    limparConferencia();
    limparCheckin();
    navigate("/checkin");
  }

  // Ticket já gerado: mostra só a tela de sucesso, sem o cabeçalho nem
  // o StepIndicator da revisão — o check-in, pro motorista, já acabou.
  if (ticket) {
    return (
      // O wrapper existe só pra centralizar o cartão no viewport inteiro
      // (veja .confirmacao__sucesso-viewport no CSS) — as outras telas
      // do check-in continuam alinhadas no topo, como já eram.
      <div className="confirmacao__sucesso-viewport">
        <div className="confirmacao__sucesso">
          <div className="confirmacao__sucesso-icone">
            <PartyPopper size={28} />
          </div>

          <h1>Check-in concluído!</h1>
          <p>{conferencia.motorista.nomeCompleto}, seu ticket foi gerado com sucesso.</p>

          <div className="confirmacao__ticket-caixa">
            <div className="confirmacao__ticket-rotulo">Seu ticket</div>
            <div className="confirmacao__ticket-numero">#{ticket}</div>
          </div>

          <p>Aguarde no pátio até ser chamado no painel de atendimento.</p>

          <div className="confirmacao__sucesso-rodape">
            <p>Voltando à tela inicial em {segundosRestantes}s...</p>
            <button
              type="button"
              className="confirmacao__botao-novo-checkin"
              onClick={reiniciarCheckin}
            >
              <RotateCcw size={14} />
              Fazer novo check-in agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="confirmacao__cabecalho">
        <h1>Confirme seus dados</h1>
        <p>Revise as informações antes de gerar o ticket</p>
      </div>

      <StepIndicator etapaAtual={dadosCheckin.etapaAtual} />

      <div className="confirmacao">
        <div className="confirmacao__conteudo">
          <div>
            <h2 className="confirmacao__secao-titulo">Motorista e Viagem</h2>
            <div className="confirmacao__tabela">
              {dadosMotoristaViagem.map(({ rotulo, valor }) => (
                <div key={rotulo} className="confirmacao__linha">
                  <span className="confirmacao__rotulo">{rotulo}</span>
                  <span className="confirmacao__valor">{valor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="confirmacao__coluna-checks">
            {/* Requisitos e Segurança não têm resposta item por item (só
                um "concorda"/"não concorda" cada, veja Conferencia.jsx) —
                e o botão "Continuar" de lá só libera essa página quando
                as duas concordâncias já são "sim". Por isso os dois
                itens abaixo aparecem sempre confirmados. */}
            <div>
              <h2 className="confirmacao__secao-titulo">Requisitos</h2>
              <div className="confirmacao__check-item">
                <CheckCircle2 size={16} className="confirmacao__check-icone" />
                Concorda com os requisitos de carga
              </div>
            </div>

            <div>
              <h2 className="confirmacao__secao-titulo">Segurança</h2>
              <div className="confirmacao__check-item">
                <CheckCircle2 size={16} className="confirmacao__check-icone" />
                Concorda com as normas de segurança
              </div>
            </div>
          </div>
        </div>

        <div className="confirmacao__acoes">
          <button
            type="button"
            className="botao botao--secundario"
            onClick={() => navigate("/checkin/conferencia")}
          >
            Voltar
          </button>

          <button
            type="button"
            className="botao botao--sucesso confirmacao__botao-confirmar"
            onClick={confirmarEGerarTicket}
          >
            Confirmar e Gerar Ticket
          </button>
        </div>
      </div>
    </>
  );
}

export default Confirmacao;
