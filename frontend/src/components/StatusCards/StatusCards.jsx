import './StatusCards.css';

function StatusCard({ titulo, valor, icone}) {
  return (
    <div className="status-card">
    
      <div className='status-card__icone'>
      {icone}
      </div>

      <h3 className='status-card__valor'>
      {valor}
      </h3>

      <p className='status-card__titulo'>
      {titulo}
      </p>

    </div>
  );
}

export default StatusCard;
