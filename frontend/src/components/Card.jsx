function Card(props) {
  return (
    <div>
      <h3>{props.título}</h3>
      <h2>{props.valor}</h2>
    </div>
  );
}

export default Card;
