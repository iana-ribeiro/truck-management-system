import Card from '../Card/Card';
import './StatusCards.css';

function StatusCard({totalOrdens, totalClientes, totalPlacas, totalCarregamentos}) {
  return (
    <section className="status-cards">
      <Card título="Ordens" valor={totalOrdens} />
      <Card título="Clientes" valor={totalClientes} />
      <Card título="Placas" valor={totalPlacas} />
      <Card título="Carregamentos" valor={totalCarregamentos} />
    </section>
  );
}

export default StatusCard;
