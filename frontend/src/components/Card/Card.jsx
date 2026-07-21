import './Card.css';

function Card({ titulo, valor }) {
  return (
    <article className="card">
      <h3>{titulo}</h3>
      <span>{valor}</span>
    </article>
  );
}

export default Card;
