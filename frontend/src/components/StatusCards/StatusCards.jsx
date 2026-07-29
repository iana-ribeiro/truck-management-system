import './StatusCards.css';

function StatusCard({ titulo, valor, cor}) {
  return (
    <div className="status-card">
      <span className={`status-card__dot status-card__dot--${cor}`} />

      <h3 className="status-card__valor">{valor}</h3>

      <p className="status-card__titulo">{titulo}</p>
    </div>
  );
}

export default StatusCard;
