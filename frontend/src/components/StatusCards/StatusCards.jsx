import Card from '../Card/Card';

function StatusCard() {
  return (
    <section>
      <Card título="Hoje" valor={120} />
      <Card título="Em andamento" valor={15} />
      <Card título="Finalizados" valor={98} />
      <Card título="Pendentes" valor={7} />
    </section>
  );
}

export default StatusCard;
