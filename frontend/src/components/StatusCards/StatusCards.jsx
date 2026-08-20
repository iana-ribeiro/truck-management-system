import "./StatusCards.css";

// Um "cartão" com um número e um rótulo (ex: "12 — Aguardando na Fila").
// A página Carregamentos.jsx renderiza vários StatusCard, um para cada
// total que ela já calculou (total do dia, na fila, em carregamento...).
// "cor" só muda a cor da bolinha, pra diferenciar visualmente os cards.
function StatusCard({ titulo, valor, cor, carregando }) {
  // Enquanto os dados ainda não chegaram do backend, mostramos um
  // "esqueleto" (blocos cinzas piscando) no lugar do número real, pra
  // indicar visualmente que algo está sendo carregado.
  if (carregando) {
    return (
      <div className="status-card">
        <span className="esqueleto status-card__dot-esqueleto" />
        <div className="esqueleto status-card__valor-esqueleto" />
        <div className="esqueleto status-card__titulo-esqueleto" />
      </div>
    );
  }

  return (
    <div className="status-card">
      <span className={`status-card__dot status-card__dot--${cor}`} />
      <h3 className="status-card__valor">{valor}</h3>
      <p className="status-card__titulo">{titulo}</p>
    </div>
  );
}

export default StatusCard;
