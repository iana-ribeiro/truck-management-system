import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Conferencia.css";

const abas = [
  { id: "motorista", rotulo: "Motorista" },
  { id: "veiculo", rotulo: "Veículo" },
  { id: "vistoria", rotulo: "Vistoria" },
  { id: "confirmacoes", rotulo: "Confirmações" },
];

function motoristaCompleto(motorista) {
  return Boolean(
    motorista.nomeCompleto &&
    motorista.numeroDocumento &&
    motorista.telefoneContato,
  );
}

function Conferencia() {
  const { dadosCheckin } = useOutletContext();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState("motorista");

  const [conferencia, setConferencia] = useState({
    motorista: {
      nomeCompleto: "",
      numeroDocumento: "",
      cnhNumero: "",
      telefoneContato: "",
    },
    veiculo: {},
    vistoria: {},
    confirmacoes: {},
  });

  function atualizarMotorista(campo, valor) {
    setConferencia((atual) => ({
      ...atual,
      motorista: { ...atual.motorista, [campo]: valor },
    }));
  }

  const statusPorAba = {
    motorista: motoristaCompleto(conferencia.motorista),
    veiculo: true, // provisório, até construirmos essa aba
    vistoria: true, // provisório
    confirmacoes: true, // provisório
  };

  return (
    <div className="conferencia">
      <p className="conferencia__resumo">
        {dadosCheckin.documento} · Ordem {dadosCheckin.numeroCarregamento}
      </p>

      <div className="conferencia__abas">
        {abas.map((aba) => (
          <button
            key={aba.id}
            type="button"
            className={`conferencia__aba ${abaAtiva === aba.id ? "conferencia__aba--ativa" : ""}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {statusPorAba[aba.id] && (
              <span className="conferencia__check">✓</span>
            )}
            {aba.rotulo}
          </button>
        ))}
      </div>

      <div className="conferencia__conteudo">
        {abaAtiva === "motorista" && (
          <div className="conferencia__campos">
            <div className="campo">
              <label htmlFor="nomeCompleto">Nome completo</label>
              <input
                id="nomeCompleto"
                type="text"
                value={conferencia.motorista.nomeCompleto}
                onChange={(e) =>
                  atualizarMotorista("nomeCompleto", e.target.value)
                }
                placeholder="Nome completo do motorista"
              />
            </div>

            <div className="conferencia__linha">
              <div className="campo">
                <label htmlFor="numeroDocumento">RG</label>
                <input
                  id="numeroDocumento"
                  type="text"
                  value={conferencia.motorista.numeroDocumento}
                  onChange={(e) =>
                    atualizarMotorista("numeroDocumento", e.target.value)
                  }
                  placeholder="Número do RG"
                />
              </div>

              <div className="campo">
                <label htmlFor="cnhNumero">CNH (opcional)</label>
                <input
                  id="cnhNumero"
                  type="text"
                  value={conferencia.motorista.cnhNumero}
                  onChange={(e) =>
                    atualizarMotorista("cnhNumero", e.target.value)
                  }
                  placeholder="Número da CNH"
                />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="telefoneContato">
                Telefone de contato (WhatsApp)
              </label>
              <input
                id="telefoneContato"
                type="text"
                value={conferencia.motorista.telefoneContato}
                onChange={(e) =>
                  atualizarMotorista("telefoneContato", e.target.value)
                }
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        )}

        {abaAtiva !== "motorista" && (
          <p className="conferencia__em-construcao">Em construção.</p>
        )}
      </div>

      <div className="conferencia__acoes">
        <button
          type="button"
          className="botao botao--secundario"
          onClick={() => navigate("/checkin/identificacao")}
        >
          Voltar
        </button>

        <button
          type="button"
          className="botao botao--primario conferencia__botao-continuar"
          disabled={!statusPorAba.motorista}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default Conferencia;
